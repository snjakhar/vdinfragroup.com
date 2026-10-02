/**
 * npm run project:status -- <slug> <completed|upcoming|ready-to-move>
 *
 * Changes a project's status AND moves its media to the matching folder, so the
 * R2 layout always mirrors the status (projects/<status>/<slug>/...):
 *   1. moves the files in R2 (copy, verify size, delete old)
 *   2. moves the local folders (~/Downloads/Projects/website-media and public/media)
 *   3. updates "status" and every media path in content/projects/<slug>.json
 *
 * Note: image addresses change, so links shared to the old photo URLs stop working.
 * Afterwards: commit, push (the site rebuilds), and optionally move the original
 * photo folder in ~/Downloads/Projects to the matching status folder.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const STATUSES = ["completed", "upcoming", "ready-to-move"];
const [slug, next] = process.argv.slice(2);
if (!slug || !STATUSES.includes(next)) {
  console.error(`Usage: npm run project:status -- <slug> <${STATUSES.join("|")}>`);
  process.exit(1);
}

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const jsonPath = path.join("content/projects", `${slug}.json`);
if (!fs.existsSync(jsonPath)) throw new Error(`No project ${jsonPath}`);
const project = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const prev = project.status;
if (prev === next) {
  console.log(`${slug} is already ${next}.`);
  process.exit(0);
}
const from = `projects/${prev}/${slug}/`;
const to = `projects/${next}/${slug}/`;

// 1. R2
const bucket = process.env.R2_BUCKET || "vdinfragroup-media";
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const objects = [];
let token;
do {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: from, ContinuationToken: token }));
  objects.push(...(r.Contents ?? []));
  token = r.NextContinuationToken;
} while (token);
for (const o of objects) {
  const dest = to + o.Key.slice(from.length);
  await s3.send(new CopyObjectCommand({ Bucket: bucket, CopySource: `${bucket}/${encodeURI(o.Key)}`, Key: dest }));
  const h = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: dest }));
  if (h.ContentLength !== o.Size) throw new Error(`Copy size mismatch for ${dest}; old file kept.`);
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: o.Key }));
}
console.log(`R2: moved ${objects.length} files ${from} -> ${to}`);

// 2. Local folders
for (const root of [path.join(os.homedir(), "Downloads/Projects/website-media"), "public/media"]) {
  const a = path.join(root, from);
  const b = path.join(root, to);
  if (fs.existsSync(a)) {
    fs.mkdirSync(path.dirname(b), { recursive: true });
    fs.renameSync(a, b);
    console.log(`Local: ${a} -> ${b}`);
  }
}

// 3. Project file
const text = JSON.stringify({ ...project, status: next }, null, 2).split(`"${from}`).join(`"${to}`);
fs.writeFileSync(jsonPath, `${text}\n`);
const siteImages = "content/shared/site-images.json";
fs.writeFileSync(siteImages, fs.readFileSync(siteImages, "utf8").split(`"${from}`).join(`"${to}`));
console.log(`${jsonPath}: status ${prev} -> ${next}, media paths updated. Now commit and push.`);
