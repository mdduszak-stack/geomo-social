# Geomo studio · how a post is made

One source file per post (`studio/posts/<CODE>.js`). Static PNG and animated MP4 are rendered from the same file, so a text or number fix flows into the animation automatically.

## Steps
1. **Brief** (new formats only): hook, slide plan, numbers with sources. Maciej says OK.
2. **Static draft**: write `posts/<CODE>.js`, render `node studio/make.js <CODE> png`, check `out/<CODE>/sheet.png`.
   Put the post in the schedule (HARMONOGRAM) with status `review` ("Do akceptacji"): slides + caption. Maciej comments per slide and approves there.
3. **Fixes** on the static version until approved (only edit the source file, re-render PNG).
4. **Motion**: fill `CHOREO.<CODE>`, render `node studio/make.js <CODE> mp4` (or only some slides: `mp4 3,5`). Review a contact sheet + one video. Only motion remarks at this stage.
5. **Queue**: copy `out/<CODE>/mp4/*.mp4` to `posts/<date>-<CODE>/mp4/`, build the Facebook video (concat of all slides; reels for vertical videos), add the entry to `queue.json` (Warsaw time, IG caption with "Link in bio", FB caption with the UTM link), push. GitHub Actions publishes it.
6. Late fix: edit the source, re-render the affected slide, replace the file in `posts/...`, push before `publish_at`.

## Rules
- Design system "Geomo" is the only visual source (components in `engine/bundle.js`, tokens in `engine/tokens.css`).
- Never invent numbers: geometry from the newest `data/backups/*.json` of the private app repo, handlebar numbers and fit scores from geomo.app or the app algorithm. Keep sources in the post file and in `opis.md` for Maciej.
- App code and bike database stay private: do not copy them into this public repo. Run fit calculations from a local clone of the private repo.
- Each slide: what it is → where it is measured → two bikes with real data → what it means (pattern of P07).
- Captions: Instagram in English, "Link in bio". Facebook: same text with `https://geomo.app/fbi?utm_source=facebook&utm_medium=social&utm_campaign=fb_<code>`.
- Stories with stickers (poll, link) stay manual (API does not support stickers); quiz stickers are replaced by polls.

## Render requirements
Node with `playwright` (Chromium) and `ffmpeg`. `CHROME=/path/to/chrome` to use a specific browser. Output: `studio/out/` (not committed).
