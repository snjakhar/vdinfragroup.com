/**
 * npm run media:upload [-- --dry-run]
 *
 * Uploads the website-ready photos, floor plans and brochures from
 * ~/Downloads/Projects/website-media/projects/ to the R2 bucket, keeping the
 * same paths (projects/<status>/<slug>/photos/01-exterior.jpg ...), which is exactly
 * what the website requests. Files already in R2 with the same size are skipped,
 * so it is safe to run again after adding photos.
 *
 * Needs in .env.local: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const SOURCE = path.join(os.homedir(), "Downloads/Projects/website-media");
const DRY = process.argv.includes("--dry-run");
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf" };

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

// Only the folders the website uses (skip ai-heroes review drafts and the manifest).
const files = walk(path.join(SOURCE, "projects")).filter((f) => TYPES[path.extname(f).toLowerCase()]);
const total = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`${files.length} files, ${(total / 1048576).toFixed(1)} MB from ${SOURCE}/projects`);

if (DRY) {
  for (const f of files.slice(0, 8)) console.log("  would upload", path.relative(SOURCE, f));
  console.log("  ...dry run, nothing uploaded.");
  process.exit(0);
}

const need = (n) => {
  if (!process.env[n]) {
    console.error(`Missing ${n} in .env.local (see docs/cloudflare-setup.md, step 3).`);
    process.exit(1);
  }
  return process.env[n];
};
const bucket = process.env.R2_BUCKET || "vdinfragroup-media";
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${need("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: need("R2_ACCESS_KEY_ID"), secretAccessKey: need("R2_SECRET_ACCESS_KEY") },
});

let uploaded = 0;
let skipped = 0;
for (const [i, file] of files.entries()) {
  const key = path.relative(SOURCE, file).split(path.sep).join("/");
  const size = fs.statSync(file).size;
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    if (head.ContentLength === size) {
      skipped++;
      continue;
    }
  } catch {
    // not in R2 yet
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fs.readFileSync(file),
      ContentType: TYPES[path.extname(file).toLowerCase()],
      CacheControl: "public, max-age=2592000",
    }),
  );
  uploaded++;
  if (uploaded % 20 === 0) console.log(`  ${i + 1}/${files.length} ...`);
}
console.log(`Done: ${uploaded} uploaded, ${skipped} already up to date (bucket ${bucket}).`);
