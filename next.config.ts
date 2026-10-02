import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: every page becomes a plain HTML file served by Cloudflare Pages.
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: { root: process.cwd() },
  images: {
    // Images are resized by Cloudflare Image Transformations, not by Next.js.
    // These widths are the ONLY sizes the site requests (see src/lib/images/presets.ts).
    loader: "custom",
    loaderFile: "./src/lib/images/cloudflare-loader.ts",
    deviceSizes: [768, 1280, 1920, 2560],
    imageSizes: [384],
    qualities: [75],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm"]],
  },
});

export default withMDX(nextConfig);
