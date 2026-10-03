/**
 * Cloudflare Pages Function: POST /api/enquiry
 *
 * Validates the enquiry with the same zod schema as the form, checks
 * Cloudflare Turnstile, drops honeypot spam, then emails the lead to sales
 * through Resend. Nothing is stored.
 *
 * Environment variables (Cloudflare Pages > Settings > Variables and secrets):
 *   RESEND_API_KEY        secret
 *   ENQUIRY_TO_EMAIL      e.g. sales@vdinfragroup.com
 *   ENQUIRY_FROM_EMAIL    a sender on a domain verified in Resend, e.g. "VD Infra Website <website@vdinfragroup.com>"
 *   TURNSTILE_SECRET_KEY  secret (optional; when unset, the Turnstile check is skipped)
 *   ALLOWED_ORIGIN        comma-separated, e.g. https://vdinfragroup.com,https://www.vdinfragroup.com (optional)
 */
import { buildLeadEmail } from "../../src/features/leads/lead-email";
import { enquiryMetaSchema, enquirySchema } from "../../src/features/leads/schema";

interface Env {
  RESEND_API_KEY: string;
  ENQUIRY_TO_EMAIL: string;
  ENQUIRY_FROM_EMAIL: string;
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGIN?: string;
}

type Ctx = { request: Request; env: Env };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  const allowed = env.ALLOWED_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
  if (allowed?.length && !allowed.includes(request.headers.get("origin") ?? "")) {
    return json(403, { error: "forbidden" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const lead = enquirySchema.safeParse(body);
  const meta = enquiryMetaSchema.safeParse(body);
  if (!lead.success || !meta.success) return json(400, { error: "invalid_input" });

  // Honeypot filled: pretend success so bots learn nothing.
  if (meta.data.company) return json(200, { ok: true });

  if (env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", meta.data.turnstileToken ?? "");
    form.append("remoteip", request.headers.get("cf-connecting-ip") ?? "");
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const result = (await verify.json()) as { success: boolean; "error-codes"?: string[] };
    if (!result.success) {
      // Turnstile's codes are safe to return and tell a bad token apart from a wrong secret.
      console.error("turnstile_failed", result["error-codes"]);
      return json(400, { error: "turnstile_failed", codes: result["error-codes"] ?? [] });
    }
  }

  const { subject, html, text } = buildLeadEmail({
    ...lead.data,
    siteUrl: new URL(request.url).origin,
    sourcePage: meta.data.sourcePage,
    utm: meta.data.utm,
  });

  const send = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM_EMAIL,
      to: [env.ENQUIRY_TO_EMAIL],
      reply_to: lead.data.email || undefined,
      subject,
      html,
      text,
    }),
  });
  if (!send.ok) {
    const detail = (await send.json().catch(() => ({}))) as { name?: string; message?: string };
    console.error("email_failed", send.status, detail);
    // Only Resend's error type (e.g. "invalid_api_key"), never the message or our config.
    // 500, not 502: Cloudflare replaces 502 responses with its own HTML error page.
    return json(500, { error: "email_failed", reason: detail.name ?? `status_${send.status}` });
  }

  return json(200, { ok: true });
}
