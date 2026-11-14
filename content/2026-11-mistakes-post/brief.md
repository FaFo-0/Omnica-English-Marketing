# Post: the speaking mistakes finder

**Status:** draft, copy and design together (FaFo asked to move fast). Waiting for FaFo's feedback, 2026-11-14.
**Goal:** show the feature no one else has: after a lesson you see your own spoken mistakes, checked by a teacher and explained in Russian. Then send people to a trial.
**Format:** feed carousel, 5 slides at 1080 × 1350 (`slides/`). Source: `post.json`, rendered with `templates/story/render.cjs`.
**Screens:** the real student lesson page, QA data (`library/screenshots/2026-11-14-mistakes-ru/`).

## Slides

1. **Говорите «I go» вместо «I went»?** *Мы заметим.* Visual: "You said / Correct" bubbles.
2. **Урок записывается.** После занятия мы находим ошибки в вашей речи — преподаватель проверяет каждую. Three steps: Meet → we find the mistakes → the teacher checks.
3. **Красным — как вы сказали.** *Зелёным — как надо.* Screenshot: the first mistake.
4. **И почему —** *по-русски.* Screenshot: take photos / people were, with Russian explanations.
5. **Видите ошибку — перестаёте её делать.** *Попробуйте на пробном уроке.* Ссылка — в профиле.

EN: 1 Say "I go" instead of "I went"? We'll notice. · 2 The lesson is recorded. Afterwards we find the mistakes in your speech, and the teacher checks each one. · 3 Red: what you said. Green: what's correct. · 4 And why, in Russian. · 5 See the mistake and you stop making it. Try it in a trial lesson. Link in profile.

## Caption

```
Говорите по-английски и не знаете, где ошибаетесь? Это мешает больше всего.

В Omnica English урок записывается. После занятия мы находим ошибки в вашей речи, преподаватель проверяет каждую — и они появляются в вашем личном кабинете:
— как вы сказали,
— как правильно,
— и почему — по-русски.

Попробуйте на пробном уроке. Ссылка — в профиле.
```

**Accuracy:** AI suggests the mistakes and the teacher confirms or dismisses each one (the feature works this way). The copy says "we find, the teacher checks", which is true. The recording needs consent from both sides (taken at onboarding).
