import { session, go } from './browse.mjs';
const { browser, page } = await session('teacher', { width: 1280, height: 800, scale: 1 });
await go(page, '/teacher/sessions/' + process.argv[2] + '/live', 3000);
await page.getByRole('button').first().click(); await page.waitForTimeout(1500);
const d = page.getByRole('button', { name: /Discard — started by mistake/ });
console.log('discard buttons', await d.count());
await d.click(); await page.waitForTimeout(3000);
const c = page.getByRole('button', { name: /Discard|Confirm|Yes/ }).last();
if (await c.isVisible().catch(() => false)) { await c.click(); await page.waitForTimeout(3000); }
console.log(page.url());
await page.screenshot({ path: '/tmp/claude-0/-home-user/f8c2bbaa-ba06-5d68-8076-37eff19a0f58/scratchpad/discard.png' });
process.exit(0);
