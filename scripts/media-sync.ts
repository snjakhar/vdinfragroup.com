/**
 * npm run media:sync <project-slug> [--prune]
 *
 * Reads the project's R2 folder ONCE and updates content/projects/<slug>.json:
 *   - new files in photos/ are appended to media.gallery (sorted by file name)
 *   - width, height and a tiny blur placeholder are recorded for every image
 *   - existing order, hero choice and alt text are kept untouched
 *   - floor-plans/<plan>.jpg is attached to the floor plan whose title matches (e.g. "3-bhk.jpg" -> "3 BHK")
 *   - brochure.pdf becomes media.brochure
 *   - placeholder photos are removed once real photos exist
 *   - images listed in the JSON but missing from R2 are reported (and removed with --prune)
 *
 * The website build never talks to R2; only this script does. Needs R2_* vars in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { projectSchema, type MediaImage } from "../src/lib/content/schema";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const PLACEHOLDER = "https://images.unsplash.com/";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Add it to .env.local (see .env.example).`);
  return v;
}

const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  loadEnv();
  const [slug, ...flags] = process.argv.slice(2);
  if (!slug) throw new Error("Usage: npm run media:sync <project-slug> [--prune]");
  const prune = flags.includes("--prune");

  const file = path.join("content/projects", `${slug}.json`);
  if (!fs.existsSync(file)) throw new Error(`No project file at ${file}`);
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));

  const bucket = need("R2_BUCKET");
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${need("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: need("R2_ACCESS_KEY_ID"), secretAccessKey: need("R2_SECRET_ACCESS_KEY") },
  });

  // R2 layout: projects/<status>/<slug>/...
  const prefix = `projects/${raw.status}/${slug}/`;
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }));
    for (const o of page.Contents ?? []) if (o.Key && !o.Key.endsWith("/")) keys.push(o.Key);
    token = page.NextContinuationToken;
  } while (token);
  keys.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  console.log(`Found ${keys.length} files under ${prefix}`);

  async function describe(key: string, existing?: MediaImage): Promise<MediaImage> {
    const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const buf = Buffer.from(await obj.Body!.transformToByteArray());
    const meta = await sharp(buf).rotate().metadata();
    const tiny = await sharp(buf).rotate().resize(16).webp({ quality: 40 }).toBuffer();
    return {
      ...existing,
      src: key,
      width: meta.autoOrient?.width ?? meta.width ?? 2400,
      height: meta.autoOrient?.height ?? meta.height ?? 1600,
      blur: `data:image/webp;base64,${tiny.toString("base64")}`,
    };
  }

  const photoKeys = keys.filter((k) => k.startsWith(`${prefix}photos/`) && IMAGE_EXT.test(k));
  const planKeys = keys.filter((k) => k.startsWith(`${prefix}floor-plans/`) && IMAGE_EXT.test(k));
  const keySet = new Set(keys);

  const media = raw.media ?? {};
  let gallery: MediaImage[] = media.gallery ?? [];
  const hasRealPhotos = photoKeys.length > 0;

  if (hasRealPhotos) {
    const before = gallery.length;
    gallery = gallery.filter((g) => !g.src.startsWith(PLACEHOLDER));
    if (gallery.length !== before) console.log(`Removed ${before - gallery.length} placeholder photos`);
  }

  // Report (and optionally prune) listed images that are no longer in R2.
  const missing = gallery.filter((g) => !g.src.startsWith(PLACEHOLDER) && !keySet.has(g.src));
  for (const m of missing) console.warn(`  ! Listed but missing in R2: ${m.src}`);
  if (prune) gallery = gallery.filter((g) => !missing.includes(g));

  // Refresh existing entries (keep order + alt), append new ones.
  const listed = new Set(gallery.map((g) => g.src));
  gallery = await Promise.all(gallery.map((g) => (keySet.has(g.src) ? describe(g.src, g) : g)));
  for (const key of photoKeys) {
    if (listed.has(key)) continue;
    gallery.push(await describe(key));
    console.log(`  + ${key} (add alt text in ${file})`);
  }

  let hero: MediaImage | undefined = media.hero;
  if (!hero || hero.src.startsWith(PLACEHOLDER)) {
    if (gallery[0]) {
      hero = { ...gallery[0], alt: hero?.alt };
      gallery = gallery.slice(1);
      console.log(`Hero set to ${hero.src} (change it in the JSON if needed)`);
    }
  } else if (keySet.has(hero.src)) {
    hero = await describe(hero.src, hero);
  }

  const floorPlans = await Promise.all(
    (media.floorPlans ?? []).map(async (plan: { title: string; image?: MediaImage }) => {
      const match = planKeys.find((k) => slugOf(path.basename(k).replace(IMAGE_EXT, "")) === slugOf(plan.title));
      return match ? { ...plan, image: await describe(match, plan.image) } : plan;
    }),
  );
  for (const k of planKeys) {
    if (!floorPlans.some((p: { image?: MediaImage }) => p.image?.src === k)) {
      console.warn(`  ? Floor plan ${k} matches no plan title; rename it after a title (e.g. 3-bhk.jpg)`);
    }
  }

  const brochure = keySet.has(`${prefix}brochure.pdf`) ? `${prefix}brochure.pdf` : media.brochure;

  const next = { ...raw, media: { ...media, hero, gallery, floorPlans, ...(brochure && { brochure }) } };
  const check = projectSchema.safeParse(next);
  if (!check.success) throw new Error(`Result failed validation:\n${check.error.message}`);
  fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Updated ${file}: hero + ${gallery.length} gallery images, ${floorPlans.length} floor plans${brochure ? ", brochure" : ""}.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
