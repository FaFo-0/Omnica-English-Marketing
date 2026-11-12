import { session, go } from './browse.mjs';
import { startRec, tap } from './rec.mjs';
const { browser, page } = await session('student');
await go(page, `/student/study`, 2500);
const rec = await startRec(page, '/home/user/sally-ad/screens/s4_frames');
await page.waitForTimeout(1200);
await tap(page, page.getByRole('button', { name: /Начать/ }).first(), 1800);
const grades = ['Хорошо', 'Легко', 'Хорошо', 'Трудно', 'Хорошо', 'Легко'];
for (const [i, g] of grades.entries()) {
  rec.mark(`card${i}`);
  await page.waitForTimeout(900);
  await tap(page, page.getByText('Нажмите, чтобы увидеть значение').first(), 1900);
  await tap(page, page.getByRole('button', { name: new RegExp('^' + g) }).first(), 700);
}
rec.mark('end');
console.log(await rec.stop('/home/user/sally-ad/screens/s4_flashcards.mp4'));
await browser.close();
