import { cn } from "@/lib/cn";

/**
 * Fade + rise when scrolled into view. Server-rendered markup only: the single
 * observer in MotionProvider adds `.is-visible`, and CSS does the animation.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  ...rest
}: { as?: "div" | "li"; delay?: number } & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}

/** Image unmask: a subtle clip + scale settle as the image enters the viewport. */
export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-reveal="image" className={cn(className)}>
      {children}
    </div>
  );
}
