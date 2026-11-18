# Content engine — Reels

Remotion project for the daily Reels (plan: `content-engine.md`). One composition per piece in `src/index.jsx`; `render.mjs` maps each to its `content/` folder and writes `reel.mp4` + `cover.png` there.

```
npm install
npm run studio                 # live preview
node render.mjs [Composition]  # render all, or one
```

Cloud sessions: prefix with `NODE_USE_ENV_PROXY=1 REMOTION_BROWSER=/opt/pw-browsers/chromium`. The logo is copied from the app repo at render time (never committed here). Run `russian-check` on every script before rendering.
