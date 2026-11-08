# Omnica English — Sally ad set (3 cuts, 20 s each)

**Written:** 2026-11-02. **Source of truth for the offer:** the live `omnicaenglish.com/prices` page (read 2026-11-02, KZT).
**Timed copy:** `timeline.json` in this folder — `a1_homework`, `a2_after_lesson`, `a3_repetition`. Edit text there, not here.

## Before this set is shot

1. **The renderer is missing.** `overlay.html` and `render_overlay.mjs` are not on disk anywhere, so `timeline.json` is timed copy only — no frames, no SRT, and no frame-level QA pass has been run. The only video creative that exists on this machine is the Remotion motion test at `~/Desktop/Projects/Next.js OmniClass/assets/marketing/video/sally-motion-test-v1/`. Tell me if you want the overlay pipeline rebuilt.
2. **The CTA is deliberately destination-neutral** — «ссылка в профиле». Which link that bio link points at (the `omnicaenglish.com` sign-up or `wa.me/77066993942`) is still open, and swapping it changes only the bio, not the scripts.
3. **No work/travel/relocation scenario is named**, so the set is scenario-neutral. Adding one later means rewriting one line per cut, not the structure.
4. **Price used: 1 500 ₸** (trial, 30 days from first use). The "1 500 ₸ is credited toward a package" line is **not** used — it is not on the live page and you have not confirmed it.
5. **Voicing:** Sally speaks the two English hook beats to camera as their own takes (so the hook is swappable). The Russian lines are the on-screen subtitles; if a Russian voiceover is used, it is a separate read, not Sally. Every cut works muted.

## Format, all three cuts

9:16, 1080×1920, 30 fps, 20 s. Two English-hook beats (0–6 s) → three screen beats proving one area (6–15.8 s) → one CTA beat carrying the trial price (15.8–18 s) → endcard (18–20 s). Yellow uppercase feature label above the Russian subtitle. One CTA per cut. No logo animation or intro before the hook. Subtitles sit in the middle ~70% of the frame.

---

## Ad 1 — Домашнее задание с проверкой

**Platform area sold:** the homework-feedback loop (one area only).
**Hook mechanic:** flat statement naming the situation.
**Primary metric:** trial requests (highest-intent action in the set).

| Time | Shot | Spoken | Russian subtitle on screen | Label |
|---|---|---|---|---|
| 0.0–2.6 | Sally | EN — "You do the homework. Nobody checks it." | Домашнее задание никто не проверяет. | — |
| 2.6–6.0 | Sally | EN — "Here, I check every answer." | Здесь преподаватель смотрит каждый ваш ответ. | — |
| 6.0–9.4 | Screen | RU VO | Задание приходит в личный кабинет, а не в чат. | ДОМАШНЕЕ ЗАДАНИЕ |
| 9.4–12.8 | Screen | RU VO | Вы отвечаете — преподаватель открывает ваш ответ. | ПРОВЕРКА |
| 12.8–15.8 | Screen | RU VO | Под каждым ответом — комментарий. И оценка. | ОБРАТНАЯ СВЯЗЬ |
| 15.8–18.0 | Sally | RU VO | Пробный урок Omnica English — 1 500 ₸. Ссылка в профиле. | ПРОБНЫЙ УРОК |
| 18.0–20.0 | Endcard | — | Omnica English · Записаться на пробный урок | — |

**Caption (RU):**
> Домашнее задание никто не проверяет — так английский и не двигается.
>
> В Omnica English задание приходит в личный кабинет, и преподаватель смотрит каждый ваш ответ отдельно: под ответом — комментарий и оценка.
>
> Пробный урок — 1 500 ₸. Ссылка в профиле.

**Screen footage:** own-account homework only — one submitted exercise with a teacher comment under two different answers. Never another learner's name, avatar or work. Record the screen beat as one continuous scroll so the three beats cut from a single take.

---

## Ad 2 — Конспект урока и короткий тест

**Platform area sold:** the post-lesson summary + self-check quiz (one area only).
**Hook mechanic:** question.
**Primary metric:** saves (this is the "useful to keep" cut).

| Time | Shot | Spoken | Russian subtitle on screen | Label |
|---|---|---|---|---|
| 0.0–2.6 | Sally | EN — "What's left after your lesson?" | Что остаётся после урока английского? | — |
| 2.6–6.0 | Sally | EN — "A summary. And a short quiz." | Конспект. И короткий тест по уроку. | — |
| 6.0–9.4 | Screen | RU VO | На странице занятия — конспект: о чём говорили. | КОНСПЕКТ УРОКА |
| 9.4–12.8 | Screen | RU VO | Ниже — слова урока и карточки. Выписывать не нужно. | СЛОВА УРОКА |
| 12.8–15.8 | Screen | RU VO | И короткий тест. Сразу видно, что осталось в памяти. | САМОПРОВЕРКА |
| 15.8–18.0 | Sally | RU VO | Пробный урок Omnica English — 1 500 ₸. Ссылка в профиле. | ПРОБНЫЙ УРОК |
| 18.0–20.0 | Endcard | — | Omnica English · Записаться на пробный урок | — |

**Caption (RU):**
> Что остаётся после урока английского?
>
> В Omnica English — конспект урока, слова с карточками и короткий тест. Всё на странице занятия, выписывать ничего не нужно.
>
> Пробный урок — 1 500 ₸. Ссылка в профиле.

**Screen footage:** one published lesson page, scrolled top to bottom: summary → vocabulary → flashcards → quiz. Do not show the transcript — students do not get it.

---

## Ad 3 — Интервальное повторение

**Platform area sold:** the spaced-repetition review system (one area only).
**Hook mechanic:** short confession / contradiction.
**Primary metric:** saves + profile visits.

| Time | Shot | Spoken | Russian subtitle on screen | Label |
|---|---|---|---|---|
| 0.0–2.6 | Sally | EN — "I forget words too." | Слова забываются. У меня тоже. | — |
| 2.6–6.0 | Sally | EN — "So the system brings them back." | Поэтому платформа возвращает их сама. | — |
| 6.0–9.4 | Screen | RU VO | Слово с урока становится карточкой. Автоматически. | КАРТОЧКИ |
| 9.4–12.8 | Screen | RU VO | Каждый день — короткая очередь на повторение. | ПОВТОРЕНИЕ |
| 12.8–15.8 | Screen | RU VO | До 15 новых слов в день. Остальное — то, что вы уже учили. | РАСПИСАНИЕ |
| 15.8–18.0 | Sally | RU VO | Пробный урок Omnica English — 1 500 ₸. Ссылка в профиле. | ПРОБНЫЙ УРОК |
| 18.0–20.0 | Endcard | — | Omnica English · Записаться на пробный урок | — |

**Caption (RU):**
> Слова забываются через несколько дней. Это нормально.
>
> В Omnica English слово с урока само становится карточкой, и платформа каждый день показывает, что пора повторить. До 15 новых слов в день, остальное — то, что вы уже учили.
>
> Пробный урок — 1 500 ₸. Ссылка в профиле.

**Screen footage:** the study queue on an own account — due-today count, one card flipped English → Russian. The "15" is a real engine constant, not an illustration; keep the number on screen honest by showing the actual new-card limit in the UI.

---

## Trade-off across the set

| | What it proves | Cold-traffic strength | Weakness | Cost to shoot |
|---|---|---|---|---|
| 1 homework | A human checks your work | Strongest — kills the "self-study app" reflex | The master cut already shows a homework screen (it never shows per-answer feedback) | Low — one screen scroll + 3 Sally beats |
| 2 after lesson | What you actually keep from a lesson | Safe and clear, answers "what do I get" | Softer; less emotional pull | Low — one page scroll |
| 3 repetition | The system remembers so you don't have to | Strong problem recognition | Risks reading as generic unless the real queue is on screen | Medium — needs the study queue to look alive |

## Recommendation

**Run Ad 1 first.** It is the only beat a self-study app cannot copy, the concrete detail you asked for is native to it (галочка «неверно», a comment under one specific answer), and it converts on the strongest intent — a trial request. Ad 2 is the runner-up if you want the softer cut leading. Ad 3 is the best of the three for a retargeting/warm audience rather than cold traffic.

Test Ad 1 against Ad 2 on the same budget, same placement, same bio link; kill on cost per trial request, not on views.
