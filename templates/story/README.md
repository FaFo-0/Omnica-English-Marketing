# Story template

One renderer for every Instagram Story and highlight cover. It uses the colors and fonts from `brand/brand.md`.

```
node templates/story/render.cjs content/<piece>        # all
node templates/story/render.cjs content/<piece> 2-3    # one story
```
Run from this repo's root. It uses Playwright, Lucide icons and the logo files from the app repo (`FaFo-0/omnica-english`, cloned next to this one, or set `OMNICA_APP=/path/to/app`). In Claude cloud sessions, prefix the command with `NODE_USE_ENV_PROXY=1`.

A piece's `stories.json` lists highlights (`slug`, `icon`), each with stories:

| Field | Meaning |
|---|---|
| `bg` | `purple` · `cream` · `yellow` |
| `title` | Bold lines (Inter ExtraBold) |
| `accent` | Italic lines (PT Serif Italic), at most one per story |
| `body` | Small supporting lines |
| `visual` | `screenshot` (`src`, `crop` = [top, bottom] in phone CSS px, optional `width`) · `steps` · `chat` · `panels` · `icon` · `mark` (logo) · `link` (empty space and an arrow for Instagram's Link sticker) |

Icons are Lucide names (the same set as the app). Output goes to `stories/` (1080 × 1920) and `covers/` (1080 × 1080).
