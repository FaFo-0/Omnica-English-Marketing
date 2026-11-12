import { session, go } from './browse.mjs';
const { browser, page } = await session('teacher', { width: 390, height: 844, scale: 1 });
await go(page, '/teacher/sessions/' + process.argv[2], 2500);
await page.getByRole('button', { name: 'Reopen' }).first().click(); await page.waitForTimeout(3000);
console.log('after reopen:', (await page.getByRole('button').allInnerTexts()).filter(Boolean).slice(0, 6).join(' | '));
await page.getByRole('button', { name: 'Publish' }).first().click(); await page.waitForTimeout(4000);
console.log('after publish:', (await page.getByRole('button').allInnerTexts()).filter(Boolean).slice(0, 6).join(' | '));
await browser.close();
