import { session, go } from './browse.mjs';
import { startRec, swipe, tap } from './rec.mjs';
const { browser, page } = await session('student');
await go(page, `/student/library`, 2500);
const rec = await startRec(page, '/home/user/sally-ad/screens/s5_frames');
await page.waitForTimeout(1200);
await tap(page, page.getByText('A Weekend in the Mountains').first(), 2200);
await tap(page, page.getByText('The lake', { exact: true }).first(), 2600);
rec.mark('reader');
await page.waitForTimeout(1200);
for (const word of ['steep', 'fresh']) {
  rec.mark('tap_' + word);
  await tap(page, page.getByRole('button', { name: word, exact: true }).first(), 1800);
  await tap(page, page.getByRole('button', { name: 'Добавить в мой словарь' }).first(), 1800);
}
await swipe(page, 250); await page.waitForTimeout(1500);
rec.mark('end');
console.log(await rec.stop('/home/user/sally-ad/screens/s5_library.mp4'));
await browser.close();
