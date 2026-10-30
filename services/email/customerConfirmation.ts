import { ROUTINE_CARE_ANNUAL_VALUE, ROUTINE_CARE_ITEMS } from '../../constants';
import type { Application } from './application';
import { formatDateTime, money } from './format';
import {
  BRAND,
  brandFooter,
  brandHeader,
  buttons,
  callout,
  card,
  checklist,
  COLORS,
  esc,
  eyebrow,
  h1,
  h2,
  kv,
  p,
  qa,
  renderEmail,
  steps,
  strong,
  textSection,
  tiles,
} from './layout';

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

export function buildCustomerConfirmation(app: Application): BuiltEmail {
  const { plan, pet, health, banking } = app;
  const submitted = formatDateTime(app.submittedAt);
  const monthly = money(app.total);
  const planLabel = app.routineCare ? `${plan.name} with Routine Care` : plan.name;
  const authorisation =
    `You authorised GENRIC Pet Insurance to debit ${monthly} each month for the ${plan.name} plan` +
    `${app.routineCare ? ', including Routine Care' : ''}.`;

  const subject = `We've received ${pet.name}'s application (${app.reference})`;
  const preheader = `Reference ${app.reference} · ${planLabel} for ${pet.name} · ${monthly} per month. Your policy documents follow within 24 hours.`;

  const hero = card(
    `${eyebrow('Application received')}
    ${h1(`We've got ${pet.name}'s application`)}
    ${p(`Thank you for choosing Petcovered. We've sent ${strong(pet.name)}'s application for the ${strong(plan.name)} plan to our underwriters at GENRIC. Your policy documents will be emailed to you within ${strong('24 hours')}.`)}
    <div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
    ${tiles([
      { label: 'Reference', value: app.reference },
      { label: 'Submitted', value: submitted },
    ])}`,
  );

  const nextSteps = card(
    `${h2('What happens next')}
    ${steps([
      { title: 'Application received', body: `We have everything we need to review ${esc(pet.name)}'s application.`, done: true },
      {
        title: 'Policy documents issued',
        body: 'Our GENRIC underwriters review your application and email your policy schedule within 24 hours.',
      },
      {
        title: 'Premium collected monthly',
        body: `${esc(monthly)} is collected by debit order on the ${esc(banking.debitDayLabel)} of each month from your ${esc(banking.bank)} account (${esc(banking.accountMasked)}).`,
      },
      {
        title: 'Ready to claim',
        body: 'Your policy schedule sets out your cover, waiting period and excess. Approved claims are typically paid within 5 working days.',
      },
    ])}`,
  );

  const routineCare = app.routineCare
    ? `<div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>${callout(
        `${strong('Routine Care included')}, valued at R${ROUTINE_CARE_ANNUAL_VALUE.toLocaleString('en-US')} per year: ${esc(ROUTINE_CARE_ITEMS.join(', '))}.`,
      )}`
    : '';

  const planCard = card(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="stack" valign="top" style="font-family:inherit;">
        ${eyebrow('Your plan')}
        ${h2(plan.name, esc(plan.caption))}
      </td>
      <td class="stack price" valign="top" align="right" style="white-space:nowrap;">
        <div class="t-primary" style="font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${COLORS.primary};">${esc(monthly)}</div>
        <div class="t-muted" style="margin-top:2px;font-size:13px;color:${COLORS.muted};">per month</div>
      </td>
    </tr></table>
    ${tiles([
      { label: 'Annual limit', value: plan.annualLimit },
      { label: 'Excess', value: plan.excess },
      { label: 'Waiting period', value: plan.waitingPeriod },
    ])}
    <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
    ${kv([
      { label: `${plan.name} (${app.species.toLowerCase()} rate)`, value: money(app.planRate) },
      { label: 'Routine Care add-on', value: app.routineCare ? money(app.routineCarePrice) : '' },
      { label: 'Monthly total', value: monthly, bold: true },
    ])}
    <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
    ${checklist(plan.features)}
    ${routineCare}`,
  );

  const petCard = card(
    `${h2(`About ${pet.name}`)}
    ${kv([
      { label: 'Name', value: pet.name },
      { label: 'Species', value: app.species },
      { label: 'Breed', value: pet.breed },
      { label: 'Gender', value: pet.gender },
      { label: 'Colour', value: pet.colour },
      { label: 'Weight', value: pet.weight },
      { label: 'Date of birth', value: `${pet.dobLabel} (${pet.ageLabel})` },
      { label: 'Microchip number', value: pet.chipNo },
    ])}`,
  );

  const healthCard = card(
    `${h2('Your health declaration', 'This is what you told us. If anything is wrong or has changed, reply to this email or call us before your policy is issued. Accurate answers help us settle claims smoothly.')}
    ${qa([
      { question: 'Any conditions in the last two years?', answer: health.conditions || 'None declared' },
      { question: "Other health or behaviour information", answer: health.additional || 'None declared' },
      { question: 'Vaccinations up to date?', answer: yesNo(health.vaccinations) },
      { question: 'Ever used commercially?', answer: yesNo(health.commercial) },
      { question: 'Permission to contact your vet?', answer: yesNo(health.vetPermission) },
    ])}`,
  );

  const debitCard = card(
    `${h2('Debit order authorisation')}
    ${kv([
      { label: 'Account holder', value: banking.accHolder },
      { label: 'Bank', value: banking.bank },
      { label: 'Account number', value: banking.accountMasked },
      { label: 'Debit date', value: `${banking.debitDayLabel} of every month` },
      { label: 'Amount', value: `${monthly} per month`, bold: true },
    ])}
    <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>
    ${callout(esc(authorisation))}`,
  );

  const securityCard = card(
    `<div class="t-warn" style="font-size:15px;line-height:1.4;font-weight:800;color:${COLORS.warnInk};">Didn't make this application?</div>
    <p class="t-warn" style="margin:6px 0 0;font-size:14px;line-height:1.6;color:${COLORS.warnInk};">If you didn't request this cover, contact us straight away on <a href="${BRAND.phoneHref}" style="color:${COLORS.warnInk};font-weight:700;text-decoration:underline;">${esc(BRAND.phone)}</a> or at <a href="mailto:${BRAND.email}" style="color:${COLORS.warnInk};font-weight:700;text-decoration:underline;">${esc(BRAND.email)}</a> and quote ${esc(app.reference)} so we can cancel it.</p>`,
    'warn',
  );

  const helpCard = card(
    `${h2('Questions? We\'re happy to help.')}
    ${p(`Call <a href="${BRAND.phoneHref}" class="t-primary" style="color:${COLORS.primary};font-weight:700;">${esc(BRAND.phone)}</a> or email <a href="mailto:${BRAND.email}?subject=${encodeURIComponent(`Application ${app.reference}`)}" class="t-primary" style="color:${COLORS.primary};font-weight:700;">${esc(BRAND.email)}</a>, and quote ${strong(app.reference)} so we can find your application quickly.`)}
    ${buttons([
      { label: 'How to claim', href: `${BRAND.siteUrl}/claims` },
      { label: 'Email us', href: `mailto:${BRAND.email}?subject=${encodeURIComponent(`Application ${app.reference}`)}`, variant: 'ghost' },
    ])}`,
    'tint',
  );

  const html = renderEmail({
    title: subject,
    preheader,
    header: brandHeader('Application received'),
    body: [hero, nextSteps, planCard, petCard, healthCard, debitCard, securityCard, helpCard].join('\n'),
    footer: brandFooter(
      `You're receiving this email because an application for ${pet.name} was submitted at petcovered.co.za on ${submitted} using this address.`,
    ),
  });

  const text = [
    `We've got ${pet.name}'s application`,
    '',
    `Thank you for choosing Petcovered. We've sent ${pet.name}'s application for the ${plan.name} plan to our underwriters at GENRIC. Your policy documents will be emailed to you within 24 hours.`,
    '',
    textSection('Application', [
      ['Reference', app.reference],
      ['Submitted', submitted],
    ]),
    '',
    'WHAT HAPPENS NEXT',
    '1. Application received (done)',
    '2. Policy documents issued: our GENRIC underwriters review your application and email your policy schedule within 24 hours.',
    `3. Premium collected monthly: ${monthly} by debit order on the ${banking.debitDayLabel} of each month from your ${banking.bank} account (${banking.accountMasked}).`,
    '4. Ready to claim: your policy schedule sets out your cover, waiting period and excess. Approved claims are typically paid within 5 working days.',
    '',
    textSection('Your plan', [
      ['Plan', planLabel],
      ['Annual limit', plan.annualLimit],
      ['Excess', plan.excess],
      ['Waiting period', plan.waitingPeriod],
      [`${plan.name} (${app.species.toLowerCase()} rate)`, money(app.planRate)],
      ['Routine Care add-on', app.routineCare ? money(app.routineCarePrice) : ''],
      ['Monthly total', monthly],
    ]),
    '',
    "WHAT'S INCLUDED",
    ...plan.features.map(feature => `- ${feature}`),
    ...(app.routineCare ? ['', `Routine Care (valued at R${ROUTINE_CARE_ANNUAL_VALUE.toLocaleString('en-US')} per year): ${ROUTINE_CARE_ITEMS.join(', ')}.`] : []),
    '',
    textSection(`About ${pet.name}`, [
      ['Species', app.species],
      ['Breed', pet.breed],
      ['Gender', pet.gender],
      ['Colour', pet.colour],
      ['Weight', pet.weight],
      ['Date of birth', `${pet.dobLabel} (${pet.ageLabel})`],
      ['Microchip number', pet.chipNo],
    ]),
    '',
    textSection('Your health declaration', [
      ['Conditions in the last two years', health.conditions || 'None declared'],
      ['Other health or behaviour information', health.additional || 'None declared'],
      ['Vaccinations up to date', yesNo(health.vaccinations)],
      ['Ever used commercially', yesNo(health.commercial)],
      ['Permission to contact your vet', yesNo(health.vetPermission)],
    ]),
    'If anything is wrong or has changed, reply to this email or call us before your policy is issued.',
    '',
    textSection('Debit order authorisation', [
      ['Account holder', banking.accHolder],
      ['Bank', banking.bank],
      ['Account number', banking.accountMasked],
      ['Debit date', `${banking.debitDayLabel} of every month`],
      ['Amount', `${monthly} per month`],
    ]),
    authorisation,
    '',
    `DIDN'T MAKE THIS APPLICATION?`,
    `Contact us straight away on ${BRAND.phone} or ${BRAND.email} and quote ${app.reference} so we can cancel it.`,
    '',
    `Questions? Call ${BRAND.phone} or email ${BRAND.email}, quoting ${app.reference}.`,
    `How to claim: ${BRAND.siteUrl}/claims`,
    '',
    '--',
    BRAND.legal,
  ].join('\n');

  return { subject, html, text };
}
