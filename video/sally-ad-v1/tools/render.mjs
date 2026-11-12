// node tools/render.mjs [cut ...]   → exports/omnica-sally-ad-<cut>.mp4 (+ .srt)
// Renders with Remotion, then normalises loudness to -14 LUFS (Instagram/Reels target).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const edit = JSON.parse(readFileSync('edit.json', 'utf8'));
const tl = JSON.parse(readFileSync('src/timeline.json', 'utf8'));
const cuts = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(edit.cuts);
const chrome = process.env.CHROME_PATH || ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find(existsSync);
mkdirSync('out', { recursive: true }); mkdirSync('exports', { recursive: true });
const ts = s => { const ms = Math.round(s * 1000); const p = (n, l = 2) => String(n).padStart(l, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
for (const cut of cuts) {
  const raw = `out/${cut}.mp4`, final = `exports/omnica-sally-ad-${cut}.mp4`;
  execFileSync('npx', ['remotion', 'render', 'src/index.jsx', cut, raw, '--codec=h264', '--crf=17', '--concurrency=4', '--log=error', ...(chrome ? [`--browser-executable=${chrome}`] : [])], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', final]);
  let at = 0, n = 0, srt = '';
  for (const id of edit.cuts[cut]) {
    const beat = edit.beats[id];
    if (beat.type === 'end') { at += beat.dur; continue; }
    const { dur, subs } = tl[id];
    subs.forEach((s, i) => { srt += `${++n}\n${ts(at + s.start)} --> ${ts(at + (subs[i + 1]?.start ?? dur))}\n${s.text}\n\n`; });
    at += dur;
  }
  writeFileSync(`exports/omnica-sally-ad-${cut}.srt`, srt);
  console.log('wrote', final);
}
