// High-quality screen recording of a Playwright page via the Chrome DevTools screencast.
// Frames arrive only when the screen changes; we keep their timestamps and rebuild a 30 fps video.
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
export async function startRec(page, dir, { maxWidth = 1080, maxHeight = 1920, vf = 'scale=1080:1920:flags=lanczos' } = {}) {
  mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const f = `${dir}/f${String(frames.length).padStart(5, '0')}.jpg`;
    writeFileSync(f, Buffer.from(data, 'base64'));
    frames.push({ f, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth, maxHeight, everyNthFrame: 1 });
  const marks = [];
  return {
    mark: (name) => marks.push({ name, t: Date.now() / 1000 }),
    stop: async (out) => {
      await new Promise(r => setTimeout(r, 400));
      await cdp.send('Page.stopScreencast');
      const end = Date.now() / 1000;
      const lines = [];
      frames.forEach((fr, i) => {
        const next = i + 1 < frames.length ? frames[i + 1].t : end;
        lines.push(`file '${fr.f}'`, `duration ${Math.max(0.001, next - fr.t).toFixed(4)}`);
      });
      lines.push(`file '${frames.at(-1).f}'`);
      writeFileSync(`${dir}/list.txt`, lines.join('\n') + '\n');
      const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`,
        '-vf', vf + ',fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', out], { encoding: 'utf8' });
      if (r.status) throw new Error(r.stderr);
      const t0 = frames[0].t;
      writeFileSync(out.replace(/\.mp4$/, '.marks.json'), JSON.stringify(marks.map(m => ({ name: m.name, t: +(m.t - t0).toFixed(2) })), null, 1));
      return { frames: frames.length, seconds: end - t0 };
    },
  };
}
// Smooth finger-like scroll inside whatever scrolls under (x, y).
export async function swipe(page, dy, { x = 180, y = 420, steps = 28, pause = 16 } = {}) {
  await page.mouse.move(x, y);
  for (let i = 0; i < steps; i++) {
    const k = Math.sin(Math.PI * (i + 0.5) / steps) * (Math.PI / 2) / steps;   // ease in/out
    await page.mouse.wheel(0, dy * k);
    await page.waitForTimeout(pause);
  }
}
export async function tap(page, locator, hold = 500) {
  await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  const box = await locator.boundingBox();
  if (!box) throw new Error('no box');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(hold);
}
