/**
 * Resident reviews for the home page. Add only real reviews, with the
 * resident's permission (for example copied from Google reviews).
 * While this list is empty the section is hidden on the live site; in
 * development it shows marked samples so the layout can be checked.
 */
export type Review = { quote: string; name: string; project?: string };

export const reviews: Review[] = [];
