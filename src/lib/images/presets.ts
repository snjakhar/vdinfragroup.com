/**
 * The only image variants the site ever requests.
 *
 * Every distinct width/quality/format combination is a separate billable
 * Cloudflare Image Transformation, so the list is deliberately short. The
 * Cloudflare WAF rule in docs/cloudflare-setup.md blocks any other options.
 * If you change these values, update that rule and next.config.ts too.
 */
export const IMAGE_WIDTHS = [384, 768, 1280, 1920, 2560] as const;
export const IMAGE_QUALITY = 75;

/** 1200x630 crop used for Open Graph / social previews (one per project). */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const MEDIA_BASE_URL = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "https://media.vdinfragroup.com"
).replace(/\/$/, "");

/** Round a requested width up to the nearest preset, so no off-list size is ever requested. */
export function snapWidth(width: number): number {
  return IMAGE_WIDTHS.find((w) => w >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
}

/** Placeholder photos used until the real project photos are uploaded to R2. */
function isPlaceholder(src: string) {
  return src.startsWith("https://images.unsplash.com/");
}

/** Local preview: media served from /public/media (no Cloudflare resizing). */
const LOCAL_MEDIA = MEDIA_BASE_URL.startsWith("/");

/** URL of one preset variant of an image stored in R2 (or a placeholder). */
export function imageUrl(src: string, width: number): string {
  const w = snapWidth(width);
  if (src.startsWith("/")) return src; // local brand assets in /public
  // Stock photos (blog) are full web addresses: never route them through local or R2 media.
  if (isPlaceholder(src)) return `${src}?w=${w}&q=${IMAGE_QUALITY}&auto=format&fit=max`;
  if (LOCAL_MEDIA) return `${MEDIA_BASE_URL}/${src}`;
  return `${MEDIA_BASE_URL}/cdn-cgi/image/width=${w},quality=${IMAGE_QUALITY},format=auto/${src}`;
}

/** Absolute URL of the 1200x630 social preview crop of an image. */
export function ogImageUrl(src: string): string {
  if (isPlaceholder(src)) {
    return `${src}?w=${OG_WIDTH}&h=${OG_HEIGHT}&q=${IMAGE_QUALITY}&fit=crop&fm=jpg`;
  }
  if (LOCAL_MEDIA) return `${MEDIA_BASE_URL}/${src}`;
  return `${MEDIA_BASE_URL}/cdn-cgi/image/width=${OG_WIDTH},height=${OG_HEIGHT},fit=cover,quality=${IMAGE_QUALITY},format=jpeg/${src}`;
}
