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

## Full ad plan (agreed with FaFo, 2026-11-12)

**Base:** rough cut v5 (`tools/cut_v5.py`): Sally's best take of each line, seamless cuts, hand-held phone audio with a light EQ, every line at the same volume, ~46 s. Vertical 1080×1920, 30 fps. Audience: Russian speakers; Sally speaks Russian, except the English hook.

**Decisions FaFo made**
- Opening line: the English hook "Did you learn words but never use them?", take 2 from video `20261110_162238` (at 0:27.75, where she points at the camera).
- Ending: the WhatsApp line (`20261110_171701` at 1:01, the more energetic second take), not «Записывайтесь…».
- Teachers subtitle: «…с носителями языка и другими иностранными преподавателями» (she says «…и иностранцами»; only the subtitle changes).
- Sally zoomed in (1440×2560 crop of 4K, eyes at ~36% height); seamless cuts with no padding; the «персональный» pause removed.
- Music: added in Instagram when posting, not mixed into the file.
- During app screens, Sally stays visible in a **round window** (lip sync visible); FaFo approved this.

**Scene by scene** (the script line → what's on screen → the yellow label)

| Line (spoken) | On screen | Label |
|---|---|---|
| "Did you learn words but never use them?" + Хотите никогда не забывать… | Sally full screen, big subtitle | — |
| В Omnica English индивидуальный урок — это только начало. | `s0n_live`: live transcription in the lesson room (Sally's own English lines appear as text) + round window | УРОК |
| После созвона все новые слова автоматически попадают в ваш личный словарь. | `s3`: student lesson page — «Ваши ошибки» (mistakes red → green + Russian explanation), then the word list. Optionally a short flash of `s1` (AI finds mistakes) | СЛОВАРЬ |
| Наша система интервального повторения… | `s4`: flashcards flipping (take photos → фотографировать…) | ПОВТОРЕНИЕ |
| Повторяйте слова в нашей бесплатной библиотеке… читайте материал, нажимайте… | `s5`: story, tap "steep" → крутой → add → turns green | БИБЛИОТЕКА |
| А между уроками вы можете выполнять домашние задания на платформе. | `s6b`: Анна types her answers (optionally a flash of `s6a`: AI builds homework from her mistakes) | ДОМАШНЕЕ ЗАДАНИЕ |
| Преподаватель проверяет каждое упражнение и оставляет подробный разбор ошибок. | `s6d`: Проверено 8.5/10 + teacher comments | ПРОВЕРКА |
| Управлять расписанием легко… | `s7`: calendar → 18:00 → Подтвердить → «Урок забронирован» (cut there: after booking the rest of the day turns unavailable) | РАСПИСАНИЕ |
| В нашей школе вы также можете заниматься с носителями языка… | Sally full screen | ПРЕПОДАВАТЕЛИ |
| Напишите нам в WhatsApp, чтобы записаться на пробный урок. | Sally full screen → end card | ПРОБНЫЙ УРОК |

**Layout rules**
- Russian subtitles for every line (English hook: English line + Russian subtitle). At most 3 lines.
- Keep text clear of the Reels UI: the bottom ~26% and the right ~11% are covered by Instagram's buttons and caption.
- On Sally full-screen cuts, alternate the normal zoom with a slightly closer one so the jump cuts look intentional.
- Round window: a circle of Sally's face (same takes, same audio) in a top corner, clear of the subtitles and of the app content being shown.
- App screens need no zoom (recorded at 1080×1920); trim the clips to fit each line's length and speed up or cut the AI waits.
- End card: Omnica English logo (`video/sally-motion-test-v1/public/logo.svg`), «Записаться на пробный урок», a WhatsApp button and the domain omnicaenglish.com. Keep it clear of the Reels UI zones.
- No price in the video (it changes; the caption and site carry it).

**Output:** 1080×1920 H.264 MP4 + AAC, no music. FaFo saves it to Drive and posts it, adding music in Instagram.

## Pick up here (handoff for any AI)

**Where things live**
- **Google Drive folder** (https://drive.google.com/drive/folders/1E6SHzFrAHHQhtKylZ7BNtYCnwDfOZYBI):
  - Raw footage: 5 videos plus `Voice 261110_162017.m4a`.
  - `sally-ad-handoff.zip`, which contains:
    - `screens/` — the 11 app screen recordings (`s0n_live` … `s7_calendar`, 1080×1920 except `s0n_live`, which is 1520×2000 and cropped to `560:996:0:0`), plus `*.marks.json` event timestamps.
    - `screens/screens-review.mp4` and `screens/rough-cut-v5.mp4`.
    - `transcripts/` — Soniox JSON for every video.
    - `audio/live/` — Sally's live-room audio and its Soniox transcription.
  - Rough cuts v1–v5 and the review video, which were also sent in chat.
- **This repo** (`video/sally-ad-v1/`): every script (`tools/`, `rec/`), the demo library story (`library/`) and these notes.
- **App repo** (`FaFo-0/omnica-english`): `convex/qaDemo.ts` (dev-only demo lesson + QA actor renaming).

**Rebuild from scratch:** download the Drive files into `raw/` (videos, and the voice file as `raw/voice_20261110_162017.m4a`), then run `tools/cut_v5.py` → rough cut v5. Offsets and the timing quirks are documented below.

**Dev state to undo when the ad is final:** the QA teacher and Russian QA student are renamed "Sally" / "Анна" with `locale: 'ru'`. Restore them to "QA Teacher" (en) and "QA Student Russian" (ru) with `qaDemo:setActorNames`.

**Next step (agreed with FaFo, not started):** build the full ad on rough cut v5.
- Sally full screen for the hooks, the teachers line and the WhatsApp ending.
- App screens under the other lines, with Sally in a round window (lip sync visible):
  - lesson start → `s0n_live`
  - after the call → `s1`/`s3` (mistakes, words)
  - repetition → `s4`
  - library → `s5`
  - homework → `s6b`/`s6d` (+ `s6a` AI homework)
  - schedule → `s7` (end on «Урок забронирован»)
- Russian subtitles and yellow section labels clear of the Reels UI zones (bottom ~26%, right ~11%).
- Alternate normal/closer zoom on Sally cuts.
- WhatsApp end card. Music is added in Instagram, not in the file.
- Teachers subtitle: «…с носителями языка и другими иностранными преподавателями».

## App screen recordings

See `rec/README.md`. `screens-review.mp4` (Drive) has all 11 scenes with captions.

## Rough cut v5 (current)

`rough-cut-v5.mp4` (Drive): same cut as v4 (`tools/cut_v5.py`), but with no noise reduction, because FaFo found v4 muffled. It uses a light presence EQ instead: −2 dB at 250 Hz, +3 dB at 3.5 kHz, +2 dB treble shelf at 8 kHz. The crossfades and levelling are unchanged. Sync is the same as v4 (within ±15 ms of the camera audio at every cut).

**Timing quirk:** reading the voice `.m4a` with `-ss` (as `fine_offset` does) lands 15.9 ms differently from a full decode. Every offset is measured against the `-ss` reading, so any full-decode copy of the voice (the `.wav` files) is trimmed by 15.9 ms to match. In v4, `afftdn` accounted for the other ~25 ms of its 40.9 ms correction.

## Rough cut v4

`rough-cut-v4.mp4` (Drive): 46 s, built by `tools/cut_v4.py`. It ends with the WhatsApp line (20261110_171701 at 1:01). Changes from v3:

- **Seamless cuts.** Each line is trimmed to where the voice starts and stops, with no padding. The audio is joined with 60 ms equal-power crossfades under hard picture cuts.
- **Internal pauses squeezed** (gaps over 0.3 s → 0.1 s) only on lines the app screens will cover. This removes the "looks up to remember" pause before "персональный" (v3 at 0:24).
- **Light noise reduction** on the hand-held voice (`afftdn=nr=9:nf=-50`). A stronger setting (`nr=14, tn=1`) smeared consonants ("В Omnica" → "Помните"). `afftdn` delays the audio by 40.9 ms, and that delay is trimmed back out.
- **Every line levelled** to the same speech loudness, then the whole ad is set to −16 LUFS.
- **Cuts snapped to the frame grid** (60 fps source → 30 fps output). Before snapping, picture and sound drifted 0.19 s apart over the ad.
- **Checked:** the camera's own audio, rebuilt with the same cut list, lines up with the final voice within ±15 ms at every cut. The first speech energy of every line falls after its cut point.

Note: Soniox hears "В Omnica" as "В Public" in this cut (after "английском?"). The audio envelope shows the word fully present, starting 0.14 s after the cut.

## Rough cut v3

`rough-cut-v3.mp4` (Drive): 46 s, 1080×1920, built by `tools/cut_v3.py` (shared helpers in `tools/cliplib.py`). Same takes as v2, which FaFo chose: the English hook is take 2 of "Did you learn words but never use them?", where she points at the camera. The pauses between lines are trimmed: each clip is cut where the hand-held voice actually starts and stops, with ~0.07 s of padding and never earlier than the last word Soniox transcribed. The finished cut was re-transcribed to check that no word is clipped. `tools/hooks.py` renders and measures all 11 English hook takes, numbered, for comparison.

## Rough cut v2

`rough-cut-v2.mp4` (Drive): 48 s, 1080×1920. It opens with the English hook "Did you learn words but never use them?" (20261110_162238, take 2), then the Russian script as in v1. FaFo confirmed the audio sync is good on v1. Each clip is zoomed to a 1440×2560 crop of the 4K frame, centred on Sally's face (`tools/faces.py` → `faces.json`, eyes at ~36% height).

## Rough cut v1

`rough-cut-v1.mp4` (Drive): 45 s, 720×1280, Sally only, hand-held audio. Best takes in PDF order, all from 20261110_170538 except the native-teachers line (20261110_171528). No screen inserts, subtitles or labels yet.

Transcription: Soniox `stt-async-v4` (`tools/transcribe.py`, key from the app's dev Convex env).
