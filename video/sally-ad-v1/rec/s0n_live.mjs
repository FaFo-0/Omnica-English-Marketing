// Live room with live transcription. Sally's real lines play as the microphone; the Soniox
// real-time socket is stood in for (this session cannot reach stt-rt.soniox.com) and replays
// Soniox's own transcription of the same audio (api.soniox.com async, real output) at speaking pace.
import { readFileSync } from 'node:fs';
import { session, go } from './browse.mjs';
import { startRec } from './rec.mjs';
import { appendFileSync } from 'node:fs';
const log = (...a) => appendFileSync('/tmp/claude-0/-home-user/f8c2bbaa-ba06-5d68-8076-37eff19a0f58/scratchpad/s0.log', a.join(' ') + '\n');
const SC = '/tmp/claude-0/-home-user/f8c2bbaa-ba06-5d68-8076-37eff19a0f58/scratchpad/';
const TOKENS = JSON.parse(readFileSync('/home/user/sally-ad/audio/live/sally_live.json', 'utf8')).tokens
  .map(t => ({ text: t.text, start_ms: t.start_ms, end_ms: t.end_ms, confidence: t.confidence, speaker: '1' }));
const { browser, page } = await session('teacher', { width: 760, height: 1000, scale: 2,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=/home/user/sally-ad/audio/live/sally_live.wav'] });
let rec, t0 = null, sentFinal = 0, timer = null;
await page.routeWebSocket(/stt-rt\.soniox\.com/, ws => {
  ws.onMessage(msg => {
    if (typeof msg !== 'string') {           // audio
      if (t0 === null) {
        t0 = Date.now(); rec?.mark('audio_t0');
        timer = setInterval(() => {
          const el = Date.now() - t0;
          const finals = [];
          while (sentFinal < TOKENS.length && TOKENS[sentFinal].end_ms + 450 <= el) finals.push({ ...TOKENS[sentFinal++], is_final: true });
          const partial = TOKENS.slice(sentFinal).filter(t => t.start_ms <= el).map(t => ({ ...t, is_final: false }));
          if (finals.length || partial.length) ws.send(JSON.stringify({ tokens: [...finals, ...partial], final_audio_proc_ms: el - 450, total_audio_proc_ms: el }));
        }, 120);
      }
      return;
    }
    if (msg === '' || /finalize|"type"/.test(msg)) {   // stop
      clearInterval(timer);
      const rest = TOKENS.slice(sentFinal).map(t => ({ ...t, is_final: true })); sentFinal = TOKENS.length;
      ws.send(JSON.stringify({ tokens: rest, final_audio_proc_ms: 0, total_audio_proc_ms: 0 }));
      ws.send(JSON.stringify({ tokens: [], finished: true }));
    }
    // first text message is the config: nothing to answer
  });
});
log('logged in'); await go(page, '/teacher/sessions', 2000); log('sessions');
await page.getByRole('button', { name: 'Start session' }).first().click(); await page.waitForTimeout(1200);
const studentSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Анна' }) }).first();
await studentSelect.selectOption({ label: await studentSelect.locator('option', { hasText: 'Анна' }).first().innerText() });
await page.getByPlaceholder('English Lesson — numbered automatically').fill('Speaking practice');
await page.getByRole('button', { name: 'Create & start now' }).click();
await page.waitForURL(/\/live/, { timeout: 30000, waitUntil: 'commit' }); await page.waitForTimeout(5000);
log(page.url());
rec = await startRec(page, '/home/user/sally-ad/screens/s0n_frames', { maxWidth: 1520, maxHeight: 2000, vf: 'scale=1520:2000:flags=lanczos' });
await page.waitForTimeout(1500);
rec.mark('start'); log('rec started', (await page.getByRole('button').allInnerTexts()).filter(Boolean).slice(0,15).join('|'));
await page.getByRole('button', { name: 'Start with my voice' }).click();
await page.waitForTimeout(27000);
await page.screenshot({ path: SC + 's0n_live.png' });
rec.mark('end');
log(await rec.stop('/home/user/sally-ad/screens/s0n_live.mp4'));
log('sent tokens', sentFinal, '/', TOKENS.length);
process.exit(0);
