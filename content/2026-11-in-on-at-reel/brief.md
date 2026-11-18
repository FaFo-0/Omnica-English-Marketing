# Reel: in / on / at for time ("glow" style)

**Status:** sample, 2026-11-18, waiting for FaFo's feedback.
**Goal:** first Reel in the "glow" style FaFo picked from a reference account (dark background with soft colour glows, word tiles, karaoke subtitles, quiz with countdown, cheat sheet at the end). Our colours, fonts and topic, not theirs.
**Format:** Reel 1080 × 1920, ~55 s. Voice-over: ElevenLabs once the key is in; until then the subtitles carry it. Source: `script.json` → `engine/motion` composition `InOnAt`. Final: `reel.mp4`, `cover.png`.

## Voice-over / subtitles

Source of truth: `script.json` (scene by scene). Russian checked with `russian-check` 2026-11-18; all 10 fixes applied (rule wording, the trap now says *why* it's a trap, «тогда on» instead of «всегда on» because next/last/this Monday take no preposition, cheat-sheet "the morning · the evening").

**For TTS:** each subtitle is voiced as separate clips: Russian runs in the Russian voice, English runs (lowercase) in the English voice. Line 13 «In Friday? On Friday?» is one English clip.

## Caption

```
Сохраните шпаргалку 📌

in / on / at, когда речь о времени, — это пирамида:

in — самое большое и части дня: in May, in summer, in 2026, in the morning
on — день или дата: on Monday, on my birthday, on Monday morning
at — точное время: at seven, at midnight. И запомните: at night

Когда у вас день рождения? Напишите по-английски в комментариях 👇

#английскийязык #грамматикаанглийского #английскийонлайн #предлогианглийского
```
