// "Glow" Reel style: dark purple background with soft colour glows, word
// tiles, karaoke subtitles, quiz with countdown, cheat-sheet ending.
// A Reel is data: content/<piece>/script.json (scenes + subtitle lines).
// Scene types: hook · stack · list · rows · quiz · sheet.
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const G = {
  bg: "#12081C", white: "#FFFFFF", dim: "rgba(255,255,255,.42)", line: "rgba(255,255,255,.14)", tile: "rgba(255,255,255,.07)",
  yellow: "#FFCA00", purple: "#6716A4", violet: "#8E3BD1", deep: "#391052", lav: "#EBDDF3", green: "#2BD47D", red: "#FF4D5E",
};
const GLOWS = { purple: [G.violet, G.purple], yellow: ["#C98F00", G.purple], green: ["#13915A", G.purple], red: ["#B3243A", G.purple] };
const XFADE = 10;

let FONT = "Inter";
export const setGlowFont = f => { FONT = f; };

// ── timeline ───────────────────────────────────────────────────────────
const words = t => t.split(/\s+/).filter(Boolean);
// Subtitle tokens: punctuation-only pieces (—) stick to the previous word.
const tokens = t => words(t).reduce((a, w) => (/[\p{L}\p{N}]/u.test(w) || !a.length ? a.push(w) : (a[a.length - 1] += " " + w), a), []);
const capLen = c => c.len ?? Math.max(50, Math.round(words(c.text).length * 12 + 26));
export function buildTimeline(script) {
  let t = 0;
  const scenes = script.scenes.map(s => {
    let u = 0;
    const caps = s.captions.map(c => {
      const cap = typeof c === "string" ? { text: c } : c;
      const out = { ...cap, from: u, len: capLen(cap) + (cap.tail ?? 0), speak: capLen(cap) };
      u += out.len;
      return out;
    });
    const scene = { ...s, caps, from: t, len: u + XFADE };
    t += u;
    return scene;
  });
  return { scenes, total: t + XFADE };
}
// cue 1.5 = halfway through subtitle 1 (0-based)
const cueAt = (caps, cue) => {
  const i = Math.min(Math.floor(cue), caps.length - 1);
  return Math.round(caps[i].from + (cue - i) * caps[i].speak);
};

// ── primitives ─────────────────────────────────────────────────────────
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const useSpring = (at, config = { damping: 15, mass: 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config });
};

const Glow = ({ color, len }) => {
  const frame = useCurrentFrame();
  const [a, b] = GLOWS[color] ?? GLOWS.purple;
  const o = interpolate(frame, [0, XFADE, len - XFADE, len], [0, 1, 1, 0], clamp);
  const dx = Math.sin(frame / 70) * 60, dy = Math.cos(frame / 90) * 50;
  const blob = (x, y, size, c, op) => (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: c, opacity: op, filter: "blur(150px)" }} />
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {blob(180 + dx, 300 + dy, 760, a, 0.55)}
      {blob(940 - dx, 1650 - dy, 820, b, 0.5)}
      {blob(900 + dy, 700 + dx, 420, a, 0.18)}
    </AbsoluteFill>
  );
};

const Header = ({ tag, chip, color, counter }) => {
  const c = { purple: G.lav, yellow: G.yellow, green: G.green, red: G.red }[color] ?? G.lav;
  return (
    <>
      <div style={{ position: "absolute", top: 250, left: 70, right: 70, display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: "rgba(255,255,255,.55)" }}>
        <span><span style={{ color: G.yellow }}>●</span>&nbsp; OMNICA · {tag}</span>
        {counter && <span>{counter}</span>}
      </div>
      {chip && (
        <div style={{ position: "absolute", top: 318, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: c, border: `2px solid ${c}55`, background: `${c}14`, padding: "8px 22px", borderRadius: 12 }}>{chip}</span>
        </div>
      )}
    </>
  );
};

const TILE = {
  base: { bg: G.tile, fg: G.white, bd: G.line },
  hi: { bg: G.yellow, fg: G.deep, bd: G.yellow },
  ok: { bg: G.green, fg: "#06281A", bd: G.green },
  bad: { bg: "rgba(255,77,94,.16)", fg: G.red, bd: G.red },
  dim: { bg: "rgba(255,255,255,.04)", fg: "rgba(255,255,255,.35)", bd: "rgba(255,255,255,.08)" },
};
export const Tile = ({ text, state = "base", at = 0, size = 72, strike }) => {
  const p = useSpring(at);
  const frame = useCurrentFrame();
  const t = TILE[state];
  const s = strike ? interpolate(frame, [strike, strike + 10], [0, 100], clamp) : 0;
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1, color: t.fg, background: t.bg, border: `2px solid ${t.bd}`, borderRadius: size * 0.22, padding: `${size * 0.16}px ${size * 0.26}px ${size * 0.22}px`, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -50}px) scale(${0.85 + 0.15 * p})`, boxShadow: state === "hi" ? `0 0 40px ${G.yellow}55` : state === "ok" ? `0 0 40px ${G.green}55` : "none" }}>
      {text}
      {strike && <span style={{ position: "absolute", left: "8%", top: "52%", height: size * 0.07, width: `${s * 0.84}%`, background: G.red, borderRadius: 4 }} />}
    </span>
  );
};
const TileRow = ({ tiles, at = 0, gap = 14, size, stagger = 4 }) => (
  <div style={{ display: "flex", gap, justifyContent: "center", flexWrap: "wrap" }}>
    {tiles.map(([text, state], i) => <Tile key={i} text={text} state={state} at={at + i * stagger} size={size} />)}
  </div>
);
const Pop = ({ at, children, style, rise = 30 }) => {
  const p = useSpring(at);
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * rise}px)`, ...style }}>{children}</div>;
};
const Title = ({ children, at = 0, top = 410, size = 76 }) => (
  <Pop at={at} style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.1, color: G.white, letterSpacing: -1 }}>{children}</Pop>
);
const Badge = ({ ok, at }) => {
  const p = useSpring(at, { damping: 10 });
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 99, background: ok ? G.green : G.red, color: ok ? "#06281A" : G.white, fontFamily: FONT, fontWeight: 800, fontSize: 38, transform: `scale(${p})`, flexShrink: 0 }}>{ok ? "✓" : "✕"}</span>;
};

// Karaoke subtitles: spoken words white, current word on a yellow box, next words dim.
const Captions = ({ caps }) => {
  const frame = useCurrentFrame();
  const cap = caps.find(c => frame >= c.from && frame < c.from + c.len);
  if (!cap || !cap.text) return null;
  const ws = tokens(cap.text);
  const k = ((frame - cap.from) / (cap.speak * 0.92)) * ws.length;
  const o = interpolate(frame - cap.from, [0, 5], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 1420, left: 80, right: 80, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.25, textAlign: "center", background: "rgba(18,8,28,.55)", padding: "12px 22px", borderRadius: 18 }}>
        {ws.map((w, i) => {
          const cur = i === Math.floor(k);
          const latin = /[A-Za-z]/.test(w);
          return <span key={i} style={{ color: cur ? G.deep : i < k ? (latin ? G.yellow : G.white) : "rgba(255,255,255,.38)", background: cur ? G.yellow : "transparent", borderRadius: 8, padding: "0 6px", margin: "0 -6px" }}>{w}</span>;
        })}
      </div>
    </div>
  );
};

// ── scenes ─────────────────────────────────────────────────────────────
const Hook = ({ s, tag }) => {
  const cue = c => cueAt(s.caps, c);
  return (
    <>
      <Header tag={tag} chip={s.chip} color={s.glow} />
      <Title top={560} size={92}>{s.title}</Title>
      <div style={{ position: "absolute", top: 900, left: 0, right: 0 }}>
        <TileRow tiles={s.tiles} at={cue(s.tilesCue ?? 0) + 30} size={150} gap={28} stagger={7} />
      </div>
    </>
  );
};

const Stack = ({ s, tag }) => {
  const cue = c => cueAt(s.caps, c);
  const frame = useCurrentFrame();
  const n = s.levels.length; // levels listed top → bottom; revealed bottom → top
  return (
    <>
      <Header tag={tag} chip={s.chip} color={s.glow} />
      <Title top={420} size={70}>От большого к точному</Title>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {s.levels.map((l, i) => {
          const order = n - 1 - i;
          const at = cue(order) + 6;
          const active = frame >= at && (order === n - 1 || frame < cue(order + 1) + 6);
          const w = 420 + i * 230;
          const p = useSpring(at);
          return (
            <div key={l.word} style={{ width: w, height: 220, borderRadius: 28, border: `2px solid ${active ? G.yellow : G.line}`, background: active ? "rgba(255,202,0,.10)" : G.tile, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px)`, boxShadow: active ? `0 0 60px ${G.yellow}33` : "none" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 1, color: active ? G.yellow : G.white }}>{l.word}</span>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,.75)" }}>{l.note}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

const List = ({ s, tag }) => {
  const frame = useCurrentFrame();
  const ats = s.items.map(it => cueAt(s.caps, it.cue));
  const shown = ats.filter(a => frame >= a).length;
  return (
    <>
      <Header tag={tag} chip={s.chip} color={s.glow} counter={shown ? `${String(shown).padStart(2, "0")} / ${String(s.items.length).padStart(2, "0")}` : null} />
      <div style={{ position: "absolute", top: 430, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 14 }}>
        {s.items.map((it, i) => {
          const latest = i === shown - 1;
          const [prep, ...rest] = it.en.split(" ");
          return (
            <Pop key={i} at={ats[i]} style={{ borderRadius: 22, padding: "12px 28px", border: `2px solid ${latest ? `${G.yellow}88` : G.line}`, background: latest ? "rgba(255,202,0,.08)" : G.tile, opacity: frame < ats[i] ? 0 : latest ? 1 : 0.7 }}>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,.6)" }}>{it.ru}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: G.white, marginTop: 0 }}>
                <span style={{ color: G.yellow }}>{prep}</span> {rest.join(" ")}
              </div>
            </Pop>
          );
        })}
      </div>
    </>
  );
};

const Rows = ({ s, tag }) => {
  const cue = c => cueAt(s.caps, c);
  return (
    <>
      <Header tag={tag} chip={s.chip} color={s.glow} />
      <Title top={420} size={80}>{s.title}</Title>
      <div style={{ position: "absolute", top: 600, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 34 }}>
        {s.rows.map((r, i) => (
          <Pop key={i} at={cue(r.cue)} style={{ borderRadius: 28, padding: "24px 26px 30px", border: `2px solid ${G.line}`, background: G.tile }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,.65)", textAlign: "center", marginBottom: 18 }}>{r.ru}</div>
            <TileRow tiles={r.tiles} at={cue(r.cue) + 6} size={76} />
          </Pop>
        ))}
      </div>
    </>
  );
};

const Countdown = ({ at, len }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t >= len) return null;
  const n = Math.ceil((len - t) / (len / 3));
  const p = (t % (len / 3)) / (len / 3);
  const R = 92, C2 = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <svg width={240} height={240} viewBox="0 0 240 240">
        <circle cx={120} cy={120} r={R} stroke="rgba(255,255,255,.12)" strokeWidth={14} fill="none" />
        <circle cx={120} cy={120} r={R} stroke={G.green} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={C2} strokeDashoffset={C2 * p} transform="rotate(-90 120 120)" />
        <text x={120} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={100} fill={G.white}>{n}</text>
      </svg>
    </div>
  );
};

const Quiz = ({ s, tag }) => {
  const cue = c => cueAt(s.caps, c);
  const answer = cue(s.answerCue);
  const frame = useCurrentFrame();
  const revealed = frame >= answer;
  return (
    <>
      <Header tag={tag} chip={s.chip} color={s.glow} />
      <Title top={430} size={78}>{s.title}</Title>
      <div style={{ position: "absolute", top: 640, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 26 }}>
        {s.options.map((o, i) => {
          const good = !o.wrong;
          const bd = revealed ? (good ? G.green : `${G.red}88`) : G.line;
          return (
            <Pop key={i} at={cue(0) + 20 + i * 10} style={{ position: "relative", borderRadius: 28, padding: "34px 20px", border: `2px solid ${bd}`, background: revealed && good ? "rgba(43,212,125,.10)" : G.tile, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: revealed && !good ? 0.6 : 1 }}>
              <span style={{ position: "absolute", left: 22, top: 18, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,.6)", border: `2px solid ${G.line}`, borderRadius: 99, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>{"AB"[i]}</span>
              <div style={{ display: "flex", gap: 12 }}>
                {o.tiles.map((t, j) => (
                  <Tile key={j} text={t} size={64} at={cue(0) + 24 + i * 10 + j * 3}
                    state={t === o.key && revealed ? (good ? "ok" : "bad") : t === o.key ? "hi" : "base"}
                    strike={!good && t === o.key ? answer : undefined} />
                ))}
              </div>
              {revealed && <Badge ok={good} at={answer + 4} />}
            </Pop>
          );
        })}
      </div>
      <Countdown at={cue(s.countdownCue)} len={s.caps[s.countdownCue].len} />
    </>
  );
};

const ICONS = {
  bookmark: "M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  chat: "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z",
};
const Icon = ({ d, color }) => <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

const Sheet = ({ s, tag }) => {
  const cue = c => cueAt(s.caps, c);
  const icons = [ICONS.bookmark, ICONS.send, ICONS.chat];
  return (
    <>
      <Header tag={tag} />
      <Pop at={4} style={{ position: "absolute", top: 320, left: 70, fontFamily: FONT, fontWeight: 800, fontSize: 104, color: G.white, letterSpacing: -2 }}>{s.title}</Pop>
      <Pop at={12} style={{ position: "absolute", top: 470, left: 70, right: 70, borderRadius: 30, border: `2px solid ${G.line}`, background: G.tile, padding: "10px 34px" }}>
        {s.rows.map(([w, a, b], i) => (
          <div key={w} style={{ display: "flex", alignItems: "center", gap: 30, padding: "24px 0", borderTop: i ? `2px solid ${G.line}` : "none" }}>
            <span style={{ width: 120, fontFamily: FONT, fontWeight: 800, fontSize: 72, color: G.yellow }}>{w}</span>
            <div style={{ fontFamily: FONT }}>
              <div style={{ fontWeight: 700, fontSize: 38, color: G.white }}>{a}</div>
              <div style={{ fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,.6)", marginTop: 4 }}>{b}</div>
            </div>
          </div>
        ))}
      </Pop>
      <div style={{ position: "absolute", top: 1010, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 16 }}>
        {s.cta.map((t, i) => (
          <Pop key={i} at={cue(0) + 10 + i * 8} style={{ display: "flex", alignItems: "center", gap: 20, borderRadius: 20, padding: "20px 26px", fontFamily: FONT, fontWeight: 700, fontSize: 30, background: i === 0 ? G.yellow : G.tile, color: i === 0 ? G.deep : G.white, border: `2px solid ${i === 0 ? G.yellow : G.line}` }}>
            <Icon d={icons[i % 3]} color={i === 0 ? G.deep : G.white} />{t}
          </Pop>
        ))}
      </div>
      <Pop at={8} style={{ position: "absolute", top: 352, right: 70 }}>
        <Img src={staticFile("lockup-dark.svg")} style={{ height: 60 }} />
      </Pop>
    </>
  );
};

const SCENES = { hook: Hook, stack: Stack, list: List, rows: Rows, quiz: Quiz, sheet: Sheet };

const SceneFade = ({ len, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, XFADE, len - XFADE, len], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const GlowReel = ({ script }) => {
  const { scenes } = buildTimeline(script);
  return (
    <AbsoluteFill style={{ background: G.bg }}>
      {scenes.map((s, i) => (
        <Sequence key={`g${i}`} from={s.from} durationInFrames={s.len}><Glow color={s.glow} len={s.len} /></Sequence>
      ))}
      {scenes.map((s, i) => {
        const Scene = SCENES[s.type];
        return (
          <Sequence key={i} from={s.from} durationInFrames={s.len}>
            <SceneFade len={s.len}><Scene s={s} tag={script.tag} /></SceneFade>
            <Captions caps={s.caps} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
