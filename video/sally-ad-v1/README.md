# Omnica English — Sally ad v1

[Claude, 2026-11-12] One finished video built on **rough-cut v5**: `exports/omnica-sally-ad.mp4` (48 s, 1080×1920, 30 fps) plus a Russian `.srt`.

## What it is

Rough-cut v5 is the spine: same takes, same cuts, same framing, same sound. On top of it:

- phone screen recordings over the feature lines (lesson words, flashcards, library, teacher's feedback, calendar), each with a yellow label; they pop up over purple when cutting from Sally and drop away when cutting back to her;
- burned-in Russian subtitles timed to a Soniox transcript of v5 itself (`source/v5-words.json`); the English hook also shows its English line;
- a short zoom across v5's three Sally-to-Sally cuts (0:02.6, 0:05.2, 0:42.6) so they read as deliberate;
- a 2.6 s endcard that starts after «пробный урок» has finished;
- one pause tightened: 0.18 s of silence removed between «ваш» and «личный» (~0:11), under a screen recording.

**Picture is standard range, not HDR.** v5 and the camera files are HLG HDR. The HDR file played heavily on phones and made the screen recordings look dim, so the picture is converted once to standard range (same brightness, colours mapped to bt709). Sound is v5's, untouched apart from the one trim.

Sally is on camera for the hook, «Хотите никогда не забывать…», «урок — это только начало», the homework line, the native-speakers line and the CTA.

## Edit it

`edit.json` is the whole edit, in seconds of `source/rough-cut-v5.mp4`: where each beat starts, whether it shows Sally or a screen recording (and from which second), its label, its subtitle chunks, and the `trims`.

    npm ci
    npm run studio      # preview the overlay layer
    npm run render      # → exports/omnica-sally-ad.mp4

The render converts v5 to standard range, applies the zooms and the trim, renders the overlay with transparency, and encodes once (H.264 High@4.0, ~3.7 Mbps). Set `CHROME_PATH` if no Chrome is found.

## Not done / to check

- **Nobody has listened to it.** The trim was placed on measured silence, not by ear.
- The pause before «персональный словарь» (~0:24) was already cut tight in v5; only 0.08 s of silence is left there, so nothing more was removed.
- No music.
