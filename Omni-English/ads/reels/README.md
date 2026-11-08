# Omnica English — ad cuts (`ads/reels/`)

Timed copy for the Sally presenter ads. Edit text in `timeline.json`; the script sheet is `sally-3-ads.md`.

## State of this folder — read first

**The renderer is not here.** `overlay.html` and `render_overlay.mjs` (the graphics layer + PNG/SRT renderer that used to live in this folder) are **not on disk anywhere on this machine** as of 2026-11-02, and they are not in the app repo's git history. `~/Omni-English` is not a git repository, so there is no history to restore them from.

What that means in practice:

- `timeline.json` is **timed copy**, not a render job. Nothing here produces frames, an SRT, or a `overlay_<cut>.mov`.
- **No frame-level QA has been run** on these cuts: the longest subtitle has not been read back from a composited frame, so the three-line wrap, the `₸` glyph and the label/connector clearance are all unverified.
- The only video creative that exists on this machine is a **Remotion motion test**: `~/Desktop/Projects/Next.js OmniClass/assets/marketing/video/sally-motion-test-v1/` (1080×1920, 30 fps, 18 s, урок → слова → карточки → домашнее задание → финал). It is a different pipeline and does not read `timeline.json`.

Rebuild the overlay renderer before promising anyone a finished cut.

## Cuts

| Cut | Length | Area it sells | Hook mechanic |
|---|---|---|---|
| `a1_homework` | 20 s | Homework-feedback loop | Flat statement naming the situation |
| `a2_after_lesson` | 20 s | Lesson summary + self-check quiz | Question |
| `a3_repetition` | 20 s | Spaced-repetition review system | Short confession / contradiction |

Cue schema per cut: `duration`, `fps`, `w`, `h`, `brand`, `cues[]`, `endcard`. Each cue is `{ start, end, text, label, shot }` — `text` is the Russian subtitle the viewer reads, `label` is the yellow uppercase feature tag (or `null`), `shot` is editorial (`sally` / `screen`) and ignored by the renderer. The English line Sally speaks is recorded as an extra `spoken_en` key, which the renderer ignores, so the SRT stays Russian-only.

A cue's subtitle must fit the band in at most three lines — the label and connector stack above the band's **measured** height, so a longer line is exactly what breaks the layout.

## Render (once the renderer exists)

```bash
cd ~/Omni-English/ads/reels
CHROME_PATH="$(ls -d ~/.cache/puppeteer/chrome/*/chrome-mac-arm64/*.app/Contents/MacOS/* | head -1)" \
  CUT=a1_homework node render_overlay.mjs
```

Outputs `frames_<cut>/f00000.png …` (transparent) plus `<cut>.srt`; `PRORES=1` also writes `overlay_<cut>.mov`.

**Pitfall — browser launch dies with `Could not find Chrome (ver. …)`:** the puppeteer pinned in `node_modules` may want a Chrome build that is not in `~/.cache/puppeteer`. Point `CHROME_PATH` at the build that *is* installed (the `ls` above) — do not reinstall browsers or upgrade puppeteer.

## Frame-level QA

Composite a transparent frame over a flat colour, then read the PNG:

```bash
ffmpeg -y -loglevel error -f lavfi -i color=c=0x2E2440:s=1080x1920 \
  -i frames_a1_homework/f00510.png -filter_complex "[1:v]format=rgba[o];[0:v][o]overlay=0:0" \
  -frames:v 1 /tmp/frame.png
```

Check on every cut: the longest subtitle wraps inside its band; `₸` renders as the tenge sign, not a fallback box; the label pill never collides with the text or the connector. On the endcard, confirm logo, headline, button and domain sit clear of the Reels UI zones (bottom ~26% and right ~11% are covered at view time).
