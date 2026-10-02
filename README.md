# vdinfragroup.com

Website for VD Infra Group, a real-estate developer in Jaipur.

**Stack:** Next.js (App Router, static export) · TypeScript · Tailwind CSS · Motion + Lenis · content files in Git · Cloudflare Pages · Cloudflare R2 + Image Transformations · Cloudflare Pages Function + Resend for enquiries.

There is no database and no CMS: every page is generated at build time from the files in `content/`.

## Commands

```bash
npm install
npm run dev          # local development at http://localhost:3000
npm run build        # static site in ./out
npm start            # serve ./out locally
npm run lint
npm run typecheck    # app + Cloudflare function
npm run media:sync <project-slug>   # pull photo list from R2 into the project JSON
npm run media:upload                # upload ~/Downloads/Projects/website-media/projects to R2 (new/changed files only)
npm run project:status -- <slug> <completed|upcoming|ready-to-move>   # change status + move its media folder
```

Copy `.env.example` to `.env.local` for local settings. The enquiry form posts to `/api/enquiry`, which only exists on Cloudflare (`functions/api/enquiry.ts`); locally it shows a friendly error.

## Where things live

```
content/
  projects/<slug>.json   one file per project (validated at build; a typo fails the build with a clear message)
  blog/<slug>.mdx        one file per post; metadata in `export const meta`
  pages/                 privacy policy, terms
  shared/                locations, amenities, property types, blog categories, testimonials, site photos
  site.ts                company details, phone, WhatsApp, Instagram, menus
  seo.ts                 default SEO
functions/api/enquiry.ts Cloudflare Pages Function: validate, Turnstile, email via Resend
scripts/media-sync.ts    R2 folder -> project JSON media list
src/
  app/                   routes
  features/              projects, blog, leads (enquiry block)
  components/            ui (design system), layout, motion
  lib/                   content loaders, image presets + loader, SEO helpers, analytics
  styles/                tokens.css (palette, fonts, easing), globals.css
docs/cloudflare-setup.md one-time hosting setup, including the image WAF rule
```

## Logo

The logo comes from the official Illustrator file (`VD Infra.ai`). Its vector paths are in `src/components/ui/logo-paths.tsx` (used by the `Logo` component); `public/brand/` holds `logo.svg`, `logo-mark.svg`, `logo.png` (schema markup), `favicon.svg` and `apple-touch-icon.png`. Brand gold is `#b6a37b`.

## Common tasks

**Add a project**
1. Copy an existing file in `content/projects/`, rename it to the new slug, and edit it. `status` is `completed`, `upcoming` or `ready-to-move`; changing it moves the project between categories and keeps its URL.
2. Upload photos to R2 under `projects/<status>/<slug>/photos/` (prefix files `01-`, `02-` … for order), floor plans under `floor-plans/` named after the plan title (`3-bhk.jpg`), and `brochure.pdf`.
3. Run `npm run media:sync <slug>`, then write alt text for any new images in the JSON.
4. Commit and push. Cloudflare rebuilds the site in a minute or two.

**Add a blog post:** add `content/blog/<slug>.mdx` with an `export const meta = { … }` block (copy an existing post). Use `## ` headings; the table of contents is built from them.

**Rename a URL:** add a line to `public/_redirects`.

## Images

**Local preview of real photos.** The organised photos live in `~/Downloads/Projects/website-media/projects/` (resized to 3,000 px, location data stripped, plus compressed brochures and floor-plan images). Copy that `projects/` folder to `public/media/projects/` (git-ignored) and set `NEXT_PUBLIC_MEDIA_BASE_URL=/media` in `.env.local`; images are then served locally without Cloudflare resizing.

**Going live.** Upload the same `projects/` folder with `npm run media:upload` (keys like `projects/ready-to-move/sky-elegant/photos/01-exterior.jpg`, organised by status) and set `NEXT_PUBLIC_MEDIA_BASE_URL=https://media.vdinfragroup.com` in Cloudflare Pages.

All content images go through `next/image` with a custom loader (`src/lib/images/cloudflare-loader.ts`) that only ever requests five preset widths (384, 768, 1280, 1920, 2560) via Cloudflare Image Transformations. Do not add widths without updating the WAF rule in `docs/cloudflare-setup.md`.

Until real photos are uploaded, projects use placeholder photos from Unsplash.

## Content status

Projects (23) are real, built from the company's folders, flyers and brochures. Still to confirm or replace before launch: WhatsApp number, Instagram URL and office address in `content/site.ts`; Krishnam Kothi 27's locality; blog posts (sample articles with stock photos); and the privacy policy and terms (need legal review).
