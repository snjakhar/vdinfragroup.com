"use client";

import { useLayoutEffect, useRef } from "react";

// The first page load is static HTML and must paint immediately (LCP), so only
// client-side navigations after the first render get the fade.
let hydrated = false;

/** Short fade on route changes (used by the (site) template). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hydrated) ref.current?.classList.add("page-enter");
    // Deferred so React's dev double-run of effects doesn't count as a navigation.
    setTimeout(() => (hydrated = true), 0);
  }, []);
  return <div ref={ref}>{children}</div>;
}
