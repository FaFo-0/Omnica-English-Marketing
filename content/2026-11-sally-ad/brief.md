# Sally ad

**Status:** recording 2026-11-09. Edit together afterwards, then post as a Reel and run as a paid ad.

**Goal:** get people to book a trial lesson (paid ad). Organic Reel version: show how learning between lessons works.

## Files

- `shot-list.pdf`: FaFo's 58 s master-cut shot list (Google Docs export): hook, vocabulary, flashcards, library, homework, schedule, trial.
- `recording-sheet.md`: what Sally records (hooks, short and full versions, endings, extra shots).
- `script.ru.txt` / `script.en.txt`: the full script (about 50 s).
- `motion/`: animated graphics in Remotion (word list, 3D flashcard flip, homework, ending). Code and small images only; renders aren't kept in git.
- Raw footage: Google Drive. *(add the link after recording)*

## Edit notes

- The motion graphics have no library scene yet, although the script mentions the library. Add one when we cut the full version.
- Time the graphics and subtitles to Sally's actual takes.
- Ad version: about 25 s, one call to action (trial), ending with «Нажмите на кнопку ниже».
- Graphic fonts change to Inter and PT Serif Italic (see `brand/brand.md`).

## Running the motion project

```
cd content/2026-11-sally-ad/motion
npm ci
npm run studio      # live preview and editing
npm run render      # → exports/omnica-motion-test.mp4 (not committed)
```
On a Mac, add `-- --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'` if Remotion can't find Chrome.

## Reel caption (2026-11-14)

```
Урок закончился — а английский продолжается 🇬🇧

Это Салли, преподаватель Omnica English. После каждого урока у вас в личном кабинете остаётся всё для практики:
— новые слова с урока — сразу в карточках,
— ваши ошибки из речи — с разбором по-русски,
— домашнее задание, которое проверяет преподаватель.

А ещё — бесплатная библиотека: читайте на английском, нажимайте на незнакомое слово и сохраняйте его в карточки.

Хотите заниматься с Салли или другим преподавателем? Запишитесь на пробный урок — ссылка в профиле.

#английскийонлайн #английскийдлявзрослых #английскийязык #урокианглийского
```

EN: The lesson is over, but your English keeps going. This is Sally, an Omnica English teacher. After every lesson your account keeps everything you need to practise: the lesson's new words, straight into flashcards; your spoken mistakes, explained in Russian; homework your teacher checks. Plus a free library: read in English, tap an unknown word and save it to your flashcards. Want lessons with Sally or another teacher? Book a trial lesson. The link is in our profile.
