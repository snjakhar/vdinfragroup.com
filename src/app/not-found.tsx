import Link from "next/link";
import { Logo } from "@/components/ui/icons";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-ivory px-5 text-center">
      <Link href="/" className="mb-16 h-11">
        <Logo className="h-full" />
      </Link>
      <p className="eyebrow">Error 404</p>
      <h1 className="t-h1 mt-6">This page has moved or no longer exists</h1>
      <p className="t-lead mt-6 max-w-lg">Try our projects, or head back to the home page.</p>
      <div className="mt-10 flex gap-6 text-label-md font-semibold uppercase tracking-label">
        <Link href="/projects" className="border-b border-ink pb-1 hover:text-brass-deep">
          View projects
        </Link>
        <Link href="/" className="border-b border-ink pb-1 hover:text-brass-deep">
          Home
        </Link>
      </div>
    </main>
  );
}
