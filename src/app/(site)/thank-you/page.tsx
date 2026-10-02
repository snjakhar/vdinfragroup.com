import { whatsappLink } from "@content/site";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Thank you", path: "/thank-you", noIndex: true });

export default function ThankYouPage() {
  return (
    <section className="flex min-h-[80svh] items-center pb-20 pt-36">
      <div className="container-site max-w-3xl text-center">
        <p className="eyebrow">Enquiry received</p>
        <h1 className="t-h1 mt-6">Thank you. We will be in touch shortly.</h1>
        <p className="t-lead mx-auto mt-6 max-w-xl">
          A member of our sales team will call you during working hours. For anything urgent, message us on WhatsApp.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={whatsappLink()} variant="accent" target="_blank" rel="noopener">
            Chat on WhatsApp
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline" arrow>
            Keep exploring
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
