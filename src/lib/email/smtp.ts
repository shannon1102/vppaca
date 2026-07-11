import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
};

function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function gmailCredentials() {
  const user = cleanEnv(process.env.GMAIL_USER);
  // App password may be pasted with spaces: "xxxx xxxx xxxx xxxx"
  const pass = cleanEnv(process.env.GMAIL_APP_PASSWORD).replace(/\s+/g, "");
  return { user, pass };
}

export function isGmailConfigured(): boolean {
  const { user, pass } = gmailCredentials();
  return Boolean(user && pass);
}

export async function sendViaGmail(
  input: SendMailInput,
): Promise<{ sent: boolean; reason?: string }> {
  const { user, pass } = gmailCredentials();
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

    // Gmail only allows sending as the authenticated account (or verified alias)
    const from = `${extractDisplayName(input.from, "Shop")} <${user}>`;

    await transport.sendMail({
      from,
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

function extractDisplayName(from: string, fallback: string): string {
  const m = from.match(/^(.+?)\s*<[^>]+>$/);
  if (m) return m[1].trim().replace(/^["']|["']$/g, "") || fallback;
  if (!from.includes("@")) return from.trim() || fallback;
  return fallback;
}
