/** Reusable lists referenced by ID from project and blog files. */

export const propertyTypes = {
  apartment: "Apartments",
  flat: "Flats",
  kothi: "Luxury Kothi",
  villa: "Villas",
  "builder-floor": "Builder Floors",
  plot: "Plots",
  penthouse: "Penthouses",
} as const;
export type PropertyTypeId = keyof typeof propertyTypes;

/** `icon` is a lucide icon name mapped in src/features/projects/amenity-icon.tsx. */
export const amenities = {
  pool: { name: "Swimming pool", icon: "pool", category: "lifestyle" },
  clubhouse: { name: "Clubhouse", icon: "clubhouse", category: "lifestyle" },
  gym: { name: "Gymnasium", icon: "gym", category: "lifestyle" },
  "kids-play": { name: "Kids' play area", icon: "kids", category: "lifestyle" },
  gardens: { name: "Landscaped gardens", icon: "gardens", category: "lifestyle" },
  "jogging-track": { name: "Jogging track", icon: "jogging", category: "lifestyle" },
  yoga: { name: "Yoga and meditation deck", icon: "yoga", category: "lifestyle" },
  "indoor-games": { name: "Indoor games room", icon: "games", category: "lifestyle" },
  "party-hall": { name: "Multipurpose hall", icon: "party", category: "lifestyle" },
  "senior-sitout": { name: "Senior citizens' sit-out", icon: "seating", category: "lifestyle" },
  security: { name: "24x7 gated security", icon: "security", category: "safety" },
  cctv: { name: "CCTV surveillance", icon: "cctv", category: "safety" },
  intercom: { name: "Video door phone", icon: "intercom", category: "safety" },
  "power-backup": { name: "Power backup", icon: "power", category: "convenience" },
  parking: { name: "Covered parking", icon: "parking", category: "convenience" },
  lifts: { name: "High-speed lifts", icon: "lift", category: "convenience" },
  lift: { name: "Private lift", icon: "lift", category: "convenience" },
  "home-theater": { name: "Home theater", icon: "theater", category: "lifestyle" },
  gazebo: { name: "Gazebo seating", icon: "gazebo", category: "lifestyle" },
  "party-terrace": { name: "Open-to-sky party area", icon: "terrace", category: "lifestyle" },
  "rooftop-garden": { name: "Rooftop garden", icon: "gardens", category: "lifestyle" },
  "video-door-phone": { name: "Video door phone with auto lock", icon: "video", category: "safety" },
  "fire-safety": { name: "Firefighting system", icon: "fire", category: "safety" },
  furnished: { name: "Fully furnished", icon: "sofa", category: "convenience" },
  "ev-charging": { name: "EV charging points", icon: "ev", category: "convenience" },
  "rainwater-harvesting": { name: "Rainwater harvesting", icon: "water", category: "convenience" },
} as const;
export type AmenityId = keyof typeof amenities;

export const blogCategories = {
  "buying-guides": {
    title: "Buying guides",
    description: "Practical, step-by-step advice for buying your first or next home in Jaipur.",
  },
  "jaipur-localities": {
    title: "Jaipur localities",
    description: "Neighbourhood guides covering connectivity, schools, prices and growth across Jaipur.",
  },
  "home-loans-legal": {
    title: "Home loans and legal",
    description: "RERA, documentation, stamp duty and home loan explainers in plain language.",
  },
  "design-living": {
    title: "Design and living",
    description: "Ideas for planning, furnishing and living well in your new home.",
  },
} as const;
export type BlogCategoryId = keyof typeof blogCategories;

export const authors = {
  "editorial-team": {
    name: "VD Infra Editorial Team",
    role: "Research and content",
    bio: "Our in-house team writes about Jaipur real estate using what we learn from 18 years of building and selling homes.",
  },
} as const;

