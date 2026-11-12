import { session, go } from './browse.mjs';
import { startRec, swipe, tap } from './rec.mjs';
const { browser, page } = await session('student');
await go(page, '/student/homework', 2500);
const rec = await startRec(page, '/home/user/sally-ad/screens/s6d_frames');
await page.waitForTimeout(1000);
await tap(page, page.getByText('Lesson homework').first(), 2500);
rec.mark('open');
for (let i = 0; i < 12; i++) { await swipe(page, 260, { steps: 34 }); await page.waitForTimeout(1100); }
rec.mark('end');
console.log(await rec.stop('/home/user/sally-ad/screens/s6d_feedback.mp4'));
await browser.close();
