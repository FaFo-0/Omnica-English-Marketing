// Renders the content engine Reels into their content/ folders.
//   node render.mjs            all pieces
//   node render.mjs Tenses     one composition
// In Claude cloud sessions: NODE_USE_ENV_PROXY=1 (Google Fonts) and
// REMOTION_BROWSER=/opt/pw-browsers/chromium (pre-installed Chromium).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const MARKETING = path.resolve(HERE, "../..");
const PIECES = { Tenses: { dir: "content/2026-11-tenses-reel", cover: 400 }, Age: { dir: "content/2026-11-age-reel", cover: 390 } };

const app = process.env.OMNICA_APP || ["../Omnica-English", "../omnica-english"].map(p => path.resolve(MARKETING, p)).find(p => existsSync(path.join(p, "public/brand/tenant")));
if (!app) throw new Error("App repo not found: clone FaFo-0/omnica-english next to this repo or set OMNICA_APP");
mkdirSync(path.join(HERE, "public"), { recursive: true });
copyFileSync(path.join(app, "public/brand/tenant/lockup-dark.svg"), path.join(HERE, "public/lockup-dark.svg"));

const browser = process.env.REMOTION_BROWSER ? ["--browser-executable", process.env.REMOTION_BROWSER] : [];
const only = process.argv[2];
for (const [id, { dir, cover }] of Object.entries(PIECES)) {
  if (only && only !== id) continue;
  const out = path.join(MARKETING, dir);
  const run = args => execFileSync("npx", ["remotion", ...args, ...browser], { cwd: HERE, stdio: "inherit" });
  run(["render", "src/index.jsx", id, path.join(out, "reel.mp4"), "--codec=h264", "--crf=18", "--concurrency=2"]);
  run(["still", "src/index.jsx", id, path.join(out, "cover.png"), `--frame=${cover}`]);
}
