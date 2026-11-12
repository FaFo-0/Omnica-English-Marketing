import { session, go } from './browse.mjs';
import { startRec, swipe, tap } from './rec.mjs';
const LESSON = process.argv[2];
const { browser, page } = await session('student');
await go(page, `/student/lessons/${LESSON}`, 3000);
const rec = await startRec(page, '/home/user/sally-ad/screens/s3_frames');
await page.waitForTimeout(1200);
rec.mark('lesson');
await swipe(page, 330, { steps: 40 }); await page.waitForTimeout(1500);
rec.mark('mistakes');
for (let i = 0; i < 6; i++) { await swipe(page, 260, { steps: 34 }); await page.waitForTimeout(1300); }
rec.mark('vocab');
for (let i = 0; i < 4; i++) { await swipe(page, 260, { steps: 34 }); await page.waitForTimeout(1300); }
rec.mark('end');
console.log(await rec.stop('/home/user/sally-ad/screens/s3_student_lesson.mp4'));
await browser.close();
