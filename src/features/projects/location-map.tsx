"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Map placeholder first; the Google Maps embed loads only when the visitor
 * asks for it (keeps third-party scripts off the critical path).
 */
export function LocationMap({ lat, lng, query, label }: { lat?: number; lng?: number; query?: string; label: string }) {
  const [load, setLoad] = useState(false);
  const q = lat !== undefined && lng !== undefined ? `${lat},${lng}` : encodeURIComponent(query ?? label);
  const src = `https://www.google.com/maps?q=${q}&z=14&output=embed`;
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-map-land md:aspect-[16/10]">
      {load ? (
        <iframe title={`Map of ${label}`} src={src} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <button type="button" onClick={() => setLoad(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-4">
          <svg aria-hidden className="absolute inset-0 size-full text-map-line" preserveAspectRatio="none" viewBox="0 0 400 250">
            <path d="M0 60 Q120 40 200 90 T400 70M0 170 Q140 150 230 190 T400 160M90 0 Q110 120 70 250M300 0 Q270 130 320 250" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M0 120 H400 M180 0 V250" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="relative flex size-14 items-center justify-center rounded-full bg-ink text-ivory shadow-lg transition-transform duration-500 ease-premium group-hover:-translate-y-1">
            <MapPin className="size-6" strokeWidth={1.5} />
          </span>
          <span className="relative bg-ivory/90 px-4 py-2 text-label-md font-semibold uppercase tracking-label">Load interactive map</span>
        </button>
      )}
    </div>
  );
}
