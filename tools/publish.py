#!/usr/bin/env python3
"""Geomo social publisher (Meta Graph API).

Reads queue.json, publishes every post whose publish_at has passed and that is not yet
in state/published.json:
  - Instagram: carousel of videos (or images), or a single reel.
  - Facebook page: one video (FB turns videos into reels).

Env: META_PAGE_TOKEN (Page access token, set as a GitHub secret), FB_PAGE_ID.
Media URLs are built from repo paths via jsDelivr, pinned to the current commit.

Usage: publish.py            -> publish what is due
       publish.py --check P05 -> dry run: verify token/ids and prepare IG containers, no publishing
"""
import json, os, sys, time, urllib.parse, urllib.request, urllib.error
from datetime import datetime, timezone

GV = os.environ.get("GRAPH_VERSION", "v26.0")
API = f"https://graph.facebook.com/{GV}"
TOKEN = os.environ.get("META_PAGE_TOKEN", "")
PAGE = os.environ.get("FB_PAGE_ID") or ""
REPO = os.environ.get("GITHUB_REPOSITORY", "mdduszak-stack/geomo-social")
SHA = os.environ.get("GITHUB_SHA", "main")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, "state", "published.json")


def url_for(path):
    return path if path.startswith("http") else f"https://cdn.jsdelivr.net/gh/{REPO}@{SHA}/{path}"


def call(method, endpoint, **params):
    params["access_token"] = TOKEN
    data = urllib.parse.urlencode(params).encode()
    if method == "GET":
        req = urllib.request.Request(f"{API}/{endpoint}?{data.decode()}")
    else:
        req = urllib.request.Request(f"{API}/{endpoint}", data=data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise RuntimeError(f"{method} {endpoint} -> HTTP {e.code}: {body}") from None


def log(*a):
    msg = " ".join(str(x) for x in a)
    print(datetime.now(timezone.utc).strftime("%H:%M:%SZ"), msg, flush=True)
    if os.environ.get("GITHUB_ACTIONS"):
        kind = "error" if "ERROR" in msg else "notice"
        print(f"::{kind}::{msg[:900]}", flush=True)


def wait_ready(cid, label, timeout=900):
    t0 = time.time()
    while True:
        st = call("GET", cid, fields="status_code,status").get("status_code")
        if st == "FINISHED":
            return
        if st in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"{label}: container {cid} status {st}")
        if time.time() - t0 > timeout:
            raise RuntimeError(f"{label}: container {cid} not ready after {timeout}s (last: {st})")
        time.sleep(10)


def ig_user():
    r = call("GET", PAGE, fields="instagram_business_account")
    return r["instagram_business_account"]["id"]


def ig_prepare(ig, post):
    """Create (but do not publish) the IG container. Returns creation id."""
    spec = post["ig"]
    media = [url_for(p) for p in spec["media"]]
    if spec.get("type") == "reel":
        extra = {}
        if spec.get("audio"):   # licensed track from the Instagram Audio API (ig_audio), mixed over the video
            a = spec["audio"]
            extra["audio_configuration"] = json.dumps({"audio_id": str(a["id"]), "audio_volume": a.get("audio_volume", 60), "video_volume": a.get("video_volume", 100)})
        c = call("POST", f"{ig}/media", media_type="REELS", video_url=media[0], caption=spec["caption"], share_to_feed="true", **extra)["id"]
        wait_ready(c, "reel")
        return c
    kids = []
    for i, u in enumerate(media, 1):
        if u.lower().endswith((".mp4", ".mov")):
            k = call("POST", f"{ig}/media", media_type="VIDEO", is_carousel_item="true", video_url=u)["id"]
        else:
            k = call("POST", f"{ig}/media", is_carousel_item="true", image_url=u)["id"]
        log(f"  item {i}/{len(media)} container {k}")
        kids.append(k)
    for i, k in enumerate(kids, 1):
        wait_ready(k, f"item {i}")
    c = call("POST", f"{ig}/media", media_type="CAROUSEL", children=",".join(kids), caption=spec["caption"])["id"]
    wait_ready(c, "carousel")
    return c


def fb_publish(post):
    spec = post["fb"]
    r = call("POST", f"{PAGE}/videos", file_url=url_for(spec["video"]), description=spec["caption"])
    return r.get("id")


def main():
    global TOKEN
    if not TOKEN:
        print("META_PAGE_TOKEN not set yet - nothing to do.")
        return
    global PAGE
    # Accept a user token: find the Geomo page in me/accounts and use its Page token.
    try:
        accs = call("GET", "me/accounts", fields="id,name,access_token").get("data", [])
        log("pages visible to token:", ", ".join(f"{a['name']} ({a['id']})" for a in accs) or "none")
        page = next((a for a in accs if (PAGE and a["id"] == PAGE) or (not PAGE and a["name"].strip().lower() == "geomo")), None)
        if page:
            PAGE, TOKEN = page["id"], page["access_token"]
    except Exception as e:
        log("me/accounts not available (probably already a Page token):", str(e)[:200])
    if not PAGE:
        PAGE = call("GET", "me", fields="id")["id"]
    queue = json.load(open(os.path.join(ROOT, "queue.json")))
    state = json.load(open(STATE)) if os.path.exists(STATE) else {}
    if len(sys.argv) > 2 and sys.argv[1] == "--check":
        code = sys.argv[2]
        if code.startswith("audio"):   # check=audio or audio:<search>: list music usable via the API
            ig = ig_user(); qy = code.split(":", 1)[1] if ":" in code else ""
            params = dict(audio_type="music", user_id=ig)
            if qy: params["search_query"] = qy
            r = call("GET", "ig_audio", **params)
            items = r.get("data", [])
            log(f"AUDIO '{qy or 'trending'}': {len(items)} tracks | " + " | ".join(
                f"{x.get('id')}: {x.get('title')} - {x.get('display_artist') or x.get('artist')} ({x.get('duration_in_ms') or x.get('duration')})" for x in items[:25]))
            if items: log("first item fields: " + ",".join(items[0].keys()))
            return
        me = call("GET", PAGE, fields="name")
        ig = ig_user()
        log(f"page OK: {me.get('name')} · IG account {ig}")
        post = queue[code]
        if "ig" in post:
            c = ig_prepare(ig, post)
            log(f"CHECK OK: IG container {c} ready (NOT published; it expires on its own)")
        if "fb" in post:
            log("FB video URL:", url_for(post["fb"]["video"]))
        return
    now = datetime.now(timezone.utc)
    ig = None
    failed = False
    for code, post in queue.items():
        when = datetime.fromisoformat(post["publish_at"])
        if when > now:
            continue
        done = state.setdefault(code, {})
        # back off after a Meta rate/spam limit (code 368): retrying every 10 min makes the block worse
        if "368" in done.get("last_error", "") and done.get("last_try"):
            if (now - datetime.fromisoformat(done["last_try"])).total_seconds() < 3 * 3600:
                log(f"{code}: waiting after Meta limit (code 368), next try after 3 h")
                continue
        done["last_try"] = now.isoformat()
        try:
            if "ig" in post and "ig" not in done:
                ig = ig or ig_user()
                log(f"{code}: preparing Instagram")
                c = ig_prepare(ig, post)
                mid = call("POST", f"{ig}/media_publish", creation_id=c)["id"]
                done["ig"] = {"id": mid, "at": datetime.now(timezone.utc).isoformat()}
                log(f"{code}: Instagram published {mid}")
            if "fb" in post and "fb" not in done:
                log(f"{code}: publishing Facebook video")
                vid = fb_publish(post)
                done["fb"] = {"id": vid, "at": datetime.now(timezone.utc).isoformat()}
                log(f"{code}: Facebook published {vid}")
            done.pop("last_error", None)
        except Exception as e:
            failed = True
            done["last_error"] = str(e)[:500]
            log(f"{code}: ERROR {e}")
        json.dump(state, open(STATE, "w"), indent=2, ensure_ascii=False)
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log("ERROR", str(e))
        sys.exit(1)
