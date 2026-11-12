# Omnica English — Sally ad v1

[Claude, 2026-11-12] First finished edit of Sally's ad: her on-camera takes, the phone screen recordings, Russian subtitles, feature labels and an endcard. 1080×1920, 30 fps, H.264 + AAC at −14 LUFS.

## Watch

| File | Length | What |
|---|---|---|
| `exports/omnica-sally-ad-master.mp4` | 46 s | Full ad: every feature. Warm audiences / profile pin. |
| `exports/omnica-sally-ad-short.mp4` | 34 s | Recommended for cold traffic: drops the calendar beat and two bridging lines. |
| `exports/omnica-sally-ad-hook-b.mp4` | 44 s | Master with the other hook ("Do you learn words but never use them?") for an A/B test. |

Each has a matching `.srt` (Russian) for uploading as captions. Subtitles are also burned in, so every cut works muted.

## What the edit is

Hook (English, to camera) → «индивидуальный урок — это только начало» → lesson words → flashcards → free library → homework → teacher's feedback → calendar → WhatsApp CTA → endcard.

Changes from the script PDF and rough-cut v5, and why:

- **One hook, not two.** Rough-cut v5 opened with the English hook *and* «Хотите никогда не забывать новые слова?». The second one is cut: it delays the product by 2.5 s and "never forget" is a promise the brief says not to make.
- **Master hook is "You close the laptop and the English just stops."** It sets up «урок — это только начало» directly. The owner's "learn words but never use them" hook is kept as `hook-b` so the two can be tested against each other.
- **«…с носителями языка и иностранцами» is left out.** It is not in the verified feature list in the brief, «иностранцами» reads oddly, and it lands between the last feature and the CTA. The take is good if you want it back — add a beat in `edit.json`.
- **One CTA: WhatsApp.** The endcard repeats it. No price is burned into the video (prices change; put it in the caption).
- **Sally is reframed.** The camera files are 4K and wide; every on-camera shot is punched in to head-and-shoulders and brightened. Alternate shots are slightly tighter so the cuts between takes look deliberate.
- **Sound comes from the voice recorder**, synced to picture, not from the camera mic.
- **Text stays out of the Reels UI zones** (top 14 %, bottom 26 %).

## Edit it

`edit.json` is the whole edit: which take each beat uses, the subtitle chunks, the screen recording and where it starts, the label, and which beats make up each cut.

    npm ci
    npm run studio          # preview
    npm run render          # all cuts → exports/
    node tools/render.mjs short

Rendering needs a Chrome binary; set `CHROME_PATH` if the default is not found.

`public/sally/` and `public/audio/` are already cut, so re-timing subtitles, swapping screens, reordering or dropping beats needs nothing else. To pick a **different take**, change `sources` in `edit.json` and re-cut from the raw footage (Drive folder "Sally's AD": five camera files, the voice recording, and `sally-ad-handoff/transcripts/`):

    RAW_DIR=/path/to/raw python3 tools/build_assets.py

`voiceOffset` is the camera→recorder offset from `transcripts/align.txt`.

## Not done / to check

- **Nobody has listened to it.** Cuts were placed from the word-level transcripts and checked by level at each cut point, and loudness is measured, but the edit was made without ears. Listen once for clipped words, breaths and pacing.
- **No music.** There was no licensed track in the handoff. Add one in Instagram or send a file.
- The WhatsApp CTA assumes the ad's button / bio link opens WhatsApp.
- Screen recordings use the fictional demo learner from the handoff.
