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
 *   ALLOWED_ORIGIN        e.g. https://vdinfragroup.com (optional)
 */
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

const esc = (s = "") => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  if (env.ALLOWED_ORIGIN && request.headers.get("origin") !== env.ALLOWED_ORIGIN) {
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

  const { name, phone, email, project, message } = lead.data;
  const rows: [string, string | undefined][] = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email || undefined],
    ["Project", project || "General enquiry"],
    ["Message", message || undefined],
    ["Page", meta.data.sourcePage],
    ...Object.entries(meta.data.utm ?? {}).map(([k, v]) => [k, v] as [string, string]),
    ["Received", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
  ];
  const html = `<h2 style="font-family:Georgia,serif">New website enquiry</h2><table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#6b665e">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>`;

  const send = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM_EMAIL,
      to: [env.ENQUIRY_TO_EMAIL],
      reply_to: email || undefined,
      subject: `Enquiry: ${project || "General"} (${name})`,
      html,
    }),
  });
  if (!send.ok) {
    const detail = (await send.json().catch(() => ({}))) as { name?: string; message?: string };
    console.error("email_failed", send.status, detail);
    // Only Resend's error type (e.g. "invalid_api_key"), never the message or our config.
    return json(502, { error: "email_failed", reason: detail.name ?? `status_${send.status}` });
  }

  return json(200, { ok: true });
}
