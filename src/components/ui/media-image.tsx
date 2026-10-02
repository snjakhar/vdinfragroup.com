import Image, { type ImageProps } from "next/image";
import type { MediaImage } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

/**
 * Renders a content image through next/image + the Cloudflare loader.
 * `fill` images must sit in a positioned box with a fixed aspect ratio.
 */
export function MediaImg({
  image,
  alt,
  className,
  sizes,
  priority,
  fill = true,
  ...rest
}: {
  image: MediaImage;
  alt: string;
  sizes: string;
  fill?: boolean;
} & Omit<ImageProps, "src" | "alt" | "width" | "height" | "fill" | "sizes" | "placeholder" | "blurDataURL">) {
  const blur = image.blur ? ({ placeholder: "blur", blurDataURL: image.blur } as const) : {};
  return (
    <Image
      src={image.src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      {...(fill ? { fill: true } : { width: image.width, height: image.height })}
      className={cn(!className?.includes("object-contain") && "object-cover", className)}
      {...blur}
      {...rest}
    />
  );
}
