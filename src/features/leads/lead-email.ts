import type { EnquiryInput } from "./schema";

/**
 * The email sales receives for each website enquiry (sent by functions/api/enquiry.ts).
 * Built for a phone: one-tap Call / WhatsApp / Reply, then the details, then where the
 * lead came from. Email clients only understand tables and inline styles, so this is
 * deliberately old-fashioned HTML. Runs on Cloudflare: no Node APIs, no @content imports.
 */

type Lead = Pick<EnquiryInput, "name" | "phone" | "email" | "project" | "message">;

export type LeadEmailInput = Lead & {
  siteUrl: string;
  sourcePage?: string;
  utm?: Record<string, string>;
  receivedAt?: Date;
};

const C = {
  ivory: "#f4f6f8",
  paper: "#ffffff",
  ink: "#0e1823",
  muted: "#5a6470",
  sand: "#ded9d1",
  brass: "#cca35c",
  brassDeep: "#86672e",
  night: "#0e1823",
  whatsapp: "#1f7a4d",
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** "98290 12345", "+91-9829012345" … -> "9829012345" (the schema already checked it is a valid mobile). */
const tenDigits = (phone: string) => phone.replace(/\D/g, "").slice(-10);

const UTM_LABELS: Record<string, string> = {
  utm_source: "Source",
  utm_medium: "Medium",
  utm_campaign: "Campaign",
  utm_term: "Keyword",
  utm_content: "Ad",
  gclid: "Google Ads click",
  referrer: "Came from",
};

export function buildLeadEmail(input: LeadEmailInput) {
  const { name, email, siteUrl } = input;
  const project = input.project?.trim() || "General enquiry";
  const message = input.message?.trim();
  const digits = tenDigits(input.phone);
  const phoneDisplay = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  const firstName = name.trim().split(/\s+/)[0];
  const received = (input.receivedAt ?? new Date()).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const greeting =
    project === "General enquiry"
      ? `Hello ${firstName}, thank you for contacting VD Infra Group.`
      : `Hello ${firstName}, thank you for your enquiry about ${project} with VD Infra Group.`;
  const links = {
    call: `tel:+91${digits}`,
    whatsapp: `https://wa.me/91${digits}?text=${encodeURIComponent(greeting)}`,
    reply: email ? `mailto:${email}?subject=${encodeURIComponent(`Your enquiry about ${project} | VD Infra Group`)}` : undefined,
    page: input.sourcePage ? `${siteUrl}${input.sourcePage}` : undefined,
  };

  const subject = `New enquiry: ${project} · ${name} (${phoneDisplay})`;
  const preheader = `${name} · ${phoneDisplay} · ${project}${message ? ` · “${message.slice(0, 80)}”` : ""}`;

  const source: [string, string][] = [
    ...(input.sourcePage ? [["Page", input.sourcePage] as [string, string]] : []),
    ...Object.entries(input.utm ?? {}).map(([k, v]) => [UTM_LABELS[k] ?? k, v] as [string, string]),
    ["Received", `${received} IST`],
  ];

  // One button per row: side-by-side buttons overflow narrow phone screens in some mail apps.
  const button = (href: string, label: string, bg: string, fg = "#ffffff", border = bg) =>
    `<tr><td style="padding:5px 0"><a href="${esc(href)}" style="display:block;padding:14px 18px;border-radius:999px;background:${bg};border:1px solid ${border};color:${fg};font:600 15px/1 ${SANS};text-decoration:none;text-align:center">${label}</a></td></tr>`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:10px 0;border-top:1px solid ${C.sand};width:96px;vertical-align:top;font:600 11px/1.6 ${SANS};letter-spacing:.12em;text-transform:uppercase;color:${C.muted}">${esc(label)}</td><td style="padding:10px 0;border-top:1px solid ${C.sand};font:16px/1.5 ${SANS};color:${C.ink}">${value}</td></tr>`;

  const link = (href: string, text: string) =>
    `<a href="${esc(href)}" style="color:${C.brassDeep};text-decoration:underline">${esc(text)}</a>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.ivory}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.ivory}">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.paper};border:1px solid ${C.sand};border-radius:14px;overflow:hidden">

<tr><td style="background:${C.night};padding:18px 28px">
  <span style="font:600 15px/1 ${SANS};letter-spacing:.12em;color:${C.ivory}">VD <span style="color:${C.brass}">INFRA</span></span>
  <span style="font:500 10px/1 ${SANS};letter-spacing:.3em;color:#c2b5a2;padding-left:6px">GROUP</span>
</td></tr>

<tr><td style="padding:28px 28px 8px">
  <div style="font:600 11px/1 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${C.brassDeep}">New website enquiry</div>
  <h1 style="margin:10px 0 4px;font:400 30px/1.2 ${SERIF};color:${C.ink}">${esc(name)}</h1>
  <div style="font:15px/1.5 ${SANS};color:${C.muted}">${project === "General enquiry" ? "General enquiry" : `Interested in <strong style="color:${C.ink}">${esc(project)}</strong>`} · ${esc(received)}</div>
</td></tr>

<tr><td style="padding:18px 28px 6px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${button(links.call, `Call ${esc(phoneDisplay)}`, C.ink)}
    ${button(links.whatsapp, `WhatsApp ${esc(firstName)}`, C.whatsapp)}
    ${links.reply ? button(links.reply, "Reply by email", C.paper, C.ink, C.sand) : ""}
  </table>
</td></tr>

<tr><td style="padding:16px 28px 4px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Name", esc(name))}
    ${row("Mobile", link(links.call, phoneDisplay))}
    ${email ? row("Email", link(links.reply!, email)) : ""}
    ${row("Project", esc(project))}
  </table>
</td></tr>

${
  message
    ? `<tr><td style="padding:12px 28px 4px">
  <div style="font:600 11px/1 ${SANS};letter-spacing:.12em;text-transform:uppercase;color:${C.muted};padding-bottom:8px">Message</div>
  <div style="border-left:3px solid ${C.brass};background:${C.ivory};padding:14px 16px;border-radius:0 8px 8px 0;font:16px/1.6 ${SANS};color:${C.ink};white-space:pre-wrap">${esc(message)}</div>
</td></tr>`
    : ""
}

<tr><td style="padding:22px 28px 26px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};border-radius:10px"><tr><td style="padding:14px 16px">
    <div style="font:600 11px/1 ${SANS};letter-spacing:.12em;text-transform:uppercase;color:${C.muted};padding-bottom:6px">Where this lead came from</div>
    ${source
      .map(
        ([k, v]) =>
          `<div style="font:13px/1.7 ${SANS};color:${C.muted}">${esc(k)}: <span style="color:${C.ink}">${k === "Page" && links.page ? link(links.page, v) : esc(v)}</span></div>`,
      )
      .join("")}
  </td></tr></table>
</td></tr>

<tr><td style="border-top:1px solid ${C.sand};padding:16px 28px;font:12px/1.6 ${SANS};color:${C.muted}">
  Sent by the enquiry form on ${link(siteUrl, siteUrl.replace(/^https?:\/\//, ""))}.${email ? " Replying to this email goes straight to the customer." : " The customer did not leave an email address."}
</td></tr>

</table></td></tr></table>
</body></html>`;

  const text = [
    `New website enquiry: ${project}`,
    "",
    `Name:    ${name}`,
    `Mobile:  ${phoneDisplay}`,
    ...(email ? [`Email:   ${email}`] : []),
    `Project: ${project}`,
    ...(message ? ["", "Message:", message] : []),
    "",
    `Call:     ${links.call}`,
    `WhatsApp: ${links.whatsapp}`,
    "",
    ...source.map(([k, v]) => `${k}: ${v}`),
  ].join("\n");

  return { subject, html, text };
}
