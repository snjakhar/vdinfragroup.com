import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "VD Infra Group: luxury kothis, villas and apartments in Jaipur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded fallback social image (official logo) for pages without their own photo. */
export default function OgImage() {
  const logo = `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public/brand/logo.png")).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 72, background: "#14171a", color: "#f7f4ee", padding: 90, fontFamily: "serif" }}>
        <img src={logo} width={330} height={292} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, borderLeft: "2px solid #a8824a", paddingLeft: 56 }}>
          <div style={{ fontSize: 66, lineHeight: 1.05, maxWidth: 560 }}>Where dreams rise as landmarks</div>
          <div style={{ fontSize: 24, color: "#a6a196", fontFamily: "sans-serif" }}>Luxury kothis · Villas · Apartments · Jaipur</div>
        </div>
      </div>
    ),
    size,
  );
}
