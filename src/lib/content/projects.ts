import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { amenities as amenityCatalog, propertyTypes, type AmenityId, type PropertyTypeId } from "@content/shared/catalog";
import { projectSchema, type MediaImage, type Project, type ProjectStatus } from "./schema";

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

export const STATUS_META: Record<ProjectStatus, { label: string; slug: ProjectStatus; title: string; description: string }> = {
  completed: {
    slug: "completed",
    label: "Completed",
    title: "Completed projects",
    description: "Luxury kothis, villas and apartment communities we have delivered across Jaipur.",
  },
  "ready-to-move": {
    slug: "ready-to-move",
    label: "Ready to move",
    title: "Ready-to-move homes",
    description: "Finished homes with the occupancy certificate in hand. Visit, choose and move in.",
  },
  upcoming: {
    slug: "upcoming",
    label: "Upcoming",
    title: "Upcoming projects",
    description: "Homes under construction in Jaipur. Register your interest early for plans, pricing and possession details.",
  },
};
export const STATUS_ORDER: ProjectStatus[] = ["ready-to-move", "upcoming", "completed"];

export type ProjectView = Project & {
  propertyTypeLabels: string[];
  amenityList: { id: AmenityId; name: string; icon: string; category: string }[];
  statusLabel: string;
};

function enrich(p: Project): ProjectView {
  for (const t of p.propertyTypes) {
    if (!(t in propertyTypes)) throw new Error(`Project "${p.slug}": unknown property type "${t}"`);
  }
  const amenityList = p.amenities.map((id) => {
    const a = amenityCatalog[id as AmenityId];
    if (!a) throw new Error(`Project "${p.slug}": unknown amenity "${id}"`);
    return { id: id as AmenityId, ...a };
  });
  return {
    ...p,
    propertyTypeLabels: p.propertyTypes.map((t) => propertyTypes[t as PropertyTypeId]),
    amenityList,
    statusLabel: STATUS_META[p.status].label,
  };
}

/** All projects, validated at build time. An invalid JSON file fails the build with a clear message. */
export const getAllProjects = cache((): ProjectView[] => {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8"));
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid project file content/projects/${file}:\n${parsed.error.message}`);
    }
    if (`${parsed.data.slug}.json` !== file) {
      throw new Error(`content/projects/${file}: slug "${parsed.data.slug}" must match the file name`);
    }
    return enrich(parsed.data);
  });
  return projects.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
});

export function getProject(slug: string) {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getProjectsByStatus(status: ProjectStatus) {
  return getAllProjects().filter((p) => p.status === status);
}

export function getFeaturedProjects() {
  return getAllProjects().filter((p) => p.featured);
}

export function getRelatedProjects(project: ProjectView, limit = 3) {
  const others = getAllProjects().filter((p) => p.slug !== project.slug);
  const score = (p: ProjectView) =>
    (p.status === project.status ? 2 : 0) +
    (p.location.locality === project.location.locality ? 1 : 0) +
    (p.propertyTypes.some((t) => project.propertyTypes.includes(t)) ? 1 : 0);
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Lowest listed price, e.g. "₹65 L onwards" (undefined when no project price is published). */
export function startingPrice(p: Pick<Project, "configurations">) {
  const prices = p.configurations
    .map((c) => c.price.match(/₹\s*([\d.]+)\s*(L|Cr)/i))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({ text: `₹${m[1]} ${m[2]}`, value: parseFloat(m[1]) * (m[2].toLowerCase() === "cr" ? 100 : 1) }));
  if (!prices.length) return undefined;
  return `${prices.sort((a, b) => a.value - b.value)[0].text} onwards`;
}

/** "Narayan Vihar, Ajmer Road, Jaipur", or just "Jaipur" when the locality is the city itself. */
export function placeName(p: Pick<Project, "location">) {
  const { locality, city } = p.location;
  return locality === city ? city : `${locality}, ${city}`;
}

/**
 * Front image for portrait or square frames (cards, tiles): the square version when
 * one exists, so wide 16:9 images are not cropped down to the middle of the building.
 */
export function cardImage(p: Pick<Project, "media">) {
  return p.media.heroSquare ?? p.media.hero;
}

/** Alt text with the fallback described in the plan: "<project>, <locality>, Jaipur". */
export function altFor(project: Pick<ProjectView, "title" | "location">, image: MediaImage) {
  return image.alt ?? `${project.title}, ${placeName(project)}`;
}
