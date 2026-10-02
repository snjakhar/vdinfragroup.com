"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics/events";
import { cn } from "@/lib/cn";
import { enquirySchema, type EnquiryInput } from "./schema";
import { Turnstile } from "./turnstile";

const ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "/api/enquiry";

function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
    const v = params.get(key);
    if (v) utm[key] = v;
  }
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) utm.referrer = document.referrer.slice(0, 200);
  return utm;
}

const field =
  "peer w-full border-0 border-b border-sand bg-transparent px-0 pb-2.5 pt-6 text-base text-ink placeholder-transparent transition-colors focus:border-ink focus:outline-none focus:ring-0";
const label =
  "pointer-events-none absolute left-0 top-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted";

export function EnquiryForm({ projects }: { projects: { slug: string; title: string }[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [token, setToken] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [company, setCompany] = useState("");

  const currentProject = pathname.match(/^\/projects\/([^/]+)$/)?.[1];
  const defaultProject = projects.find((p) => p.slug === currentProject)?.title ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { project: defaultProject, email: "", message: "" },
  });

  useEffect(() => setValue("project", defaultProject), [defaultProject, setValue]);
  const onToken = useCallback((t: string) => setToken(t), []);

  const onSubmit = async (data: EnquiryInput) => {
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, sourcePage: pathname, utm: readUtm(), turnstileToken: token, company }),
      });
      if (!res.ok) throw new Error(await res.text());
      track("generate_lead", { project: data.project || "general", page: pathname });
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={() => setStarted(true)} noValidate className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="relative">
        <input id="enq-name" placeholder="Name" autoComplete="name" className={field} {...register("name")} />
        <label htmlFor="enq-name" className={label}>
          Name *
        </label>
        {errors.name && <p className="mt-1.5 text-xs text-[#a3412b]">{errors.name.message}</p>}
      </div>
      <div className="relative">
        <input id="enq-phone" type="tel" inputMode="tel" placeholder="Phone" autoComplete="tel" className={field} {...register("phone")} />
        <label htmlFor="enq-phone" className={label}>
          Mobile number *
        </label>
        {errors.phone && <p className="mt-1.5 text-xs text-[#a3412b]">{errors.phone.message}</p>}
      </div>
      <div className="relative">
        <input id="enq-email" type="email" placeholder="Email" autoComplete="email" className={field} {...register("email")} />
        <label htmlFor="enq-email" className={label}>
          Email (optional)
        </label>
        {errors.email && <p className="mt-1.5 text-xs text-[#a3412b]">{errors.email.message}</p>}
      </div>
      <div className="relative">
        <select id="enq-project" className={cn(field, "appearance-none")} {...register("project")}>
          <option value="">General enquiry</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.title}>
              {p.title}
            </option>
          ))}
        </select>
        <label htmlFor="enq-project" className={label}>
          Interested in
        </label>
      </div>
      <div className="relative sm:col-span-2">
        <textarea id="enq-message" rows={2} placeholder="Message" className={cn(field, "resize-none")} {...register("message")} />
        <label htmlFor="enq-message" className={label}>
          Message (optional)
        </label>
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1 size-4 accent-[var(--color-brass)]" {...register("consent")} />
          <span>
            I agree to be contacted by VD Infra Group about my enquiry by phone, WhatsApp or email, as described in the{" "}
            <a href="/privacy-policy" className="underline underline-offset-2">
              privacy policy
            </a>
            .
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-xs text-[#a3412b]">{errors.consent.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <Turnstile active={started} onToken={onToken} />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" arrow disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? "Sending" : "Send enquiry"}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-[#a3412b]">
          {status === "error" && "Something went wrong. Please call or WhatsApp us instead."}
        </p>
      </div>
    </form>
  );
}
