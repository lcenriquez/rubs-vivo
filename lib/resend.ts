import { Resend } from "resend";

/**
 * Server-only Resend client. RESEND_API_KEY must never be exposed to the client,
 * so only import this module from Server Components, Route Handlers, or pages/api routes.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

// Requires the antilabs.com.mx domain to be verified in the Resend dashboard.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "RUBS Vivo <rubs@antilabs.com.mx>";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    replyTo,
  });
}
