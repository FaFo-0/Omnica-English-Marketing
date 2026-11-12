// node tools/render.mjs → exports/omnica-sally-ad.mp4 (+ .srt)
// 1) trim the two pauses out of rough-cut v5 (picture + sound, nothing else changed)
// 2) render the transparent overlay (screens, labels, subtitles, endcard) with Remotion
// v5 is HLG HDR (bt2020 / arib-std-b67). Its pixels pass through as they are; the sRGB overlay is converted to HLG
// with graphics white at 203 nits so the graphics do not glow next to the footage.
// 3) lay the overlay over v5 and encode once
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const run = (c, a) => execFileSync(c, a, { stdio: 'inherit' });
run('node', ['tools/timeline.mjs']);
const edit = JSON.parse(readFileSync('edit.json', 'utf8'));
const tl = JSON.parse(readFileSync('src/timeline.json', 'utf8'));
const chrome = process.env.CHROME_PATH || ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find(existsSync);
mkdirSync('out', { recursive: true }); mkdirSync('exports', { recursive: true });

// v5 is HLG HDR, which plays heavily on phones and makes sRGB graphics look dim next to it.
// Convert its picture once to standard range (same brightness, colours mapped bt2020 -> bt709); graphics stay plain sRGB.
const sdr = 'zscale=pin=bt2020:p=bt709:min=bt2020nc:m=bt709:tin=bt709:t=bt709:rin=tv:r=tv,format=yuv420p';
// short zoom across v5's Sally-to-Sally cuts: ease in before the cut, settle after it
const Z = '1' + edit.punch.map(c => `+0.06*between(t,${(c - 0.1).toFixed(3)},${(c - 0.0001).toFixed(4)})*pow((t-${(c - 0.1).toFixed(3)})/0.1,2)+0.10*between(t,${c},${(c + 0.25).toFixed(3)})*pow(1-(t-${c})/0.25,3)`).join('');
const zoom = `scale=w='2*trunc(540*(${Z}))':h='2*trunc(960*(${Z}))':eval=frame:flags=bicubic,crop=1080:1920:(iw-1080)/2:(ih-1920)*0.38`;
const keep = []; let at = 0;
for (const [a, b] of edit.trims) { keep.push([at, a]); at = b; }
keep.push([at, edit.end.at]);
const v = keep.map(([a, b], i) => `[zv${i}]trim=${a}:${b},setpts=PTS-STARTPTS[v${i}];[0:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st=${(b - a - 0.008).toFixed(3)}:d=0.008[a${i}]`).join(';');
const split = `[0:v]${sdr},${zoom},split=${keep.length}${keep.map((_, i) => `[zv${i}]`).join('')}`;
const cat = keep.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${keep.length}:v=1:a=1[sv][sa]`;
const endS = edit.end.dur;
const fc = `${split};${v};${cat};[sv]fps=30,tpad=stop_mode=clone:stop_duration=${endS}[base];[1:v]format=yuva444p[ov];[base][ov]overlay=0:0:format=auto,format=yuv420p[out];[sa]apad=pad_dur=${endS}[aout]`;

if (!process.env.SKIP_OVERLAY) run('npx', ['remotion', 'render', 'src/index.jsx', 'overlay', 'out/overlay.mov', '--codec=prores', '--prores-profile=4444', '--pixel-format=yuva444p10le', '--image-format=png', '--concurrency=4', '--log=error', ...(chrome ? [`--browser-executable=${chrome}`] : [])]);
run('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'source/rough-cut-v5.mp4', '-i', 'out/overlay.mov', '-filter_complex', fc, '-map', '[out]', '-map', '[aout]',
  '-t', String(tl.total / tl.fps), '-r', '30', '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-refs', '3', '-bf', '2', '-crf', '20', '-maxrate', '5M', '-bufsize', '10M', '-preset', 'medium', '-g', '30',
  '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', 'exports/omnica-sally-ad.mp4']);

const ts = f => { const ms = Math.round(f / tl.fps * 1000); const p = (n, l = 2) => String(n).padStart(l, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
let n = 0, srt = '';
for (const b of tl.beats) b.subs.forEach((s, i) => { srt += `${++n}\n${ts(b.from + s.at)} --> ${ts(b.from + (b.subs[i + 1]?.at ?? b.dur))}\n${s.text}\n\n`; });
writeFileSync('exports/omnica-sally-ad.srt', srt);
console.log('wrote exports/omnica-sally-ad.mp4');
