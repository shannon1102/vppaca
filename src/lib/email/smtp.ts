import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
};

export function isGmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendViaGmail(
  input: SendMailInput,
): Promise<{ sent: boolean; reason?: string }> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return { sent: false, reason: "missing_gmail_credentials" };
  }

  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    await transport.sendMail({
      from: input.from.includes("<") ? input.from : `${input.from} <${user}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    return { sent: true };
  } catch (e) {
    console.error("[email] Gmail SMTP error", e);
    return {
      sent: false,
      reason: e instanceof Error ? e.message : "gmail_send_failed",
    };
  }
}
