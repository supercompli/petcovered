import { parseApplication } from '../../../services/email/application';
import { buildCustomerConfirmation } from '../../../services/email/customerConfirmation';
import { BRAND } from '../../../services/email/layout';
import { getMailConfig, MailConfigError, sendMail } from '../../../services/email/mailer';
import { buildTeamNotification } from '../../../services/email/teamNotification';

export const runtime = 'nodejs';

const MAX_BODY_CHARS = 20_000;
const IP_LIMIT = { max: 5, windowMs: 10 * 60_000 };
const RECIPIENT_LIMIT = { max: 3, windowMs: 60 * 60_000 };
const DELIVERED_TTL_MS = 60 * 60_000;

// In-memory and per instance: enough to blunt double-clicks and casual abuse of an endpoint that
// emails an address the caller chooses. Put Vercel's WAF rate limiting in front for anything firmer.
const attempts = new Map<string, number[]>();
const delivered = new Map<string, { at: number; customerEmailSent: boolean }>();

function withinLimit(key: string, { max, windowMs }: { max: number; windowMs: number }, now: number): boolean {
  const recent = (attempts.get(key) ?? []).filter(at => now - at < windowMs);
  const allowed = recent.length < max;
  if (allowed) recent.push(now);
  attempts.set(key, recent);

  if (attempts.size > 2000) {
    for (const [k, times] of attempts) {
      if (now - times[times.length - 1] > 60 * 60_000) attempts.delete(k);
    }
  }
  return allowed;
}

function sweepDelivered(now: number) {
  for (const [reference, { at }] of delivered) {
    if (now - at > DELIVERED_TTL_MS) delivered.delete(reference);
  }
}

const fail = (status: number, error: string, headers?: HeadersInit) =>
  Response.json({ ok: false, error }, { status, headers });

function logMailError(kind: string, reference: string, error: unknown) {
  const { code, responseCode, message } = error as { code?: string; responseCode?: number; message?: string };
  console.error(`[quote] ${kind} failed for ${reference}:`, code ?? '', responseCode ?? '', message ?? error);
}

export async function POST(request: Request) {
  const now = Date.now();

  // A cross-site page can only send "simple" content types, so insisting on JSON keeps other
  // origins from making visitors' browsers trigger emails.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return fail(415, 'Unsupported content type.');
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  if (!withinLimit(`ip:${ip}`, IP_LIMIT, now)) {
    return fail(429, 'Too many attempts. Please wait a few minutes and try again.', { 'Retry-After': '600' });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return fail(413, 'Request too large.');

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return fail(400, 'Invalid request.');
  }

  const parsed = parseApplication(json, new Date(now));
  if ('error' in parsed) return fail(400, parsed.error);
  const { application } = parsed;

  // A retry or double-click for an application we already emailed must not email it again.
  sweepDelivered(now);
  const previous = delivered.get(application.reference);
  if (previous) {
    return Response.json({ ok: true, reference: application.reference, customerEmailSent: previous.customerEmailSent });
  }

  if (!withinLimit(`recipient:${application.email.toLowerCase()}`, RECIPIENT_LIMIT, now)) {
    return fail(429, 'Too many attempts for this email address. Please try again later.', { 'Retry-After': '3600' });
  }

  const unavailable = `We couldn't submit your application right now. Please try again in a moment, or call us on ${BRAND.phone}.`;

  let config;
  try {
    config = getMailConfig();
  } catch (error) {
    if (error instanceof MailConfigError) {
      console.error(`[quote] email is not configured. Missing: ${error.missing.join(', ')}`);
      return fail(503, unavailable);
    }
    throw error;
  }

  // The team email goes first and gates the response: the quote flow stores nothing server side,
  // so it is the only record of the application, and a customer shouldn't be told it was received
  // when the team never got it.
  try {
    await sendMail(config, { to: config.notifyTo, replyTo: application.email, ...buildTeamNotification(application) });
  } catch (error) {
    logMailError('team notification', application.reference, error);
    return fail(502, unavailable);
  }

  let customerEmailSent = true;
  try {
    await sendMail(config, { to: application.email, replyTo: BRAND.email, ...buildCustomerConfirmation(application) });
  } catch (error) {
    customerEmailSent = false;
    logMailError('customer confirmation', application.reference, error);
  }

  delivered.set(application.reference, { at: now, customerEmailSent });
  return Response.json({ ok: true, reference: application.reference, customerEmailSent });
}
