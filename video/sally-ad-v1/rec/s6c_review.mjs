import { session, go } from './browse.mjs';
import { startRec } from './rec.mjs';
const LESSON = process.argv[2];
const MARKS = ['Верно', 'Верно', 'Верно', 'Верно', 'Частично верно', 'Верно', 'Верно', 'Верно', 'Верно', 'Неверно'];
const COMMENTS = { 0: 'Отлично — прошедшее время 👍', 4: 'Почти! После depends — предлог on: It depends on the weather.', 9: 'dream of + -ing: I dream of visiting Georgia.' };
const { browser, page } = await session('teacher');
await go(page, `/teacher/sessions/${LESSON}`, 2500);
await page.getByText('Homework', { exact: true }).first().click(); await page.waitForTimeout(2000);
const rec = await startRec(page, '/home/user/sally-ad/screens/s6c_frames');
async function tapNth(selectorJs, i) {
  await page.evaluate(([s, i]) => eval(s)[i].scrollIntoView({ block: 'center', behavior: 'smooth' }), [selectorJs, i]);
  await page.waitForTimeout(650);
  const r = await page.evaluate(([s, i]) => { const b = eval(s)[i].getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, [selectorJs, i]);
  await page.touchscreen.tap(r.x, r.y);
}
const markBtns = (label) => `[...document.querySelectorAll('button')].filter(b => b.innerText.trim() === '${label}')`;
const ALLMARKS = `[...document.querySelectorAll('button')].filter(b => /^(Верно|Частично верно|Неверно)/.test(b.innerText.trim()))`;
const comments = `[...document.querySelectorAll('input[aria-label="Комментарий преподавателя"]')]`;
await page.waitForTimeout(800);
for (let q = 0; q < MARKS.length; q++) {
  rec.mark('q' + q);
  const k = 3 * q + ['Верно', 'Частично верно', 'Неверно'].indexOf(MARKS[q]);
  const pressed = await page.evaluate(([s, k]) => eval(s)[k].getAttribute('aria-pressed'), [ALLMARKS, k]);
  if (pressed !== 'true') { await tapNth(ALLMARKS, k); await page.waitForTimeout(450); }
  if (COMMENTS[q]) {
    await tapNth(comments, q); await page.waitForTimeout(200);
    await page.keyboard.press('Control+A'); await page.keyboard.press('Delete');
    await page.keyboard.type(COMMENTS[q], { delay: 32 }); await page.waitForTimeout(500);
  }
}
rec.mark('finish');
await tapNth(`[...document.querySelectorAll('button')].filter(b => b.innerText.includes('Finish review'))`, 0);
await page.waitForTimeout(3000);
rec.mark('end');
await page.screenshot({ path: '/tmp/claude-0/-home-user/f8c2bbaa-ba06-5d68-8076-37eff19a0f58/scratchpad/s6c_end.png' });
console.log(await rec.stop('/home/user/sally-ad/screens/s6c_review.mp4'));
await browser.close();
