/**
 * Building blocks for the transactional emails.
 *
 * Email clients are not browsers: layout is table based, styles are inline (a <style> block only
 * adds the mobile and dark-mode overrides, which clients that ignore it can safely lose), and
 * nothing depends on remote images because many clients block them by default.
 */

export const BRAND = {
  name: 'Petcovered',
  siteUrl: 'https://petcovered.co.za',
  email: 'hello@petcovered.co.za',
  phone: '087 655 0525',
  phoneHref: 'tel:+27876550525',
  location: 'Midrand & Cape Town',
  legal:
    'Petcovered® is part of Covered Financial Services (FSP 54871). Underwritten by GENRIC Insurance Company Limited (FSP 43638). ' +
    'GENRIC is an authorised Financial Services Provider and licensed non-life Insurer. ' +
    'This is a Health Insurance Product, not a Medical Aid Scheme.',
};

export const COLORS = {
  primary: '#a94694',
  primaryDark: '#7a2d69',
  primaryLight: '#e08fd0',
  tint: '#fbf3f9',
  tintBorder: '#f0dbea',
  ink: '#1f2937',
  muted: '#6b7280',
  line: '#eee7ec',
  page: '#f4f0f4',
  card: '#ffffff',
  night: '#1b1220',
  okBg: '#ecfdf3',
  okInk: '#166534',
  okBorder: '#bbf7d0',
  warnBg: '#fffbeb',
  warnInk: '#92400e',
  warnBorder: '#fde68a',
};

const C = COLORS;
const FONT = `'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`;
const ff = `font-family:${FONT};`;

export const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Escapes free text and keeps the customer's line breaks. */
export const multiline = (value: string): string => esc(value).replace(/\n/g, '<br>');

const spacer = (height: number) =>
  `<tr><td height="${height}" style="height:${height}px;font-size:0;line-height:0;">&nbsp;</td></tr>`;

// ---------------------------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------------------------

const STYLES = `
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  a{text-decoration:none;}
  @media only screen and (max-width:620px){
    .container{width:100% !important;}
    .px{padding-left:22px !important;padding-right:22px !important;}
    .stack{display:block !important;width:100% !important;box-sizing:border-box;}
    .tile{display:block !important;width:100% !important;box-sizing:border-box;margin-bottom:8px;}
    .gap{display:none !important;}
    .h1{font-size:26px !important;}
    .price{text-align:left !important;padding-top:14px !important;}
    .btn-cell{display:block !important;width:100% !important;padding:0 0 10px 0 !important;}
    .btn-cell a{display:block !important;text-align:center !important;}
  }
  @media (prefers-color-scheme:dark){
    .bg-page{background:#141016 !important;}
    .bg-card{background:#1e1822 !important;}
    .bg-tint{background:#2a2030 !important;}
    .bg-ok{background:#12301f !important;}
    .bg-warn{background:#33270f !important;}
    .bd{border-color:#3a2f41 !important;}
    .t-ink{color:#f3eef5 !important;}
    .t-muted{color:#b9aebf !important;}
    .t-primary{color:#e08fd0 !important;}
    .t-ok{color:#86efac !important;}
    .t-warn{color:#fcd34d !important;}
  }
`;

export interface EmailShell {
  title: string;
  /** Inbox preview line; hidden in the body. */
  preheader: string;
  header: string;
  /** One or more <tr> rows, normally produced by card(). */
  body: string;
  footer: string;
}

export function renderEmail({ title, preheader, header, body, footer }: EmailShell): string {
  // Pads the preview so clients don't pull body copy in after the preheader.
  const padding = '&#847;&zwnj;&nbsp;'.repeat(80);

  return `<!doctype html>
<html lang="en-ZA" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<title>${esc(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>${STYLES}</style>
</head>
<body class="bg-page" style="margin:0;padding:0;width:100%;background:${C.page};${ff}">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${esc(preheader)}${padding}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background:${C.page};">
<tr><td align="center" style="padding:28px 12px 36px;">
  <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
    ${header}
    ${spacer(14)}
    ${body}
    ${footer}
  </table>
</td></tr>
</table>
</body>
</html>`;
}

export function brandHeader(badge: string, tone: 'brand' | 'night' = 'brand'): string {
  const bg = tone === 'brand' ? C.primary : C.night;
  const gradient =
    tone === 'brand' ? `linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 100%)` : `linear-gradient(135deg,${C.night} 0%,#2d1c36 100%)`;
  const badgeBg = tone === 'brand' ? '#b9609f' : '#3b2547';

  return `<tr><td class="px" style="background:${bg};background-image:${gradient};border-radius:20px;padding:22px 32px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle" style="${ff}">
      <div style="font-size:27px;line-height:1;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">Pet<span style="font-weight:500;">covered</span></div>
      <div style="margin-top:6px;font-size:10px;line-height:1;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${C.tintBorder};">Smart Protection</div>
    </td>
    <td valign="middle" align="right" style="${ff}">
      <span style="display:inline-block;padding:7px 14px;border-radius:999px;background:${badgeBg};font-size:12px;font-weight:700;letter-spacing:0.02em;color:#ffffff;white-space:nowrap;">${esc(badge)}</span>
    </td>
  </tr></table>
</td></tr>`;
}

export function brandFooter(reason: string): string {
  const year = new Date().getFullYear();
  const link = (label: string, href: string) =>
    `<a href="${href}" class="t-primary" style="color:${C.primary};font-weight:700;">${label}</a>`;

  return `${spacer(8)}
<tr><td class="px" align="center" style="padding:8px 24px 0;${ff}">
  <p class="t-muted" style="margin:0 0 12px;font-size:13px;line-height:1.6;color:${C.muted};">
    ${link('Website', BRAND.siteUrl)} &nbsp;·&nbsp; ${link('Plans', `${BRAND.siteUrl}/plans`)} &nbsp;·&nbsp; ${link('How to claim', `${BRAND.siteUrl}/claims`)}
  </p>
  <p class="t-muted" style="margin:0 0 12px;font-size:12px;line-height:1.6;color:${C.muted};">${esc(reason)}</p>
  <p class="t-muted" style="margin:0 0 12px;font-size:11px;line-height:1.6;color:${C.muted};">${esc(BRAND.legal)}</p>
  <p class="t-muted" style="margin:0;font-size:11px;line-height:1.6;color:${C.muted};">&copy; 2021-${year} Petcovered. All Rights Reserved. &nbsp;·&nbsp; ${esc(BRAND.location)}</p>
</td></tr>`;
}

// ---------------------------------------------------------------------------------------------
// Cards and typography
// ---------------------------------------------------------------------------------------------

type CardTone = 'default' | 'tint' | 'ok' | 'warn';

const CARD_TONES: Record<CardTone, { cls: string; bg: string; border: string }> = {
  default: { cls: 'bg-card', bg: C.card, border: C.line },
  tint: { cls: 'bg-tint', bg: C.tint, border: C.tintBorder },
  ok: { cls: 'bg-ok', bg: C.okBg, border: C.okBorder },
  warn: { cls: 'bg-warn', bg: C.warnBg, border: C.warnBorder },
};

/** A rounded white section followed by the gap to the next one. */
export function card(inner: string, tone: CardTone = 'default'): string {
  const t = CARD_TONES[tone];
  return `<tr><td class="px ${t.cls} bd" style="background:${t.bg};border:1px solid ${t.border};border-radius:16px;padding:28px 32px;${ff}">${inner}</td></tr>${spacer(14)}`;
}

export const eyebrow = (label: string): string =>
  `<div class="t-primary" style="margin:0 0 10px;${ff}font-size:12px;line-height:1;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${C.primary};">${esc(label)}</div>`;

export const h1 = (label: string): string =>
  `<h1 class="h1 t-ink" style="margin:0 0 14px;${ff}font-size:30px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;color:${C.ink};">${esc(label)}</h1>`;

export function h2(label: string, subtitle?: string): string {
  const sub = subtitle
    ? `<p class="t-muted" style="margin:0 0 18px;${ff}font-size:14px;line-height:1.6;color:${C.muted};">${subtitle}</p>`
    : '<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>';
  return `<h2 class="t-ink" style="margin:0 0 ${subtitle ? '4' : '0'}px;${ff}font-size:18px;line-height:1.3;font-weight:800;letter-spacing:-0.01em;color:${C.ink};">${esc(label)}</h2>${sub}`;
}

/** Body copy; `html` must already be escaped. */
export const p = (html: string): string =>
  `<p class="t-ink" style="margin:0 0 14px;${ff}font-size:15px;line-height:1.65;color:${C.ink};">${html}</p>`;

export const strong = (label: string): string => `<strong>${esc(label)}</strong>`;

// ---------------------------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------------------------

type PillTone = 'brand' | 'ok' | 'warn' | 'neutral';

export function pill(label: string, tone: PillTone = 'brand'): string {
  const tones: Record<PillTone, { bg: string; ink: string; cls: string }> = {
    brand: { bg: C.tint, ink: C.primary, cls: 't-primary bg-tint' },
    ok: { bg: C.okBg, ink: C.okInk, cls: 't-ok bg-ok' },
    warn: { bg: C.warnBg, ink: C.warnInk, cls: 't-warn bg-warn' },
    neutral: { bg: C.line, ink: C.muted, cls: 't-muted' },
  };
  const t = tones[tone];
  return `<span class="${t.cls}" style="display:inline-block;padding:4px 10px;border-radius:999px;background:${t.bg};${ff}font-size:12px;line-height:1.3;font-weight:700;color:${t.ink};white-space:nowrap;">${esc(label)}</span>`;
}

export interface KvRow {
  label: string;
  value: string;
  /** Pass true when `value` is trusted HTML (already escaped). */
  html?: boolean;
  bold?: boolean;
}

/** Label/value rows. Empty values are skipped so optional fields don't leave blank lines. */
export function kv(rows: KvRow[]): string {
  const body = rows
    .filter(row => row.value)
    .map(
      (row, i, all) => `<tr>
    <td class="t-muted bd" width="40%" valign="top" style="padding:11px 12px 11px 0;${i < all.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}${ff}font-size:14px;line-height:1.5;color:${C.muted};">${esc(row.label)}</td>
    <td class="t-ink bd" valign="top" align="right" style="padding:11px 0;${i < all.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}${ff}font-size:14px;line-height:1.5;font-weight:${row.bold ? 800 : 600};color:${C.ink};">${row.html ? row.value : multiline(row.value)}</td>
  </tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table>`;
}

export interface QaItem {
  question: string;
  answer: string;
  /** Marks an answer an underwriter should look at (team email only). */
  flagged?: boolean;
}

export function qa(items: QaItem[]): string {
  const rows = items
    .map(
      (item, i) => `<tr><td class="bd" style="padding:12px 0;${i < items.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}${ff}">
    <div class="t-muted" style="font-size:13px;line-height:1.5;color:${C.muted};">${esc(item.question)}</div>
    <div class="t-ink" style="margin-top:3px;font-size:15px;line-height:1.5;font-weight:700;color:${C.ink};">${multiline(item.answer)}${item.flagged ? ` &nbsp;${pill('Review', 'warn')}` : ''}</div>
  </td></tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
}

/**
 * Equal-width stat tiles; they stack on narrow screens. Each tile is a cell of one row (with
 * spacer cells between) so they share a height however much their text wraps.
 */
export function tiles(items: Array<{ label: string; value: string }>): string {
  // Fixed layout: the spacer cells keep their 10px and the tiles split what is left evenly.
  const cells = items
    .map(
      (item, i) => `${i > 0 ? '<td class="gap" width="10" style="width:10px;font-size:0;line-height:0;">&nbsp;</td>' : ''}
    <td class="tile bg-tint bd" valign="top" style="background:${C.tint};border:1px solid ${C.tintBorder};border-radius:12px;padding:14px 16px;${ff}">
      <div class="t-muted" style="font-size:11px;line-height:1.3;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">${esc(item.label)}</div>
      <div class="t-ink" style="margin-top:5px;font-size:17px;line-height:1.3;font-weight:800;color:${C.ink};">${esc(item.value)}</div>
    </td>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;"><tr>${cells}</tr></table>`;
}

export function checklist(items: string[]): string {
  const rows = items
    .map(
      item => `<tr>
    <td valign="top" width="26" style="padding:5px 0;${ff}font-size:15px;line-height:1.5;font-weight:800;color:${C.primary};" class="t-primary">&#10003;</td>
    <td valign="top" class="t-ink" style="padding:5px 0;${ff}font-size:14px;line-height:1.5;color:${C.ink};">${esc(item)}</td>
  </tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
}

export interface Step {
  title: string;
  body: string;
  done?: boolean;
}

/** Numbered vertical timeline; completed steps get a tick instead of a number. */
export function steps(items: Step[]): string {
  const rows = items
    .map((step, i) => {
      const bg = step.done ? C.okInk : C.tint;
      const ink = step.done ? '#ffffff' : C.primary;
      const border = step.done ? C.okInk : C.tintBorder;
      return `<tr>
    <td valign="top" width="44" style="padding:0 0 ${i < items.length - 1 ? 20 : 0}px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="center" valign="middle" width="32" height="32" style="width:32px;height:32px;border-radius:50%;background:${bg};border:1px solid ${border};${ff}font-size:14px;line-height:32px;font-weight:800;color:${ink};">${step.done ? '&#10003;' : i + 1}</td>
      </tr></table>
    </td>
    <td valign="top" style="padding:0 0 ${i < items.length - 1 ? 20 : 0}px;${ff}">
      <div class="t-ink" style="font-size:15px;line-height:1.4;font-weight:800;color:${C.ink};">${esc(step.title)}</div>
      <div class="t-muted" style="margin-top:3px;font-size:14px;line-height:1.6;color:${C.muted};">${step.body}</div>
    </td>
  </tr>`;
    })
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
}

/** Inline highlighted note inside a card. `html` must already be escaped. */
export function callout(html: string, tone: 'brand' | 'ok' | 'warn' = 'brand'): string {
  const tones = {
    brand: { bg: C.tint, border: C.primary, ink: C.ink, cls: 'bg-tint t-ink' },
    ok: { bg: C.okBg, border: C.okInk, ink: C.okInk, cls: 'bg-ok t-ok' },
    warn: { bg: C.warnBg, border: C.warnInk, ink: C.warnInk, cls: 'bg-warn t-warn' },
  }[tone];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td class="${tones.cls}" style="background:${tones.bg};border-left:4px solid ${tones.border};border-radius:8px;padding:14px 16px;${ff}font-size:14px;line-height:1.6;color:${tones.ink};">${html}</td>
  </tr></table>`;
}

/** Row of call-to-action buttons; they stack on narrow screens. */
export function buttons(items: Array<{ label: string; href: string; variant?: 'primary' | 'ghost' }>): string {
  const cells = items
    .map(({ label, href, variant = 'primary' }, i) => {
      const filled = variant === 'primary';
      return `<td class="btn-cell" style="padding:0 ${i < items.length - 1 ? 10 : 0}px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="center" bgcolor="${filled ? C.primary : C.card}" style="border-radius:12px;background:${filled ? C.primary : 'transparent'};border:2px solid ${C.primary};">
          <a href="${esc(href)}" style="display:inline-block;padding:13px 24px;${ff}font-size:15px;line-height:1.2;font-weight:800;color:${filled ? '#ffffff' : C.primary};border-radius:12px;">${esc(label)}</a>
        </td>
      </tr></table>
    </td>`;
    })
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
}

// ---------------------------------------------------------------------------------------------
// Plain-text alternative
// ---------------------------------------------------------------------------------------------

/** "TITLE" followed by "label: value" lines (or bare lines when the label is empty). */
export function textSection(title: string, rows: Array<[string, string]>): string {
  const lines = rows
    .filter(([, value]) => value)
    .map(([label, value]) => (label ? `${label}: ${value}` : value));
  return [title.toUpperCase(), ...lines].join('\n');
}
