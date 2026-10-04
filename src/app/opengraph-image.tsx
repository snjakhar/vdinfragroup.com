import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "VD Infra Group: luxury kothis, villas and apartments in Jaipur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded fallback social image (brand logo) for pages without their own photo. */
export default function OgImage() {
  const logo = `data:image/svg+xml;base64,${fs.readFileSync(path.join(process.cwd(), "public/brand/logo-mark.svg")).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 72, background: "#0e1823", color: "#f4f6f8", padding: 90, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <img src={logo} width={300} height={214} alt="" />
          <div style={{ display: "flex", fontSize: 52, fontWeight: 600, letterSpacing: 2, fontFamily: "sans-serif" }}>
            <span>VD</span>
            <span style={{ color: "#cca35c", marginLeft: 16 }}>INFRA</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, letterSpacing: 10, fontFamily: "sans-serif" }}>
            <div style={{ width: 60, height: 2, background: "#cca35c" }} />
            GROUP
            <div style={{ width: 60, height: 2, background: "#cca35c" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, borderLeft: "2px solid #cca35c", paddingLeft: 56 }}>
          <div style={{ fontSize: 66, lineHeight: 1.05, maxWidth: 560 }}>Where dreams rise as landmarks</div>
          <div style={{ fontSize: 24, color: "#c2b5a2", fontFamily: "sans-serif" }}>Luxury kothis · Villas · Apartments · Jaipur</div>
        </div>
      </div>
    ),
    size,
  );
}
