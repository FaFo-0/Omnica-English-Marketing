import { session, go } from './browse.mjs';
import { startRec, swipe, tap } from './rec.mjs';
const ANSWERS = ['On Saturday I went to the mountains with my friends.', 'We took a lot of photos at the lake.',
  'People were everywhere because the weather was sunny.', 'I agree with this.', 'It depends of the weather also.',
  'took', 'worth', 'waited', 'forecast', 'about'];
const { browser, page } = await session('student');
await go(page, '/student/homework', 2500);
const rec = await startRec(page, '/home/user/sally-ad/screens/s6b_frames');
await page.waitForTimeout(1000);
await tap(page, page.getByText('Lesson homework').first(), 2500);
rec.mark('open');
for (let i = 0; i < ANSWERS.length; i++) {
  // Fields re-render while autosaving, so address them by index and tap by position.
  await page.evaluate((i) => document.querySelectorAll('main textarea, main input')[i].scrollIntoView({ block: 'center', behavior: 'smooth' }), i);
  await page.waitForTimeout(700);
  const r = await page.evaluate((i) => { const b = document.querySelectorAll('main textarea, main input')[i].getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, i);
  await page.touchscreen.tap(r.x, r.y); await page.waitForTimeout(250);
  await page.keyboard.press('Control+A'); await page.keyboard.press('Delete');
  await page.keyboard.type(ANSWERS[i], { delay: i < 5 ? 28 : 70 });
  await page.waitForTimeout(350);
  rec.mark('a' + i);
}
await page.keyboard.press('Tab').catch(() => {});
await page.waitForTimeout(800);
rec.mark('submit');
await tap(page, page.getByRole('button', { name: 'Отправить' }), 1500);
const confirm = page.getByRole('button', { name: /Отправить|Да/ }).last();
if (await confirm.isVisible().catch(() => false)) await tap(page, confirm, 2000);
await page.waitForTimeout(2000);
rec.mark('end');
await page.screenshot({ path: '/tmp/claude-0/-home-user/f8c2bbaa-ba06-5d68-8076-37eff19a0f58/scratchpad/s6b_end.png' });
console.log(await rec.stop('/home/user/sally-ad/screens/s6b_student_hw.mp4'));
await browser.close();
