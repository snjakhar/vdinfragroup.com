import { site, whatsappLink } from "@content/site";
import { Header, type MenuData } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileActions } from "@/components/layout/mobile-actions";
import { MotionProvider } from "@/components/motion/motion-provider";
import { EnquiryBlock } from "@/features/leads/enquiry-block";
import { STATUS_META, STATUS_ORDER, altFor, getAllProjects, getProjectsByStatus } from "@/lib/content/projects";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo/json-ld";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const featured = getAllProjects()
    .filter((p) => p.featured)
    .slice(0, 2);
  const menu: MenuData = {
    nav: [...site.nav],
    phone: site.phone,
    phoneHref: site.phoneHref,
    categories: STATUS_ORDER.map((s) => ({
      href: `/projects/${s}`,
      label: STATUS_META[s].label,
      description: STATUS_META[s].description,
      count: getProjectsByStatus(s).length,
    })),
    featured: featured.map((p) => ({
      href: `/projects/${p.slug}`,
      title: p.title,
      locality: p.location.locality,
      status: p.statusLabel,
      image: p.media.hero,
      alt: altFor(p, p.media.hero),
    })),
  };

  return (
    <MotionProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <Header menu={menu} />
      <main id="main">{children}</main>
      <EnquiryBlock />
      <Footer />
      <MobileActions phoneHref={site.phoneHref} whatsappHref={whatsappLink()} />
    </MotionProvider>
  );
}
