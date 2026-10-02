declare module "*.mdx" {
  import type { ComponentType } from "react";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const meta: any;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
