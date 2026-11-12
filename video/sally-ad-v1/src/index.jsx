import React from 'react';
import { AbsoluteFill, Audio, Composition, Easing, Img, OffthreadVideo, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/inter/cyrillic-600.css';
import '@fontsource/inter/cyrillic-700.css';
import '@fontsource/inter/cyrillic-800.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import edit from '../edit.json';
import timeline from './timeline.json';

const P = '#6716A4', PD = '#3B0D61', Y = '#FFCA00', C = '#FFF9ED';
const FPS = edit.fps;
const FONT = 'Inter, Arial, sans-serif';
const fr = s => Math.round(s * FPS);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

// Reels covers roughly the top 14% and bottom 26% of the frame with its own UI: keep text between y=270 and y=1420.
const SUB_BOTTOM = 1400;
const LABEL_TOP = 290;

const plan = cut => {
  let at = 0;
  return edit.cuts[cut].map((id, i, all) => {
    const beat = edit.beats[id];
    const dur = beat.type === 'end' ? fr(beat.dur) : fr(timeline[id].dur);
    const prev = edit.beats[all[i - 1]];
    const row = { id, beat, from: at, dur, sameLabel: !!(prev && prev.label && prev.label === beat.label) };
    at += dur;
    return row;
  });
};
const total = cut => plan(cut).reduce((n, b) => n + b.dur, 0);

const Sally = ({ id, dur, alt, bright = 1.12 }) => {
  const f = useCurrentFrame();
  // Alternate a tighter punch-in so consecutive talking-head cuts read as deliberate.
  const base = alt ? 1.12 : 1.0;
  const scale = base + interpolate(f, [0, dur], [0, 0.035]);
  return <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
    <OffthreadVideo muted src={staticFile(`sally/${id}.mp4`)} style={{ width: 1080, height: 1920, transform: `scale(${scale})`, transformOrigin: '50% 36%', filter: `brightness(${bright}) contrast(1.03)` }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(20,6,34,0.30) 0%, rgba(20,6,34,0) 16%, rgba(20,6,34,0) 52%, rgba(20,6,34,0.50) 78%, rgba(20,6,34,0.62) 100%)' }} />
  </AbsoluteFill>;
};

const Shot = ({ shot, dur }) => {
  const f = useCurrentFrame();
  const z = shot.zoom ?? 1;
  const scale = z * (1 + interpolate(f, [0, dur], [0, 0.03]));
  return <AbsoluteFill style={{ overflow: 'hidden', background: C }}>
    <OffthreadVideo muted src={staticFile(`screens/${shot.src}`)} startFrom={fr(shot.at)} playbackRate={shot.rate ?? 1}
      style={{ width: 1080, height: 1920, transform: `translate(${shot.x ?? 0}px, ${shot.y ?? 0}px) scale(${scale})`, transformOrigin: `50% ${shot.origin ?? 40}%` }} />
  </AbsoluteFill>;
};

const Screen = ({ beat, dur, sameLabel }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = sameLabel ? 1 : spring({ frame: f, fps, config: { damping: 200, stiffness: 170 } });
  let at = 0;
  const shots = beat.shots.map((s, i) => { const len = s.len ? fr(s.len) : dur - at; const row = { s, from: at, len }; at += len; return row; });
  return <AbsoluteFill style={{ background: P }}>
    <AbsoluteFill style={{ transform: `translateY(${(1 - enter) * 120}px) scale(${0.94 + 0.06 * enter})`, opacity: Math.min(1, enter * 1.6) }}>
      {shots.map(({ s, from, len }, i) => <Sequence key={i} from={from} durationInFrames={len}><Shot shot={s} dur={len} /></Sequence>)}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(59,13,97,0.0) 0%, rgba(59,13,97,0) 60%, rgba(59,13,97,0.30) 76%, rgba(59,13,97,0.55) 100%)' }} />
    </AbsoluteFill>
    <Label text={beat.label} still={sameLabel} />
  </AbsoluteFill>;
};

const Label = ({ text, still }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = still ? 1 : spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 180 } });
  return <div style={{ position: 'absolute', top: LABEL_TOP, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
    <div style={{ background: Y, color: PD, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 2.5, padding: '18px 34px', borderRadius: 18, boxShadow: '0 10px 0 rgba(59,13,97,0.9)', transform: `scale(${p}) rotate(${-2 * (1 - p) - 1.5}deg)`, opacity: Math.min(1, p * 2) }}>{text}</div>
  </div>;
};

const Subs = ({ id, beat, dur }) => {
  const f = useCurrentFrame();
  const subs = timeline[id].subs;
  const i = subs.reduce((best, s, n) => (f >= fr(s.start) - 2 ? n : best), 0);
  const start = Math.max(0, fr(subs[i].start) - 2);
  const local = f - start;
  const pop = interpolate(local, [0, 5], [0.86, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const fade = interpolate(local, [0, 3], [0, 1], clamp) * interpolate(f, [dur - 2, dur], [1, 0.85], clamp);
  const big = beat.hook;
  return <div style={{ position: 'absolute', left: 70, right: 70, bottom: 1920 - SUB_BOTTOM, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    {beat.en ? <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: '#fff', textAlign: 'center', textShadow: '0 3px 14px rgba(0,0,0,0.85)', maxWidth: 860 }}>{beat.en}</div> : null}
    <div style={{ background: P, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: big ? 68 : 60, lineHeight: 1.16, letterSpacing: -0.5, textAlign: 'center', padding: big ? '26px 38px 30px' : '22px 34px 26px', borderRadius: 26, boxShadow: `0 10px 0 ${PD}`, transform: `scale(${pop})`, opacity: fade, maxWidth: 940 }}>{subs[i].text}</div>
  </div>;
};

const End = ({ beat, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = d => spring({ frame: f - d, fps, config: { damping: 16, stiffness: 150 } });
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, f - 22) / 5);
  return <AbsoluteFill style={{ background: P, fontFamily: FONT, alignItems: 'center' }}>
    <div style={{ position: 'absolute', top: 400, width: 250, height: 250, borderRadius: 56, overflow: 'hidden', transform: `scale(${s(0)})`, boxShadow: `0 14px 0 ${PD}` }}>
      <Img src={staticFile('logo.svg')} style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ position: 'absolute', top: 700, fontWeight: 800, fontSize: 52, color: Y, letterSpacing: 0.5, opacity: s(4) }}>Omnica English</div>
    <div style={{ position: 'absolute', top: 800, width: 940, textAlign: 'center', whiteSpace: 'pre-line', fontWeight: 800, fontSize: 92, lineHeight: 1.08, letterSpacing: -2, color: C, opacity: s(7), transform: `translateY(${(1 - s(7)) * 40}px)` }}>{beat.headline}</div>
    <div style={{ position: 'absolute', top: 1085, background: Y, color: PD, fontWeight: 800, fontSize: 50, padding: '34px 54px', borderRadius: 26, boxShadow: `0 12px 0 ${PD}`, transform: `scale(${s(13) * pulse})` }}>{beat.button} →</div>
    <div style={{ position: 'absolute', top: 1290, fontWeight: 600, fontSize: 38, color: C, opacity: 0.9 * s(18) }}>{beat.domain}</div>
  </AbsoluteFill>;
};

const Ad = ({ cut }) => {
  let sally = 0;
  return <AbsoluteFill style={{ background: P }}>
    {plan(cut).map(({ id, beat, from, dur, sameLabel }) => {
      const alt = beat.type === 'sally' ? (sally++ % 2 === 1) : false;
      return <Sequence key={id} from={from} durationInFrames={dur}>
        {beat.type === 'sally' ? <Sally id={id} dur={dur} alt={alt} bright={beat.bright} /> : null}
        {beat.type === 'screen' ? <Screen beat={beat} dur={dur} sameLabel={sameLabel} /> : null}
        {beat.type === 'end' ? <End beat={beat} dur={dur} /> : null}
        {beat.type !== 'end' ? <><Subs id={id} beat={beat} dur={dur} /><Audio src={staticFile(`audio/${id}.wav`)} /></> : null}
      </Sequence>;
    })}
  </AbsoluteFill>;
};

const Root = () => <>
  {Object.keys(edit.cuts).map(cut => <Composition key={cut} id={cut} component={Ad} defaultProps={{ cut }} durationInFrames={total(cut)} fps={FPS} width={1080} height={1920} />)}
</>;
registerRoot(Root);
