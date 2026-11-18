// Omnica English — content engine Reels (1080 × 1920, 30 fps).
// Brand: brand/brand.md. Purple background, white text, yellow for the one
// thing to remember. Safe area y 250–1650. Logo comes from the app repo
// (copied into public/ by render.mjs, never committed here).
import React from "react";
import {
  AbsoluteFill, Composition, Img, interpolate, registerRoot, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/PTSerif";

const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "cyrillic"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["400"], subsets: ["latin", "cyrillic"] });

const C = { purple: "#6716A4", yellow: "#FFCA00", cream: "#FFF9ED", ink: "#33253C", lavender: "#EBDDF3", deep: "#391052", white: "#FFFFFF", red: "#D93636", green: "#1F9D55" };
const FPS = 30;

// ── helpers ────────────────────────────────────────────────────────────
const useIn = (at, cfg = { damping: 16, mass: 0.7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};
const fade = (frame, at, len = 10) => interpolate(frame, [at, at + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Pop = ({ at, children, style, rise = 40 }) => {
  const p = useIn(at);
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * rise}px) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>;
};

const Background = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 35%, ${C.purple} 55%, ${C.deep} 100%)` }} />
);

const Logo = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1572, display: "flex", justifyContent: "center", opacity: fade(frame, at, 12) }}>
      <Img src={staticFile("lockup-dark.svg")} style={{ height: 72 }} />
    </div>
  );
};

// Yellow marker sweeping under a word.
const Marker = ({ at, children }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [at, at + 12], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ position: "absolute", left: -6, bottom: 4, height: "42%", width: `calc(${w}% + 12px)`, background: C.yellow, borderRadius: 6, zIndex: 0 }} />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};

// ── Reel 1: 12 tenses are one table ───────────────────────────────────
const TENSE_COLS = ["Прошлое", "Настоящее", "Будущее"];
const TENSE_ROWS = [
  { label: "Факт", rule: "V2 · V", cells: ["wrote", "write", "will write"] },
  { label: "Процесс", rule: "be + -ing", cells: ["was writing", "am writing", "will be writing"] },
  { label: "Результат", rule: "have + V3", cells: ["had written", "have written", "will have written"] },
  { label: "Как долго", rule: "have been + -ing", cells: ["had been writing", "have been writing", "will have been writing"] },
];
const T = { hookMove: 80, header: 100, row0: 125, rowGap: 55, summary: 365, save: 425, end: 540 };

const TensesHook = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [T.hookMove, T.hookMove + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const top = interpolate(move, [0, 1], [700, 250]);
  const scale = interpolate(move, [0, 1], [1, 0.62]);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", transform: `scale(${scale})`, transformOrigin: "top center" }}>
      <Pop at={0}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 104, color: C.white, lineHeight: 1.05, letterSpacing: -2 }}>12 времён<br />английского?</div></Pop>
      <Pop at={28}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 100, color: C.yellow, marginTop: 24 }}>Это одна таблица.</div></Pop>
    </div>
  );
};

const CELL_W = 300, LABEL_GAP = 12;
const TensesTable = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 540, left: 60, right: 60, fontFamily: INTER }}>
      <div style={{ display: "flex", justifyContent: "space-between", opacity: fade(frame, T.header, 12), marginBottom: 18 }}>
        {TENSE_COLS.map(c => <div key={c} style={{ width: CELL_W, textAlign: "center", color: C.yellow, fontWeight: 700, fontSize: 38 }}>{c}</div>)}
      </div>
      {TENSE_ROWS.map((r, i) => {
        const at = T.row0 + i * T.rowGap;
        return (
          <div key={r.label} style={{ marginBottom: 26 }}>
            <Pop at={at} rise={20} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: LABEL_GAP }}>
              <span style={{ color: C.white, fontWeight: 800, fontSize: 46 }}>{r.label}</span>
              <span style={{ background: C.yellow, color: C.deep, fontWeight: 700, fontSize: 32, padding: "4px 18px", borderRadius: 999 }}>{r.rule}</span>
            </Pop>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {r.cells.map((c, j) => (
                <Pop key={c} at={at + 8 + j * 6} rise={24} style={{ width: CELL_W, height: 118, borderRadius: 22, background: "rgba(255,255,255,.12)", border: "2px solid rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 14px", boxSizing: "border-box" }}>
                  <span style={{ color: C.white, fontWeight: 600, fontSize: 38, lineHeight: 1.12 }}>{c}</span>
                </Pop>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TensesOutro = () => {
  const frame = useCurrentFrame();
  const swap = fade(frame, T.save, 10);
  return (
    <div style={{ position: "absolute", top: 1468, left: 0, right: 0, textAlign: "center", fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 0, right: 0, opacity: fade(frame, T.summary, 12) * (1 - swap), color: C.white, fontWeight: 700, fontSize: 52 }}>
        4 строки × 3 времени = <span style={{ color: C.yellow }}>все 12</span>
      </div>
      <Pop at={T.save} style={{ position: "absolute", left: 0, right: 0 }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.yellow, fontSize: 76 }}>Сохраните таблицу</span>
      </Pop>
    </div>
  );
};

const Tenses = () => (
  <AbsoluteFill>
    <Background />
    <TensesHook />
    <TensesTable />
    <TensesOutro />
    <Logo at={T.save + 8} />
  </AbsoluteFill>
);

// ── Reel 2: «Мне 30 лет» ──────────────────────────────────────────────
const A = { move: 70, wrong: 85, strike: 110, right: 140, right2: 170, rule: 215, ask: 265, save: 325, end: 400 };

const AgeTitle = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [A.move, A.move + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: interpolate(move, [0, 1], [680, 260]), left: 0, right: 0, textAlign: "center", transform: `scale(${interpolate(move, [0, 1], [1, 0.72])})`, transformOrigin: "top center" }}>
      <Pop at={0}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 68, color: C.white, letterSpacing: -1 }}>Как сказать по-английски</div></Pop>
      <Pop at={14}><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, color: C.yellow, marginTop: 10 }}>«Мне 30 лет»?</div></Pop>
    </div>
  );
};

const Badge = ({ ok }) => (
  <div style={{ width: 76, height: 76, borderRadius: 999, background: ok ? C.green : C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 800, flexShrink: 0 }}>{ok ? "✓" : "✕"}</div>
);

const AgeCards = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [A.strike, A.strike + 12], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const card = { background: C.cream, borderRadius: 32, padding: "36px 44px", display: "flex", alignItems: "center", gap: 30, boxShadow: `0 24px 60px ${C.deep}66` };
  return (
    <div style={{ position: "absolute", top: 600, left: 70, right: 70, fontFamily: INTER, display: "flex", flexDirection: "column", gap: 36 }}>
      <Pop at={A.wrong} style={card}>
        <Badge />
        <span style={{ position: "relative", fontSize: 66, fontWeight: 700, color: C.red }}>
          I have 30 years.
          <span style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${strike}%`, background: C.red, borderRadius: 4 }} />
        </span>
      </Pop>
      <Pop at={A.right} style={{ ...card, alignItems: "flex-start" }}>
        <Badge ok />
        <div style={{ color: C.purple, fontWeight: 800 }}>
          <div style={{ fontSize: 96, lineHeight: 1 }}><Marker at={A.right + 10}>I'm</Marker> 30.</div>
          <div style={{ fontSize: 58, marginTop: 18, opacity: fade(frame, A.right2, 10) }}><Marker at={A.right2 + 6}>I'm</Marker> 30 years old.</div>
        </div>
      </Pop>
      <Pop at={A.rule} style={{ textAlign: "center", color: C.white, fontSize: 58, fontWeight: 700, marginTop: 20 }}>
        Возраст — через <span style={{ color: C.yellow }}>am / is / are</span>
      </Pop>
      <Pop at={A.ask} style={{ alignSelf: "center", textAlign: "center", marginTop: 10 }}>
        <div style={{ color: "rgba(255,255,255,.85)", fontSize: 44, fontWeight: 600, marginBottom: 14 }}>Как спросить:</div>
        <div style={{ background: C.lavender, color: C.deep, fontSize: 64, fontWeight: 800, padding: "22px 44px", borderRadius: "40px 40px 40px 10px" }}>How old are you?</div>
      </Pop>
    </div>
  );
};

const Age = () => {
  return (
    <AbsoluteFill>
      <Background />
      <AgeTitle />
      <AgeCards />
      <Pop at={A.save} style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.yellow, fontSize: 68 }}>Сохраните и отправьте другу</span>
      </Pop>
      <Logo at={A.save + 8} />
    </AbsoluteFill>
  );
};

const Root = () => (
  <>
    <Composition id="Tenses" component={Tenses} durationInFrames={T.end} fps={FPS} width={1080} height={1920} />
    <Composition id="Age" component={Age} durationInFrames={A.end} fps={FPS} width={1080} height={1920} />
  </>
);

registerRoot(Root);
