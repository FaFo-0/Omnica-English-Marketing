# Sally ad v1: rough cut

Script: `Sally's AD.pdf` (repo root). Raw footage is on FaFo's Google Drive (5 videos, 4K vertical 60 fps, plus one hand-held voice recording, 2026-11-10). It's not committed because it's too large.

## Sync

The videos have their own (distant, quiet) sound, and the hand-held voice recorder ran through the whole session with pauses. `tools/align.py` matches 15-second windows of each video against the voice file. Offsets (voice time = video time + offset):

| Video | Offset (s) |
|---|---|
| 20261110_162238 | 140.90 until ~0:140, then 114.16 (the recorder was paused and played back) |
| 20261110_163758 | 591.31 |
| 20261110_170538 | 994.84 |
| 20261110_171528 | 1584.12 |
| 20261110_171701 | 1663.58 |

Clock drift between the phones is ~3 ms per 8 min, so it can be ignored. `roughcut.py` re-checks the offset of every clip before cutting.

## Rough cut v2 (current)

`exports/rough-cut-v2.mp4`: 48 s, 1080×1920. It opens with the English hook "Did you learn words but never use them?" (20261110_162238, take 2), then the Russian script as in v1. FaFo confirmed the audio sync is good on v1. Each clip is zoomed to a 1440×2560 crop of the 4K frame, centred on Sally's face (`tools/faces.py` → `faces.json`, eyes at ~36% height).

## Rough cut v1

`exports/rough-cut-v1.mp4`: 45 s, 720×1280, Sally only, hand-held audio. Best takes in PDF order, all from 20261110_170538 except the native-teachers line (20261110_171528). No screen inserts, subtitles or labels yet.

Transcription: Soniox `stt-async-v4` (`tools/transcribe.py`, key from the app's dev Convex env).
