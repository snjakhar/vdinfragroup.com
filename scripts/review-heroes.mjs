/**
 * npm run heroes:review
 *   Builds ~/Downloads/Projects/website-media/ai-heroes/review.html: a before/after
 *   slider for every AI result, to check the building did not change.
 *
 * npm run heroes:approve -- <slug> <variant>     e.g.  npm run heroes:approve -- sky-elegant v2
 *   Makes the chosen result the project's front image (labelled "Artist's impression"),
 *   keeps the real photo as the first gallery image, and copies the file for local preview.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const MEDIA = path.join(os.homedir(), "Downloads/Projects/website-media");
const AI = path.join(MEDIA, "ai-heroes");
const [cmd, slug, variant] = process.argv.slice(2);

if (cmd === "review") {
  fs.mkdirSync(AI, { recursive: true });
  const projects = fs.existsSync(AI) ? fs.readdirSync(AI).filter((d) => fs.statSync(path.join(AI, d)).isDirectory()) : [];
  const cards = projects
    .flatMap((p) =>
      fs
        .readdirSync(path.join(AI, p))
        .filter((f) => /^v\d+\.jpg$/.test(f))
        .map(
          (v) => `<section><h2>${p} · ${v.replace(".jpg", "")}</h2>
      <div class="cmp"><img src="${p}/original.jpg" alt=""><div class="after" style="--x:50%"><img src="${p}/${v}" alt=""></div>
      <input type="range" min="0" max="100" value="50" oninput="this.previousElementSibling.style.setProperty('--x', this.value + '%')"></div>
      <div class="pair"><img src="${p}/original.jpg" alt=""><img src="${p}/${v}" alt=""></div>
      <code>npm run heroes:approve -- ${p} ${v.replace(".jpg", "")}</code></section>`,
        ),
    )
    .join("\n");
  fs.writeFileSync(
    path.join(AI, "review.html"),
    `<!doctype html><meta charset="utf-8"><title>AI front images: review</title>
<style>body{font:15px system-ui;margin:24px;background:#f7f4ee;color:#1c1b19}section{margin:0 0 56px}h2{font-weight:600}
.cmp{position:relative;max-width:1100px;aspect-ratio:16/9;background:#ddd}.cmp img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.after{position:absolute;inset:0;clip-path:inset(0 0 0 var(--x))}.cmp input{position:absolute;bottom:8px;left:5%;width:90%}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:1100px;margin-top:8px}.pair img{width:100%;height:260px;object-fit:contain;background:#ddd}
code{display:inline-block;margin-top:8px;background:#14171a;color:#f7f4ee;padding:6px 10px}</style>
<h1>AI front images: check the building has not changed</h1>
<p>Drag the slider: left of the line is the original, right is the AI version. Check floors, windows, balconies and colours.</p>${cards || "<p>No results yet. Run npm run heroes:enhance first.</p>"}`,
  );
  console.log(`Open: ${path.join(AI, "review.html")}`);
} else if (cmd === "approve") {
  if (!slug || !variant) throw new Error("Usage: npm run heroes:approve -- <slug> <variant, e.g. v1>");
  const from = path.join(AI, slug, `${variant}.jpg`);
  if (!fs.existsSync(from)) throw new Error(`Not found: ${from}`);
  const key = `projects/${slug}/photos/00-front-artist-impression.jpg`;
  const dest = path.join(MEDIA, key);
  await sharp(from).jpeg({ quality: 86, progressive: true }).toFile(dest);
  const { width, height } = await sharp(dest).metadata();
  const tiny = await sharp(dest).resize(16).webp({ quality: 40 }).toBuffer();

  const jsonPath = path.join("content/projects", `${slug}.json`);
  const project = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const media = project.media;
  const previousHero = media.hero;
  media.gallery = [previousHero, ...media.gallery].filter((g, i, a) => !g.impression && a.findIndex((x) => x.src === g.src) === i);
  media.hero = {
    src: key,
    alt: `${project.title}, ${project.location.locality}: artist's impression of the building`,
    width,
    height,
    blur: `data:image/webp;base64,${tiny.toString("base64")}`,
    impression: true,
  };
  fs.writeFileSync(jsonPath, `${JSON.stringify(project, null, 2)}\n`);

  const local = path.join("public/media", key);
  if (fs.existsSync(path.dirname(local))) fs.copyFileSync(dest, local);
  console.log(`${slug}: front image is now ${key} (artist's impression); real photo kept as first gallery image.`);
} else {
  console.log("Usage: node scripts/review-heroes.mjs review | approve <slug> <variant>");
}
