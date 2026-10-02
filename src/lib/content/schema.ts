import { z } from "zod";

export const PROJECT_STATUSES = ["completed", "upcoming", "ready-to-move"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** One image: an R2 object key (or a placeholder URL) plus what the page needs to render it. */
export const imageSchema = z.object({
  src: z.string().min(1),
  /** Optional: falls back to "<project name>, <locality>, Jaipur". */
  alt: z.string().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Tiny base64 data URL written by `npm run media:sync`. */
  blur: z.string().optional(),
  caption: z.string().optional(),
  /** AI-enhanced or rendered image of the real building: shown with an "Artist's impression" label. */
  impression: z.boolean().optional(),
});
export type MediaImage = z.infer<typeof imageSchema>;

const seoSchema = z
  .object({
    title: z.string().max(70).optional(),
    description: z.string().max(170).optional(),
    noIndex: z.boolean().optional(),
  })
  .optional();

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and hyphens"),
  title: z.string(),
  status: z.enum(PROJECT_STATUSES),
  featured: z.boolean().default(false),
  /** Lower numbers are listed first. */
  order: z.number().default(100),
  tagline: z.string(),
  location: z.object({
    locality: z.string(),
    city: z.string().default("Jaipur"),
    address: z.string(),
    /** Optional: without coordinates the map searches by address. */
    lat: z.number().optional(),
    lng: z.number().optional(),
    nearby: z.array(z.object({ name: z.string(), distance: z.string().optional() })).default([]),
  }),
  propertyTypes: z.array(z.string()).min(1),
  summary: z.string(),
  description: z.array(z.string()).min(1),
  highlights: z.array(z.string()).default([]),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  media: z.object({
    hero: imageSchema,
    /** Optional square version of the hero, used by the home page split hero. */
    heroSquare: imageSchema.optional(),
    gallery: z.array(imageSchema).default([]),
    floorPlans: z
      .array(
        z.object({
          title: z.string(),
          configuration: z.string(),
          area: z.string(),
          image: imageSchema.optional(),
        }),
      )
      .default([]),
    /** R2 key of the brochure PDF, e.g. "projects/vd-greens/brochure.pdf". */
    brochure: z.string().optional(),
    videoUrl: z.string().url().optional(),
  }),
  amenities: z.array(z.string()).default([]),
  configurations: z
    .array(
      z.object({
        type: z.string(),
        carpetArea: z.string().optional(),
        superArea: z.string().optional(),
        price: z.string(),
        availability: z.string().optional(),
      }),
    )
    .default([]),
  specifications: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).default([]),
  rera: z.string().optional(),
  possession: z.string().optional(),
  completedYear: z.number().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  seo: seoSchema,
});
export type Project = z.infer<typeof projectSchema>;

export const blogMetaSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  featured: z.boolean().default(false),
  image: imageSchema,
  relatedPosts: z.array(z.string()).default([]),
  relatedProjects: z.array(z.string()).default([]),
  seo: seoSchema,
});
export type BlogMeta = z.infer<typeof blogMetaSchema>;
export type BlogPost = BlogMeta & { slug: string; readingMinutes: number };
