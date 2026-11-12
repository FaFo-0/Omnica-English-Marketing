# App screen recordings for the Sally ad

Phone-size (360×640 @3x = 1080×1920) recordings of the real app, made against the **dev** deployment with the fictional QA actors and a local production build (`next build --webpack && next start`). Shown as "Sally" (QA teacher) and "Анна" (Russian QA student) via `qaDemo:setActorNames` in the app repo, with the interface in Russian.

- `browse.mjs`: logs in a QA actor (`scripts/dev-login.mjs`). It sets the ru locale, hides the dev-only "Test as…" chip and Next badge, and draws a tap ripple.
- `rec.mjs`: Chrome DevTools screencast (JPEG q92) → timestamped frames → 30 fps H.264. Also `swipe` (eased scroll) and `tap`.
- `seed.sh`: resets the demo speaking lesson (`qaDemo:seedSpeakingLesson`).
- Scenes: `s0n_live` (live transcription), `s1` (AI mistakes), `s2` (AI summary/vocab → publish), `s3` (student lesson), `s4` (flashcards), `s5` (library tap-to-save), `s6a`–`s6d` (AI homework → student answers → teacher review → student feedback), `s7` (calendar booking).
- `library/`: an original A2 story imported into the dev library (`npm run library:import -- manifest.json --apply --publish`).

**Live transcription (s0n):** this cloud session can't reach `stt-rt.soniox.com`. FaFo approved the host, but the approval prompt can't be accepted from a phone. So Sally's five real English lines play into Chrome as a fake microphone, while `page.routeWebSocket` stands in for the Soniox socket. The stand-in replays Soniox's own async transcription of that same audio (`api.soniox.com`, real output) at speaking pace. The app's live-room code runs unchanged.

Every AI output in the recordings is real (OpenRouter/Soniox on dev): mistakes, summary, vocabulary, homework.
