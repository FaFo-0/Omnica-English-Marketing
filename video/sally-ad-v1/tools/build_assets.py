"""Cut Sally's takes out of the raw footage: punched-in graded picture for the on-camera beats,
cleaned voice-recorder audio for every beat, and word timings for the subtitles.

  RAW_DIR=/path/with/raw python3 tools/build_assets.py

RAW_DIR must hold the five 20261110_*.mp4 camera files, voice_261110_162017.m4a and transcripts/*.json
(the Drive folder "Sally's AD" + its sally-ad-handoff/transcripts). Writes public/sally, public/audio, src/timeline.json.
"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.environ['RAW_DIR']
E = json.load(open(f'{ROOT}/edit.json'))
PRE, POST = E['pad']['pre'], E['pad']['post']
os.makedirs(f'{ROOT}/public/sally', exist_ok=True); os.makedirs(f'{ROOT}/public/audio', exist_ok=True)

def run(a): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + a, check=True)

def words(clip, a, b, first=None):
    toks = json.load(open(f'{RAW}/transcripts/{clip}.json'))['tokens']
    out = []
    for t in toks:
        s, e = t['start_ms'] / 1000, t['end_ms'] / 1000
        if s < a - 0.35 or s > b + 0.25: continue
        if not re.search(r'\w', t['text']): continue
        if t['text'].startswith(' ') or not out: out.append([t['text'].strip(), s, e])
        else: out[-1][0] += t['text']; out[-1][2] = e
    if first:
        i = next(i for i, w in enumerate(out) if w[0].startswith(first)); out = out[i:]
    return out

tl = {}
for k, s in E['sources'].items():
    w = words(s['clip'], s['from'], s['to'], s.get('firstWord'))
    t0, t1 = w[0][1] - s.get('pre', PRE), w[-1][2] + s.get('post', POST)
    dur = round((t1 - t0) * 30) / 30
    beat = E['beats'][k]
    need = sum(n for _, n in beat['subs'])
    if need != len(w): print('MISMATCH', k, need, len(w), [x[0] for x in w]); continue
    assert need == len(w), f'{k}: subs cover {need} words, transcript has {len(w)}: {[x[0] for x in w]}'
    subs, i = [], 0
    for text, n in beat['subs']:
        subs.append({'text': text, 'start': round(w[i][1] - t0, 3)}); i += n
    tl[k] = {'dur': dur, 'subs': subs, 'spoken': ' '.join(x[0] for x in w)}
    wav = f'{ROOT}/public/audio/{k}.wav'
    run(['-ss', f'{t0 + s["voiceOffset"] - 0.012:.3f}', '-i', f'{RAW}/voice_261110_162017.m4a', '-t', f'{dur}',
         '-af', f'highpass=f=90,afftdn=nr=9:nf=-42,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=4,afade=t=in:d=0.03,afade=t=out:st={dur - 0.05:.3f}:d=0.05',
         '-ar', '48000', '-ac', '1', wav])
    if 'crop' in s and not os.environ.get('AUDIO_ONLY') and not (os.environ.get('KEEP') and os.path.exists(f'{ROOT}/public/sally/{k}.mp4')):
        x, y = s['crop']; g = s.get('gamma', 1.08)
        run(['-ss', f'{t0:.3f}', '-i', f'{RAW}/{s["clip"]}.mp4', '-t', f'{dur}', '-an',
             '-vf', f'crop=1500:2667:{x}:{y},scale=1080:1920:flags=lanczos,fps=30,eq=gamma={g}:contrast=1.06:saturation=1.10,colorbalance=rm=0.03:gm=-0.02:bm=0.02,unsharp=5:5:0.4',
             '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', f'{ROOT}/public/sally/{k}.mp4'])
    print(f'{k:12s} {dur:5.2f}s  {tl[k]["spoken"]}')
json.dump(tl, open(f'{ROOT}/src/timeline.json', 'w'), ensure_ascii=False, indent=1)
