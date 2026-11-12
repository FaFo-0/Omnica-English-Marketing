# Sally ad v1: rough cut

Script: `Sally's AD.pdf` (repo root). **Videos live on Google Drive, not in git** (too large):
- Raw footage (5 videos, 4K vertical 60 fps, plus one hand-held voice recording, 2026-11-10): https://drive.google.com/drive/folders/1E6SHzFrAHHQhtKylZ7BNtYCnwDfOZYBI
- Rough cuts and final exports go in the same folder (FaFo uploads them; this cloud session can only read from Drive).

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

## Rough cut v3 (current)

`rough-cut-v3.mp4` (Drive): 46 s, 1080×1920, built by `tools/cut_v3.py` (shared helpers in `tools/cliplib.py`). Same takes as v2, which FaFo chose: the English hook is take 2 of "Did you learn words but never use them?", where she points at the camera. The pauses between lines are trimmed: each clip is cut where the hand-held voice actually starts and stops, with ~0.07 s of padding and never earlier than the last word Soniox transcribed. The finished cut was re-transcribed to check that no word is clipped. `tools/hooks.py` renders and measures all 11 English hook takes, numbered, for comparison.

## Rough cut v2

`rough-cut-v2.mp4` (Drive): 48 s, 1080×1920. It opens with the English hook "Did you learn words but never use them?" (20261110_162238, take 2), then the Russian script as in v1. FaFo confirmed the audio sync is good on v1. Each clip is zoomed to a 1440×2560 crop of the 4K frame, centred on Sally's face (`tools/faces.py` → `faces.json`, eyes at ~36% height).

## Rough cut v1

`rough-cut-v1.mp4` (Drive): 45 s, 720×1280, Sally only, hand-held audio. Best takes in PDF order, all from 20261110_170538 except the native-teachers line (20261110_171528). No screen inserts, subtitles or labels yet.

Transcription: Soniox `stt-async-v4` (`tools/transcribe.py`, key from the app's dev Convex env).
