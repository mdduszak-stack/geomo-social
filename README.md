# geomo-social

Public media for Geomo (geomo.app) social posts: carousel slides (PNG) and animations (MP4), one folder per post (`posts/<date>-<code>/`).
No app code here. Files are used by Meta Business Suite and, later, the Meta publishing API.

## Automatic publishing
- `queue.json` - posts with `publish_at` (Warsaw time), Instagram carousel media and caption, Facebook video and caption.
- `tools/publish.py` - publishes due posts through the Meta Graph API (Instagram carousel of videos, Facebook video).
- `.github/workflows/publish.yml` - runs every 10 minutes; manual run with `check = P05` does a dry run (prepares the Instagram post without publishing).
- `state/published.json` - what has already been published (written by the workflow).
- Secret needed: `META_PAGE_TOKEN` (Settings → Secrets and variables → Actions). Optional variable: `FB_PAGE_ID`.
