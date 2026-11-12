import React from 'react';
import { AbsoluteFill, Composition, Easing, Img, OffthreadVideo, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/inter/cyrillic-600.css';
import '@fontsource/inter/cyrillic-700.css';
import '@fontsource/inter/cyrillic-800.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import tl from './timeline.json';

const P = '#6716A4', PD = '#3B0D61', Y = '#FFCA00', C = '#FFF9ED';
const FPS = tl.fps;
const FONT = 'Inter, Arial, sans-serif';
const fr = s => Math.round(s * FPS);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

// Reels covers roughly the top 14% and bottom 26% of the frame with its own UI: keep text between y=270 and y=1420.
const SUB_BOTTOM = 1400;
const LABEL_TOP = 290;

const Shot = ({ shot, dur }) => {
  const f = useCurrentFrame();
  const z = shot.zoom ?? 1;
  const scale = z;
  return <AbsoluteFill style={{ overflow: 'hidden', background: C }}>
    <OffthreadVideo muted src={staticFile(`screens/${shot.src}`)} startFrom={fr(shot.at)} playbackRate={shot.rate ?? 1}
      style={{ width: 1080, height: 1920, transform: `translate(${shot.x ?? 0}px, ${shot.y ?? 0}px) scale(${scale})`, transformOrigin: `50% ${shot.origin ?? 40}%` }} />
  </AbsoluteFill>;
};

const Screen = ({ beat, dur, sameLabel }) => {
  let at = 0;
  const shots = beat.shots.map(s => { const len = s.len ? fr(s.len) : dur - at; const row = { s, from: at, len }; at += len; return row; });
  return <AbsoluteFill style={{ background: C }}>
    {shots.map(({ s, from, len }, i) => <Sequence key={i} from={from} durationInFrames={len}><Shot shot={s} dur={len} /></Sequence>)}
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

const Subs = ({ beat }) => {
  const f = useCurrentFrame();
  const subs = beat.subs;
  const i = subs.reduce((best, s, n) => (f >= s.at ? n : best), 0);
  const local = f - subs[i].at;
  const pop = interpolate(local, [0, 5], [0.9, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const fade = interpolate(local, [0, 3], [0, 1], clamp);
  const big = beat.hook;
  const pos = beat.subsTop ? { top: LABEL_TOP + 130 } : { bottom: 1920 - SUB_BOTTOM };
  return <div style={{ position: 'absolute', left: 70, right: 70, ...pos, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    {beat.en ? <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, lineHeight: 1.2, color: '#fff', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 3px 18px rgba(0,0,0,0.9)', maxWidth: 900 }}>{beat.en}</div> : null}
    <div style={{ background: P, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: big ? 68 : 60, lineHeight: 1.16, letterSpacing: -0.5, textAlign: 'center', padding: big ? '26px 38px 30px' : '22px 34px 26px', borderRadius: 26, boxShadow: `0 10px 0 ${PD}`, transform: `scale(${pop})`, opacity: fade, maxWidth: 940 }}>{subs[i].text}</div>
  </div>;
};

const End = ({ beat }) => {
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

// Overlay only: transparent wherever Sally is on camera, so rough-cut v5's picture passes through untouched.
const Overlay = () => <AbsoluteFill>
  {tl.beats.map((beat, i) => <Sequence key={beat.id} from={beat.from} durationInFrames={beat.dur}>
    {beat.type === 'screen' ? <Screen beat={beat} dur={beat.dur} sameLabel={tl.beats[i - 1]?.label === beat.label} /> : null}
    <Subs beat={beat} />
  </Sequence>)}
  <Sequence from={tl.end.from} durationInFrames={tl.end.dur}><End beat={tl.end} /></Sequence>
</AbsoluteFill>;

registerRoot(() => <Composition id="overlay" component={Overlay} durationInFrames={tl.total} fps={FPS} width={1080} height={1920} />);
