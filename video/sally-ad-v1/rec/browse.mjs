// Log in as a QA actor on localhost (production build) and drive/screenshot pages at phone size.
import { createRequire } from 'node:module';
import { mintLoginUrl } from '/home/user/Omnica-English/scripts/dev-login.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
export const BASE = 'http://localhost:3000';
const INIT = `
try { localStorage.setItem('omnica-locale', 'ru'); } catch {}
const css = '.fixed.bottom-20.end-3{display:none!important} nextjs-portal{display:none!important}'
  + ' .tap-dot{position:fixed;z-index:2147483647;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;'
  + 'background:rgba(124,58,237,.35);border:2px solid rgba(124,58,237,.85);pointer-events:none;animation:tapdot .55s ease-out forwards}'
  + ' @keyframes tapdot{from{transform:scale(.4);opacity:1}to{transform:scale(1.25);opacity:0}}';
const add = () => { if (!document.head || document.getElementById('rec-style')) return; const s = document.createElement('style'); s.id = 'rec-style'; s.textContent = css; document.head.appendChild(s); };
document.addEventListener('DOMContentLoaded', add); setInterval(add, 300);
window.addEventListener('pointerdown', e => { const d = document.createElement('div'); d.className = 'tap-dot'; d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; document.body.appendChild(d); setTimeout(() => d.remove(), 700); }, true);
`;
export async function session(role, { width = 360, height = 640, scale = 3, args = [] } = {}) {
  const browser = await chromium.launch({ args, proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, isMobile: true, hasTouch: true,
    locale: 'ru-RU', timezoneId: 'Asia/Almaty', colorScheme: 'light', permissions: ['microphone'] });
  await context.addInitScript(INIT);
  const page = await context.newPage();
  const { url } = await mintLoginUrl(role, { base: BASE });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(u => !u.toString().includes('sign-in'), { timeout: 60000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
  return { browser, context, page };
}
export async function go(page, path, wait = 2000) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(wait);
}
if (process.argv[1].endsWith('browse.mjs')) {
  const [role, out, ...paths] = process.argv.slice(2);
  const { browser, page } = await session(role, { width: 390, height: 844, scale: 1 });
  for (const p of paths) {
    await go(page, p, 2500);
    const name = p.replace(/[^a-z0-9]+/gi, '_') || 'root';
    await page.screenshot({ path: `${out}/${role}${name}.png`, fullPage: true });
    console.log('shot', p, page.url());
  }
  await browser.close();
}
