# Cloudflare setup

One-time setup for hosting vdinfragroup.com on Cloudflare. Everything here is done in the Cloudflare dashboard.

> Prices, free allowances and plan limits change. Check Cloudflare's current pricing pages before relying on any number here.

## 1. DNS

Add `vdinfragroup.com` to Cloudflare and point the registrar's nameservers to Cloudflare.

## 2. Cloudflare Pages (the website)

1. Workers & Pages → Create → Pages → Connect to Git → select this repository.
2. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variable `NODE_VERSION` = `22`
3. Custom domains: add `vdinfragroup.com` and `www.vdinfragroup.com` (redirect www to the apex with a Redirect Rule).
4. Environment variables (Settings → Variables and secrets), for **Production** and **Preview**:

   | Name | Type | Example |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | text | `https://vdinfragroup.com` |
   | `NEXT_PUBLIC_MEDIA_BASE_URL` | text | `https://media.vdinfragroup.com` |
   | `NEXT_PUBLIC_GA_ID` | text | `G-XXXXXXX` |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | text | from step 5 |
   | `RESEND_API_KEY` | secret | from step 6 |
   | `ENQUIRY_TO_EMAIL` | text | `sales@vdinfragroup.com` |
   | `ENQUIRY_FROM_EMAIL` | text | `VD Infra Website <website@vdinfragroup.com>` |
   | `TURNSTILE_SECRET_KEY` | secret | from step 5 |
   | `ALLOWED_ORIGIN` | text | `https://vdinfragroup.com,https://www.vdinfragroup.com` (comma-separated) |

`functions/api/enquiry.ts` is deployed automatically as the `/api/enquiry` Pages Function. `public/_headers` and `public/_redirects` are applied automatically.

**Deploy hook:** Settings → Builds → Deploy hooks → create one named "Rebuild". Bookmark the URL; calling it (`curl -X POST <url>`) rebuilds the site without a code change.

## 3. R2 (project photos)

1. R2 → Create bucket `vdinfragroup-media`.
2. Bucket → Settings → Custom domains → connect `media.vdinfragroup.com` (must be in the same Cloudflare zone).
3. Folder layout:

   ```
   projects/<status>/<project-slug>/photos/01-facade.jpg      (status: completed | upcoming | ready-to-move)
   projects/<status>/<project-slug>/floor-plans/3-bhk.jpg
   projects/<status>/<project-slug>/brochure.pdf
   ```

   Upload with `npm run media:upload` (only new or changed files are sent). When a project's status changes, run `npm run project:status -- <slug> <new-status>`: it moves the files in R2 and updates the project file.

4. Bucket → Settings → CORS policy → add (needed by the gallery's Share and Download buttons, which fetch the full-size photo):

   ```json
   [{ "AllowedOrigins": ["https://www.vdinfragroup.com", "https://vdinfragroup.com"], "AllowedMethods": ["GET"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 86400 }]
   ```

5. R2 → Manage R2 API tokens → create a token with **Object Read** on this bucket only. Put the values in `.env.local` as `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` (used only by `npm run media:sync`, never by the website).

Upload photos at full resolution (JPEG, long edge about 2,500 to 3,000 px). Use the dashboard for a few files, or a desktop tool such as Cyberduck or rclone for whole folders.

## 4. Image Transformations

1. Images → Transformations → enable for the `vdinfragroup.com` zone.
2. Turn **off** "Resize images from any origin", so only our own images can be transformed.

The site only ever requests these variants (see `src/lib/images/presets.ts`):

| Variant | Path prefix |
| --- | --- |
| 384 | `/cdn-cgi/image/width=384,quality=75,format=auto/` |
| 768 | `/cdn-cgi/image/width=768,quality=75,format=auto/` |
| 1280 | `/cdn-cgi/image/width=1280,quality=75,format=auto/` |
| 1920 | `/cdn-cgi/image/width=1920,quality=75,format=auto/` |
| 2560 (heroes) | `/cdn-cgi/image/width=2560,quality=75,format=auto/` |
| Social preview | `/cdn-cgi/image/width=1200,height=630,fit=cover,quality=75,format=jpeg/` |

## 5. WAF rule: block every other image size

Each distinct transformation is billable, and anyone could request `/cdn-cgi/image/width=1234/...` with random sizes. This rule blocks every option set except the presets above.

Security → WAF → Custom rules → Create rule → "Block non-preset image transformations" → Edit expression:

```
(http.host eq "media.vdinfragroup.com"
 and starts_with(http.request.uri.path, "/cdn-cgi/image/")
 and not starts_with(http.request.uri.path, "/cdn-cgi/image/width=384,quality=75,format=auto/")
 and not starts_with(http.request.uri.path, "/cdn-cgi/image/width=768,quality=75,format=auto/")
 and not starts_with(http.request.uri.path, "/cdn-cgi/image/width=1280,quality=75,format=auto/")
 and not starts_with(http.request.uri.path, "/cdn-cgi/image/width=1920,quality=75,format=auto/")
 and not starts_with(http.request.uri.path, "/cdn-cgi/image/width=2560,quality=75,format=auto/")
 and not starts_with(http.request.uri.path, "/cdn-cgi/image/width=1200,height=630,fit=cover,quality=75,format=jpeg/"))
```

Action: **Block**. After saving, test that a preset URL loads and that `width=1000` returns 403. If the rule cannot be created on your plan, the fallback is a small Worker on `media.vdinfragroup.com/img/*` that allows only these widths.

If you change the presets in code, update this rule in the same release.

## 6. Turnstile and Resend

- **Turnstile:** Turnstile → Add site → domain `vdinfragroup.com` → copy the site key (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and secret (`TURNSTILE_SECRET_KEY`).
- **Resend:** create an account, verify the `vdinfragroup.com` domain (DNS records in Cloudflare), create an API key (`RESEND_API_KEY`).

## 7. Analytics and search

- Cloudflare Web Analytics: Pages project → Metrics → enable Web Analytics (no code needed).
- Google Analytics 4: set `NEXT_PUBLIC_GA_ID`.
- Google Search Console: verify the domain with a DNS TXT record, then submit `https://vdinfragroup.com/sitemap.xml`.
