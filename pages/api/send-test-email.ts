import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/resend";

/**
 * Example route for verifying the Resend configuration.
 * POST { "to": "someone@example.com" }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to } = req.body;
  if (!to) {
    return res.status(400).json({ error: "Missing 'to' field" });
  }

  try {
    const { data, error } = await sendEmail({
      to,
      subject: "RUBS Vivo - Correo de prueba",
      html: "<p>Este es un correo de prueba enviado desde RUBS Vivo usando Resend.</p>",
    });

    if (error) {
      return res.status(502).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error sending test email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
