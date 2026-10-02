/**
 * npm run heroes:enhance -- [slug ...] [--model=NAME] [--variants=N]
 *
 * Sends each project's front (hero) image to Google Gemini image editing and
 * saves enhanced versions for review. The building must stay exactly the same;
 * only finish, light, sky and surroundings change. Nothing on the website
 * changes until you approve a result (see npm run heroes:review).
 *
 * Needs GEMINI_API_KEY in .env.local (https://aistudio.google.com/apikey).
 * Input:  ~/Downloads/Projects/website-media/projects/<slug>/photos/01-*.jpg
 * Output: ~/Downloads/Projects/website-media/ai-heroes/<slug>/v<N>.jpg
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const MEDIA = path.join(os.homedir(), "Downloads/Projects/website-media");
const OUT = path.join(MEDIA, "ai-heroes");

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const args = process.argv.slice(2);
const opt = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const MODEL = opt("model", process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image");
const SIZE = opt("size", "2K"); // 1K | 2K | 4K (supported by the Pro model)
// --square: recompose the APPROVED AI front image into a 1:1 version for the home page split hero.
const SQUARE = args.includes("--square");
const VARIANTS = Number(opt("variants", "2"));
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Missing GEMINI_API_KEY. Add it to .env.local (get one at https://aistudio.google.com/apikey).");
  process.exit(1);
}

const KEEP = `Keep the building EXACTLY as it is: same facade design, same number of floors, same windows, balconies, railings, materials and colours, same proportions and the same camera angle. Do not add, remove or redesign any part of the building.`;
const PROMPTS = {
  photo: `${KEEP}
Turn this photograph into a polished, photorealistic architectural render of the same building:
- straighten converging verticals so the building stands upright
- remove overhead electric wires, poles, signboards of other businesses, debris and clutter
- remove all people, including workers on balconies, and any construction items
- replace the sky with a soft, clear evening sky (blue hour) and add warm light glowing from the windows and facade lighting
- clean and level the road and frontage; add neat, modest landscaping (trimmed plants, palms) only on the ground in front
- crisp, clean finish with natural, true-to-life colours; no people, no text, no watermark
Widen the frame to a 16:9 landscape composition by extending only the sky, ground and surroundings, keeping the whole building in view.`,
  render: `${KEEP}
This is an architectural visualisation. Improve its finish to a high-end, photorealistic render of the same building:
- sharper detail and cleaner edges, realistic materials and glass reflections
- soft evening (blue hour) sky with warm light from windows and facade lighting
- clean frontage with modest, neat landscaping; no people, no text, no watermark
Widen the frame to a 16:9 landscape composition by extending only the sky, ground and surroundings, keeping the whole building in view.`,
};

// Projects whose front image is a real photograph; all others are existing 3D renders.
const PHOTOS = new Set(["sky-elegant", "sky-crown", "krishnam-kothi-41", "krishnam-kothi-27", "krishnam-kothi-94", "sky-villa"]);

const SQUARE_PROMPT = `${KEEP}
Recompose this exact image into a square 1:1 composition. The ENTIRE building must be visible, centred, with comfortable empty margin of sky above and ground below and space on both sides. Extend only the sky, ground, landscaping and surroundings. Keep the same lighting, colours and finish. No people, no text, no watermark.`;

async function enhance(slug) {
  const dir = path.join(MEDIA, "projects", slug, "photos");
  const src = SQUARE
    ? fs.readdirSync(dir).find((f) => f.startsWith("00-front-artist-impression"))
    : fs.readdirSync(dir).filter((f) => f.startsWith("01-")).sort()[0];
  if (!src) return console.warn(`  ${slug}: no 01-* hero image, skipped`);
  const input = await sharp(path.join(dir, src)).resize(2400, 2400, { fit: "inside" }).jpeg({ quality: 92 }).toBuffer();
  const prompt = SQUARE ? SQUARE_PROMPT : PHOTOS.has(slug) ? PROMPTS.photo : PROMPTS.render;
  fs.mkdirSync(path.join(OUT, slug), { recursive: true });
  if (!SQUARE) fs.copyFileSync(path.join(dir, src), path.join(OUT, slug, "original.jpg"));

  for (let v = 1; v <= VARIANTS; v++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: input.toString("base64") } }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: SQUARE ? "1:1" : "16:9", ...(MODEL.includes("pro") ? { imageSize: SIZE } : {}) } },
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error(`  ${slug} v${v}: API error ${res.status}: ${json.error?.message ?? JSON.stringify(json).slice(0, 300)}`);
      if (res.status === 400 || res.status === 403 || res.status === 404) process.exit(1);
      continue;
    }
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
    const data = part?.inlineData?.data ?? part?.inline_data?.data;
    if (!data) {
      console.warn(`  ${slug} v${v}: no image returned (${json.candidates?.[0]?.finishReason ?? "unknown"})`);
      continue;
    }
    const out = path.join(OUT, slug, SQUARE ? `sq${v}.jpg` : `v${v}.jpg`);
    await sharp(Buffer.from(data, "base64")).jpeg({ quality: 90 }).toFile(out);
    const { width, height } = await sharp(out).metadata();
    console.log(`  ${slug} v${v}: ${width}x${height} -> ${out}`);
  }
}

const slugs = args.filter((a) => !a.startsWith("--"));
const all = fs.readdirSync(path.join(MEDIA, "projects")).filter((d) => fs.existsSync(path.join(MEDIA, "projects", d, "photos")));
const todo = slugs.length ? slugs : all;
console.log(`Model ${MODEL} (${SIZE}), ${VARIANTS} variant(s) each, ${todo.length} project(s)`);
for (const slug of todo) await enhance(slug);
console.log(`Done. Review with: npm run heroes:review`);
