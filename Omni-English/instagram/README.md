# Instagram assets

This folder contains the first six Ominca English launch posts.

## Start here

- `content-plan.md` — exact strategy, sequence, Reel scripts, captions, slide copy, recording checklist, and publication gates.
- `assets/launch-grid-preview.png` — recommended profile layout with the three pinned posts on the first row.
- `assets/carousel-proof-sheet.png` — all 15 carousel slides in one review image.
- `generate_assets.py` — reproducible renderer for all covers and carousels.

## Asset map

- `assets/post-01-founder-reel/` — Reel cover; record the founder video from the script in `content-plan.md`.
- `assets/post-02-agree-carousel/` — five publishable 1080×1350 slides.
- `assets/post-03-method-carousel/` — five 1080×1350 slides; **hold until the real learner flow is verified**.
- `assets/post-04-work-reel/` — Reel cover; record the face-led teaching video.
- `assets/post-05-pricing-carousel/` — five publishable 1080×1350 slides.
- `assets/post-06-travel-reel/` — Reel cover; record the face-led travel-English video.

## Important production note

The three Reel covers are usable graphic fallbacks. The better final version is to use a clean still frame of the founder with the same headline treatment so the grid visibly contains a real person. Once a vertical portrait or video frame is supplied, it can be integrated without rewriting the content.

## Verification

- Carousel images: 1080×1350.
- Reel covers: 1080×1920 with the headline positioned inside the centered feed-safe crop.
- Brand colors extracted from the supplied logo: yellow `#FFCA00`, purple `#6716A3`.
- Visual proof review completed: labels and price text render without clipping or missing glyphs.
- Design self-audit: **0/10 compositional slop flags**. The assets use the Ominca palette rather than a generic tech gradient; each slide teaches or communicates one idea; no fake metrics, stock people, testimonials, glass effects, icon-card grids, or unsupported proof claims are used.

## Regenerating

The local Pillow dependency was isolated under `/tmp/ominca-social-venv` so the workspace stays clean. Regenerate with:

```bash
env -u PYTHONPATH /tmp/ominca-social-venv/bin/python instagram/generate_assets.py
```
