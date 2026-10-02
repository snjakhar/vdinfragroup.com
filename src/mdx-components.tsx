import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

function text(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(text).join("");
  return "";
}

const components: MDXComponents = {
  h2: ({ children }) => <h2 id={slugify(text(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(text(children))}>{children}</h3>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener">
        {children}
      </a>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
