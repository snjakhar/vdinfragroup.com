import data from "@content/shared/site-images.json";
import type { MediaImage } from "./schema";

/** Photos used on site pages (home, about), kept in content/shared/site-images.json. */
export const siteImages = data as Record<keyof typeof data, MediaImage>;
