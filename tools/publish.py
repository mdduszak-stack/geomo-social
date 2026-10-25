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
PAGE = os.environ.get("FB_PAGE_ID") or "61595919502608"
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
    print(datetime.now(timezone.utc).strftime("%H:%M:%SZ"), *a, flush=True)


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
        c = call("POST", f"{ig}/media", media_type="REELS", video_url=media[0], caption=spec["caption"], share_to_feed="true")["id"]
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
    # Accept a user token too: swap it for the Page token (works for page tokens as well).
    try:
        pt = call("GET", PAGE, fields="access_token").get("access_token")
        if pt:
            TOKEN = pt
    except Exception as e:
        log("could not read page token, using the given token as is:", str(e)[:200])
    queue = json.load(open(os.path.join(ROOT, "queue.json")))
    state = json.load(open(STATE)) if os.path.exists(STATE) else {}
    if len(sys.argv) > 2 and sys.argv[1] == "--check":
        code = sys.argv[2]
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
        except Exception as e:
            failed = True
            done["last_error"] = str(e)[:500]
            log(f"{code}: ERROR {e}")
        json.dump(state, open(STATE, "w"), indent=2, ensure_ascii=False)
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
