# Omnica English — Sally ad v1

[Claude, 2026-11-12] One finished video built on **rough-cut v5**: `exports/omnica-sally-ad.mp4` (47 s, 1080×1920, 30 fps) plus a Russian `.srt`.

## What it is

Rough-cut v5 is the spine and is not re-edited: same takes, same cuts, same framing, same sound, same HDR (HLG) picture. On top of it:

- phone screen recordings over the feature lines (lesson words, flashcards, library, teacher's feedback, calendar), with a yellow label each;
- burned-in Russian subtitles, timed to v5's words; the English hook also shows its English line;
- a 2.6 s endcard after the WhatsApp line;
- two pauses tightened: 0.20 s removed between «личный» and «словарь» (~0:11) and 0.18 s before «в свой персональный словарь» (~0:23). Both fall under screen recordings, so the picture does not jump.

Sally is on camera for the hook, «Хотите никогда не забывать…», «урок — это только начало», the homework line, the native-speakers line and the CTA.

## Edit it

`edit.json` is the whole edit, in seconds of `source/rough-cut-v5.mp4`: where each beat starts, whether it shows Sally or a screen recording (and from which second), its label, its subtitle chunks, and the `trims`.

    npm ci
    npm run studio      # preview the overlay layer
    npm run render      # → exports/omnica-sally-ad.mp4

The render trims v5, renders the overlay with transparency, converts the graphics to HLG so they sit correctly on the HDR footage, and encodes once. Set `CHROME_PATH` if no Chrome is found.

## Not done / to check

- **Nobody has listened to it.** The two trims were placed on measured silence, not by ear.
- No music.
- QuickTime lag on the earlier files was not investigated.
