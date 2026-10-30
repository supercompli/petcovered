import nodemailer, { type Transporter } from 'nodemailer';

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string | { name: string; address: string };
  notifyTo: string;
}

export interface OutgoingMail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Thrown when required SMTP_* variables are absent, so callers can tell it apart from a delivery failure. */
export class MailConfigError extends Error {
  constructor(public missing: string[]) {
    super(`Missing environment variables: ${missing.join(', ')}`);
  }
}

export function getMailConfig(env: NodeJS.ProcessEnv = process.env): MailConfig {
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SMTP_TO'].filter(key => !env[key]);
  if (missing.length) throw new MailConfigError(missing);

  const port = Number(env.SMTP_PORT) || 587;
  const fromAddress = env.SMTP_FROM!;

  return {
    host: env.SMTP_HOST!,
    port,
    // Implicit TLS on 465; STARTTLS (enforced below) on 587/25.
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
    user: env.SMTP_USER!,
    pass: env.SMTP_PASS!,
    // SMTP_FROM may already be a full "Name <address>" string; otherwise pair it with SMTP_FROM_NAME.
    from: fromAddress.includes('<')
      ? fromAddress
      : { name: env.SMTP_FROM_NAME || 'Petcovered', address: fromAddress },
    notifyTo: env.SMTP_TO!,
  };
}

let cached: { key: string; transport: Transporter } | null = null;

function getTransport(config: MailConfig): Transporter {
  const key = `${config.host}:${config.port}:${config.user}`;
  if (cached?.key !== key) {
    cached = {
      key,
      transport: nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        requireTLS: !config.secure,
        auth: { user: config.user, pass: config.pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      }),
    };
  }
  return cached.transport;
}

export async function sendMail(config: MailConfig, mail: OutgoingMail): Promise<void> {
  const info = await getTransport(config).sendMail({ from: config.from, ...mail });
  if (info.accepted.length === 0) {
    throw new Error(`SMTP server rejected every recipient (${info.rejected.length})`);
  }
}
