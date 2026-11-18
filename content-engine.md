# Content engine: one animated post a day

**Status:** plan, 2026-11-18 (updated the same day after studying the reference account), waiting for FaFo's OK.
**Goal:** one short animated video a day (Instagram Reel, reused as TikTok / YouTube Short / Story) that teaches one real piece of English to Russian speakers, and in about one post out of four shows the platform doing it.

## What I'd change in the idea first

- **Make it a Reel, not an animated feed post.** On Instagram, Reels are what reach people who don't follow you yet; carousels mostly reach followers. With a small account, new reach is what matters. Value carousels (like the 5-mistakes post) stay as a weekly extra, because people save them.
- **Daily only works if a week is made in one sitting.** If each day is its own piece, it stops by week two. Plan: once a week, FaFo approves 7 scripts in one message, I render 7 videos in one batch, and they're scheduled in Meta Business Suite. FaFo spends about 20 minutes a week on it.
- **Mostly English, a bit of the platform.** About 3 in 4 posts teach something useful on their own. If every post is an ad, nobody follows. The platform shows up as the natural ending ("we catch these after every lesson") and in one dedicated "how it works" post a week.
- **Start with 4 weeks, then judge.** Success after 4 weeks = saves + shares per post and profile visits → `/prices` clicks, not likes. Then keep the formats that work and drop the rest.


## Look and sound (FaFo, 2026-11-18)

- **Purple background (`#6716A4`) on every Reel**, so the grid reads as ours at a glance. White text, **yellow (`#FFCA00`) for the one thing to remember** (the correct form, the table's key cell), lavender `#EBDDF3` table cells, deep purple `#391052` for shadows. Inter, plus PT Serif Italic for one accent word. Logo (`lockup-dark.svg`) on the last frame only. No copying the reference's colours or layout.
- **AI voice-over, generated.** FaFo doesn't speak Russian, so nobody records. **ElevenLabs** (`eleven_multilingual_v2`): one calm Russian voice for the explanations and one native English voice for the example sentences, so learners hear real pronunciation. This is the provider Remotion's own voice-over guide uses; the video length fits the audio automatically. Cost: the ~$5/month starter plan covers 7 short Reels a week.
- **Honest about AI:** it's a narrator, never presented as a teacher or a student. Tick Instagram's "AI info" label when posting, since Meta asks for it on realistic generated audio.
- Instagram music can be added by hand on top, at low volume.

## Reference account: @easy.english.daily013

FaFo wants to model us on this account. We copy its **format and approach**, not its posts, wording or look.

What the reference Reel does (Oct 2026: 8K likes and 81 comments on an account with 23K followers and 25 posts):
- **It shrinks a scary topic.** "English has 3 tenses, not 12. The 12 are just a 3 × 4 table (fact, process, result, duration)." One table replaces a whole chapter of grammar.
- **The video is the hook; the caption is the lesson.** The full explanation sits in the caption, with examples, so people save the post to reread it.
- **One call to action:** "save the table, follow for English without panic." Russian hashtags (#английскийязык, #временаанглийского…).
- **Comments come from the debate.** People argue "16 tenses?" or "will is a modal". A bold but defensible claim gets comments, and comments get reach.
- **Few posts, high value.** 25 posts reached 23K followers, so quality beats volume. That's why we batch a week and keep each post strong, not why we rush.

What we do better than them:
- **A real teacher behind it.** "We hear this mistake in lessons every week" is something an anonymous page can't say.
- **The platform as proof.** We can end with "after every lesson, Omnica puts these words in your flashcards" over a real screen.
- **Correct claims.** We simplify, but nothing we say is wrong. Teachers check each script.

## The weekly rhythm (7 formats, one per day)

Each format is a fixed animated template. Only the text changes, so a new post is a few lines of JSON.

| Day | Format | What it looks like (7–15 s, 1080 × 1920) |
|---|---|---|
| Mon + Thu-alt | **Вся тема в одной таблице** (the reference format, our main post) | Hook line: «В английском не 12 времён, а 3». A table builds itself cell by cell, then one example per row lights up. The caption carries the full explanation. Topics: tenses, a / the, in / on / at, irregular verbs in 3 groups, the conditionals as 1 table, the 6 question words. |
| Mon | **Ошибка недели** | ✗ wrong sentence types in, gets struck through, ✓ correct one slides in, one-line «почему» in Russian. Source: anonymised patterns from real lessons (same rule as the 5-mistakes post). |
| Tue | **Слово дня** | Word → pronunciation hint → translation → 2 example sentences appear one by one. Ends as a flashcard flipping (the real card design). |
| Wed | **Как сказать по-английски…** | A Russian phrase people translate word for word («Я на работе», «Мне 30 лет») → literal wrong version → natural version. |
| Thu | **Платформа: как это работает** | One real feature, animated over real QA screenshots: the word tap in reading, words from the lesson becoming flashcards, the mistakes card, homework review. Ends with «Пробный урок — ссылка в профиле». |
| Fri | **Тест: выберите ответ** (or a second table post if those do better) | Question + 3 options, a 3-second countdown, the right answer lights up. Built for comments ("напишите свой вариант"). |
| Sat | **Фраза из жизни** | A short everyday dialogue as chat bubbles (café, work email, airport, small talk). |
| Sun | **Слова недели** | Recap of the week's words and fixes, 5 quick cards. Cheap to make: reuses the week's data. Good for saves. |

Captions: Russian with «вы», one or two emoji, the fix repeated in text form (people search and save it), and one call to action. No prices, never "баллы", per `brand/brand.md`.


## Tools (Claude skills and add-ons I looked at)

| Tool | What it does | Verdict |
|---|---|---|
| **Remotion's official agent skills** (remotion-dev/skills) | Teach Claude Remotion's rules (animation, captions, voice-over, rendering) | **Installed** in `.claude/skills/` (11 skills, copied 2026-11-18 from commit `3e20ac7`; the maps and SaaS-app skills were left out). Update: copy again from the repo. |
| **charlie947/social-media-skills** (MIT, 16 skills) | Reel scripting, hooks, content ideas | **Read, not installed.** They're built for English LinkedIn and newsletters, and reels-scripting needs paid Apify + Gemini keys to scrape Reels. Our brand rules plus the reference notes cover the same ground. |
| **Upload-Post skill** | Posts Reels straight to Instagram/TikTok from Claude | **Later.** It's a paid third-party service that needs your account connected. Meta Business Suite's planner is free and enough at one post a day. |
| AI avatars (inference.sh, OmniHuman) | Fake talking-head presenters | **No.** A fake person goes against our "no fake" rule. An AI narrator voice is fine (see Look and sound). |

## How a post gets made

1. **Topic bank** (`engine/topics.md`): a running list of mistakes, words and phrases. Sources: anonymised patterns teachers see in lessons, common Russian-speaker errors, FaFo's ideas. I keep it about 4 weeks ahead.
2. **Weekly script** (`content/2026-W48/week.json` + `brief.md`): I write all 7 posts for the week in Russian with English translation. FaFo approves or edits in one reply (copy approved before design, same as the README workflow).
3. **Render**: one command renders the week: `npm run render:week -- 2026-W48` → 7 MP4s + 7 cover frames. Built on Remotion, which we already use for the Sally ad (`content/2026-11-sally-ad/motion/`). Templates use brand colors, Inter + PT Serif accent, safe area y 250–1650.
4. **Sound**: ElevenLabs voice-over per scene (Russian narrator + English examples), generated by the render command, plus a short soft cue on each reveal (as in `sound.py`). Before rendering, every script goes through the `russian-check` skill (`.claude/skills/russian-check/`). It runs as a fresh subagent with Russian instructions and checks grammar, natural phrasing, the English rule itself, brand voice and TTS pitfalls (numbers, stress, ё). It reports in English, with a back-translation, because FaFo can't read Russian. For the first few weeks a Russian-speaking teacher also skims one week, to confirm the checker catches what a native speaker would.
5. **Schedule**: FaFo uploads the 7 files into Meta Business Suite's planner (posts to Instagram and Facebook; TikTok separately). Automating posting via the Instagram API is possible later, but not worth it at this size.
6. **Review on Sunday**: I note saves / shares / reach per post in `engine/results.md` and move next week's mix toward what worked.

## Repo layout (adds to the current one)

```
engine/
  topics.md          topic bank, 4 weeks ahead
  results.md         per-post numbers, one line each
  motion/            Remotion project: 7 format templates + render:week script
content/2026-W48/
  brief.md           scripts + captions (RU + EN), posting dates
  week.json          the 7 posts as data
  exports/           final MP4s (or a Google Drive link if they get large)
```

## What I need from FaFo

0. Every week's Russian goes through `russian-check` automatically. A teacher skims it now and then, mainly for bold grammar claims.

1. OK on the plan, or changes (formats, number per week, platforms).
2. Is it Instagram only, or TikTok and YouTube Shorts too? Same files, just more uploading.
3. Fresh phone screenshots for the Thursday posts come from the QA accounts; I'll take them myself.

## Built so far (2026-11-18)

- `engine/motion/`: Remotion project with the **table** format (`content/2026-11-tenses-reel/`) and the **«Как сказать по-английски»** format (`content/2026-11-age-reel/`). Both are silent; voice comes once the ElevenLabs key is in.

## Build order once approved

1. Install the Remotion skill, build the **table** template (reference format) and the **mistake** template, then send FaFo two sample videos: «3 времени, а не 12» in our own words and design, plus one mistake.
2. After his tweaks, the other 5 templates and `render:week`.
3. First week's scripts → approval → render → schedule. From then on it's the weekly loop.
