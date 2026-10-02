"use client";

import { imageUrl } from "./presets";

/** next/image loader: builds a Cloudflare Image Transformations URL for one preset width. */
export default function cloudflareLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return imageUrl(src, width);
}
