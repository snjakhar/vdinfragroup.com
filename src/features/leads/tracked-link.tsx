"use client";

import { track } from "@/lib/analytics/events";

/** External link that records a GA4 event on click. */
export function TrackedLink({
  event,
  params,
  ...rest
}: { event: string; params?: Record<string, string> } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener" {...rest} onClick={() => track(event, params)} />;
}
