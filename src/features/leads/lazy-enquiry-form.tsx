"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// The form (react-hook-form + zod + Turnstile) is the heaviest JavaScript on the
// site, so it loads only when the visitor scrolls near it.
const EnquiryForm = dynamic(() => import("./enquiry-form").then((m) => m.EnquiryForm), { ssr: false });

function Placeholder() {
  return (
    <div aria-hidden className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[3.6rem] border-b border-sand" />
      ))}
      <div className="h-[5.1rem] border-b border-sand sm:col-span-2" />
      <div className="h-10 sm:col-span-2" />
      <div className="h-[3.25rem] w-48 bg-ink/10" />
    </div>
  );
}

export function LazyEnquiryForm({ projects }: { projects: { slug: string; title: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{show ? <EnquiryForm projects={projects} /> : <Placeholder />}</div>;
}
