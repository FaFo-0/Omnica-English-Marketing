// Turns edit.json + source/v5-words.json into src/timeline.json (frames on the trimmed timeline).
import { readFileSync, writeFileSync } from 'node:fs';
const edit = JSON.parse(readFileSync('edit.json', 'utf8'));
const words = JSON.parse(readFileSync('source/v5-words.json', 'utf8'));
const fps = edit.fps;
// map a v5 time to the trimmed timeline
export const map = t => t - edit.trims.reduce((n, [a, b]) => n + (t >= b ? b - a : t > a ? t - a : 0), 0);
const fr = t => Math.round(map(t) * fps);
let w = 0;
const beats = edit.beats.map((b, i) => {
  const from = fr(b.from), to = fr(edit.beats[i + 1]?.from ?? edit.end.at);
  const subs = b.subs.map(([text, n]) => { const s = { text, at: Math.max(0, fr(words[w][1]) - from - 2) }; w += n; return s; });
  return { ...b, from, dur: to - from, subs };
});
if (w !== words.length) throw new Error(`subs cover ${w} words, v5 has ${words.length}`);
const endFrom = fr(edit.end.at), endDur = Math.round(edit.end.dur * fps);
writeFileSync('src/timeline.json', JSON.stringify({ fps, beats, end: { ...edit.end, from: endFrom, dur: endDur }, total: endFrom + endDur }, null, 1));
console.log('frames', endFrom + endDur, 'seconds', ((endFrom + endDur) / fps).toFixed(2));
