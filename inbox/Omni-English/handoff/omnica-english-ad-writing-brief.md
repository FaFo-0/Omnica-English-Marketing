# Omnica English — Ad-Writing Brief (self-contained handoff)

**Purpose:** hand this to any AI — with or without access to the Omnica English codebase — so it can write natural, truthful ads for the academy.
**Compiled:** 2026-11-02. **Sources:** the live platform code (audited), `MASTER_PLAN.md`, `POLICY.md`, and the marketing context doc.
**Corrected:** 2026-11-02, after reading the live `omnicaenglish.com/prices` page directly. **Section 5 (the offer) was wrong** — the correction is written into it below, and open items 1 and 2 in section 11 are now resolved. If you already pasted an earlier copy of this brief into another AI, replace it.
**Rule for the writer:** everything marked **[VERIFIED]** was checked directly in the shipped app on 2026-11-02. Everything marked **[DOC]** comes from an internal doc and should be treated as true but not re-checked. Anything marked **[VERIFY]** must be confirmed with the owner before it appears in an ad.

---

## 0. How to use this brief

You are writing short vertical video ads (Reels / Stories) for a Russian-speaking audience in Kazakhstan. Read sections 1–7 fully before writing. Then use section 8 (formats) and section 10 (constraints). Do not invent features, numbers, testimonials, or results — everything you may claim is in section 4.

The single most important quality bar, stated by the owner: **the ads must sound like a person talking, not like an ad.** No hype, no superlatives, no "unique method", no exclamation marks stacked for effect. Short sentences. Concrete situations.

---

## 1. The brand — non-negotiable naming

- **Customer-facing name is always `Omnica English`.** Spell it in full every time. Never shorten to "Omnica" in a headline or the profile name.
- **Never let the word `OmniClass` (or "Omni Class") reach a client.** That is the internal software name only. It must not appear in ads, subtitles, captions, on-screen text, metadata, or downloads.
- **Say "lessons", never "points".** Students buy and spend *lessons* ("8 lessons left"), not points.
- Domain: `omnicaenglish.com`. Public prices page: `/prices`.

---

## 2. What the business is (one paragraph)

Omnica English is an online English academy for **adults in Kazakhstan (roughly 18–45) with Basic–Intermediate English** who need the language for work, travel, or relocation. Learners take **one-to-one lessons over Google Meet with a teacher**, and the academy runs a **platform that keeps the learning going between lessons** — lesson summaries, a personal vocabulary list, spaced-repetition flashcards, homework with teacher feedback, and a free reading library. It is not just "a tutor on a video call"; it is a lesson **plus** a system for returning to the language afterwards. That "the lesson is only the beginning" idea is the product's core difference.

**Primary conversion action:** book the paid trial lesson. **Secondary, free entry point:** the reading library + flashcards (usable without buying lessons).

---

## 3. Audience and language rules

- **Audience:** Russian-speaking adults in Kazakhstan. Address them as «вы».
- **Language split for presenter ads:** the presenter speaks the opening line **in English** (short, natural); everything else is **Russian** for the viewer. Every ad must work **sound-off**, so the Russian is delivered as **on-screen subtitles** inside the middle ~70% of the frame, not only as speech.
- **Tone:** clear, encouraging, practical, intelligent. Short sentences, real situations, no exaggerated promises.
- **Do not promise** fluency, exam scores, job or migration outcomes, or timelines. Describe features and the workflow accurately; let the viewer join the dots.

---

## 4. Platform feature audit — what is actually in the app

This is what you can honestly build ads on. **[VERIFIED]** items were checked in the shipped code on 2026-11-02.

### 4.1 The lesson itself
- **[VERIFIED] One-to-one online lessons** with a teacher, over **Google Meet** (teacher supplies the Meet room).
- **[VERIFIED] Live session tooling for the teacher:** live speech-to-text transcription during the lesson (Soniox), a timer, stable Teacher/Student speaker labels, and an in-lesson quiz / reading share for screen-sharing.
- **[VERIFIED] After the lesson, the teacher produces:** a transcript, an **AI-generated summary**, a **vocabulary list**, **flashcards**, and a **short self-check quiz**. The student's published-lesson page shows the summary, vocabulary, flashcards and the self-graded quiz. **[RESOLVED 2026-11-02]** the student lesson page renders exactly those four blocks and no transcript — the raw transcript stays teacher-side, so **do not claim transcripts to students**.
- **[VERIFIED] Lesson recording exists** for the teacher/admin (audio backup). A student does **not** get lesson audio. Do not promise recordings to students.
- **[VERIFIED] Lessons are numbered per student** ("English Lesson 4") with an optional topic in the title, so a student's history is legible.

### 4.2 Vocabulary + flashcards — "one word list"
- **[VERIFIED] The word list is the flashcards.** There is a single vocabulary list; My Words, the study queue and the reading highlight all read from it. A saved word becomes a review card.
- **[VERIFIED] Flashcards are translation-first:** the card shows the English word, the answer is the translation into the student's own language (Russian, Arabic, or Kazakh).
- **[VERIFIED] Spaced repetition (SM-2):** the system schedules reviews. Per session: up to 60 cards; up to 15 brand-new cards per day. Cards you already know come back later.
- **[VERIFIED] "My Words":** search the list, filter by not-studied / learning / learned, edit a translation, remove a word, see how many are due today.
- **[VERIFIED] Words flow in from two places** — lesson vocabulary and words you save while reading — into the same list.

### 4.3 The free reading library (the free entry point)
- **[VERIFIED] A real reading library** of texts and links, browsable by **level, topic and reading time**, with search, filters and "continue reading".
- **[VERIFIED] Tap any word while reading → see its translation → save it to your cards.** Saved words are tinted (green = on your list; it means *saved*, not *learned*).
- **[VERIFIED] The library and flashcards are usable by a registered student without buying lessons.** This is the honest "start free" hook. (It still requires a free account.)
- **[VERIFIED] Contextual vocabulary** is prepared per chapter in ru/ar/kk, with a dictionary fallback for missing words.
- **[DOC] Content includes public-domain classics** (e.g. Alice in Wonderland, Sherlock Holmes) plus original starter texts, prepared for A2–C1 readers.

### 4.4 Homework + feedback
- **[VERIFIED] Homework lives on the platform**, with **ten exercise formats** (including fill-in-the-blank, multiple choice, matching, and word-ordering).
- **[VERIFIED] The student submits; the teacher reviews per question** and can leave feedback on each answer, plus a score. Objective questions are auto-graded; the teacher can override.
- **[VERIFIED] A student's homework has three states:** to-do, waiting for review, completed with a score.
- **[DOC] Deadline defaults to the student's next lesson** and follows bookings automatically.

### 4.5 Scheduling, progress, and the rest of the student account
- **[VERIFIED] Booking from real availability:** the student picks an actual open slot on a calendar in their own timezone; cancel/move follow the academy policy.
- **[VERIFIED] Dashboard:** next lesson card (with a Join button when a Meet link exists), a study-due card, stat cards (lessons completed, words collected, cards reviewed, lessons left), a streak.
- **[VERIFIED] Lesson history:** Done / Upcoming / Missed / Cancelled, in the student's timezone, with filters and search.
- **[VERIFIED] Achievements + streaks** with real progress.
- **[VERIFIED] Billing:** lesson packs, current balance, and a request flow. Payment is arranged with the academy over WhatsApp.
- **[VERIFIED] Profile:** timezone, 12/24-hour clock, phone, the language used for flashcard translations, and a calendar subscribe link (ICS).
- **[VERIFIED] Notifications:** in-app bell, plus optional delivery through Telegram.
- **[VERIFIED] Languages:** the whole student portal is translated into **English, Russian, Arabic (RTL) and Kazakh**.

### 4.6 Under the hood (context, not ad copy)
- Next.js front end over **Convex**; **Clerk** for sign-in; the teacher-side AI is **DeepSeek V4.1 Flash via OpenRouter**. You do not need any of this in an ad — but don't claim "AI tutor chat" or similar; there is no student-facing chatbot.

---

## 5. The offer — what is being sold

**[LIVE] These numbers were read off `omnicaenglish.com/prices` on 2026-11-02 (KZT, Russian locale).** Prices and sales change; re-read the live page before any ad goes live. The public page is driven by the live catalogue in the database, not by any file in the repo.

- **Trial lesson — 1 500 ₸.** A full one-to-one lesson with your assigned teacher ("Полноценный урок с вашим назначенным преподавателем"). Valid **30 days from first use**. Includes platform access and word cards + spaced repetition. **Do not claim the 1,500 ₸ is credited back toward a package** — that line is not on the live page and is unconfirmed.
- **Lesson packs — Standard English ("Стандартный английский"), one-to-one lessons sold in bundles.** All three currently carry a **20% sale**; the struck-through figure is the normal price:
  - **8 уроков — 44 800 ₸** (normally 56 000 ₸), valid 60 days from first use.
  - **12 уроков — 62 400 ₸** (normally 78 000 ₸), valid 60 days from first use.
  - **24 урока — 115 200 ₸** (normally 144 000 ₸), valid 90 days from first use.
  - Every pack lists the same inclusions on the live page: structured one-to-one lessons, flexible booking, homework feedback, progress tracking, **full platform access**, **word cards and spaced repetition**.
  - IELTS packs exist but are **sold inside the portal only** — hidden from the public site. Do not advertise IELTS.
- **Correction to the earlier version of this brief:** it claimed the catalogue was 4 / 8 / 12 lessons at 15 000 / 26 000 / 36 000 ₸, and dismissed the 8/12/24 row as an out-of-date internal doc. That was backwards. The 4/8/12 figures came from a **stale seed file** in the repo (`convex/lib/pricingSeed.ts`, the one-time migration seed); the live database — and therefore the live page — sells **8 / 12 / 24** with a 20% sale. Never quote a price you have not read off the live page.
- **What's included beyond lessons:** platform access, lesson vocabulary, flashcards, homework — these are part of the deal, not upsells.

---

## 6. Tone rules — how to sound like a person, not an ad

**Do:**
- Open with a situation the viewer recognises, in the first 2–3 seconds.
- Use concrete, everyday detail ("вы закрыли созвон", "нажмите на слово", "галочка «неверно»").
- One idea per ad. One call to action.
- Let the honest free layer (the library) be a real offer, not a bait line.

**Don't:**
- No "уникальная методика", "лучший", "эффективный в 2 раза", "гарантированный результат".
- No fake testimonials, stock "students", invented reviews, or made-up statistics.
- No more than one exclamation mark, ever, and prefer none.
- No logo animation or channel intro at the top — start with the problem or the hook.
- Don't describe the *software* ("all-in-one platform"); describe what the person *gets*.

---

## 7. Format standard (for presenter / Reel-style ads)

- Vertical **9:16**, 1080×1920.
- Aim **20–35 seconds** for a cold-traffic cut; longer (~50s) only for a warm audience.
- Presenter is the teacher (**Sally**): speaks the English hook to camera, warm and natural.
- **Record the English hook as its own take** so it can be swapped later.
- **Leave a short pause before the final invitation** so the ending stays editable.
- Russian subtitles inside the middle 70% of the frame. **Each ad must be understandable muted.**
- End with **exactly one CTA**.
- Suggested on-screen structure per beat: a short uppercase **yellow feature label** above the Russian subtitle (e.g. БИБЛИОТЕКА, ДОМАШНЕЕ ЗАДАНИЕ), and the Russian line beneath it.

**Hook mechanics — give each ad in a set a different one, and hold it for the first 2–3 seconds:** a question; a short confession or contradiction; a command with a number; a flat statement that names the situation.

**CTA options (pick one per ad):** book the trial ("Запишитесь на пробный урок Omnica English — ссылка в профиле"); or start free in the library ("Откройте библиотеку — ссылка в профиле").

---

## 8. Territory already used (so you don't repeat it)

The following angles have **already been produced or drafted**, so a new ad on the same angle is a repeated idea, not a new one:

1. Speaking confidence — "you know the words but can't use them" (one-to-one speaking practice).
2. "What happens after the lesson" — the personal account: vocabulary, flashcards, homework.
3. Reading library — tap a word, save it to cards, free without lessons.
4. A 50s "master" cut and a 15s cold cut, both covering the same sequence: lessons → account → library → free → trial.

**Areas not yet used** (candidate new territory): the homework-feedback loop; the spaced-repetition "review what you're about to forget" system; the lesson summary / self-check quiz; scheduling and the calendar; progress/history and streaks.

---

## 9. Deliverable shape for a set of ad scripts

For each ad give: the **platform area it sells** (one only), its **hook mechanic**, and a table of **time | shot (presenter / screen) | spoken (EN where marked, else RU) | Russian subtitle on screen | label**. Then a Russian caption with the one CTA, and a primary metric (saves, profile visits, WhatsApp starts, trial requests). Close with a short trade-off table across the set and **one** recommendation of which to run first.

---

## 10. Hard constraints (repeat)

- Brand spelled **Omnica English**; `OmniClass` never appears client-side.
- "lessons", never "points".
- No fluency/score/job promises; no invented proof.
- Prices only from the live page — never from an internal doc.
- One CTA per asset.
- The free library is real: registered students can read and build flashcards without buying lessons.

---

## 11. Open items to confirm with the owner

1. ~~Exact current prices and any live sale~~ — **resolved 2026-11-02 from the live page**: trial 1 500 ₸ / 30 days; 8 lessons 44 800 ₸; 12 lessons 62 400 ₸; 24 lessons 115 200 ₸; all packs on a 20% sale. The "trial credited toward a package" line is **not** on the live page — treat it as unconfirmed and leave it out. Re-read `/prices` before publishing.
2. ~~Whether students see raw lesson transcripts~~ — **resolved 2026-11-02**: no. The student lesson page shows summary, vocabulary, flashcards and the quiz only. Do not claim transcripts.
3. The primary destination link for the CTA (WhatsApp trial route vs. the website sign-up) and its tracking.
4. Which single scenario to lead with (work / travel / relocation) for the launch ads.
