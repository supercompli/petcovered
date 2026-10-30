import type { Application } from './application';
import type { BuiltEmail } from './customerConfirmation';
import { formatDateTime, money } from './format';
import {
  BRAND,
  brandFooter,
  brandHeader,
  buttons,
  callout,
  card,
  COLORS,
  esc,
  eyebrow,
  h1,
  h2,
  kv,
  p,
  qa,
  renderEmail,
  textSection,
  tiles,
} from './layout';

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

export function buildTeamNotification(app: Application): BuiltEmail {
  const { plan, pet, health, banking, flags } = app;
  const submitted = formatDateTime(app.submittedAt);
  const monthly = money(app.total);
  const needsReview = flags.length > 0;
  const replySubject = `Your Petcovered application ${app.reference}`;

  const subject = `${needsReview ? '[Review] ' : ''}New application: ${pet.name} (${app.species}) · ${plan.name} · ${monthly}/mo · ${app.reference}`;
  const preheader = needsReview
    ? `${flags.length} item${flags.length === 1 ? '' : 's'} to review before issuing. ${plan.name} at ${monthly} per month.`
    : `No underwriting flags. ${plan.name} at ${monthly} per month. Issue the policy within 24 hours.`;

  const hero = card(
    `${eyebrow(needsReview ? 'Review required' : 'Action required')}
    ${h1(`${pet.name} the ${app.species.toLowerCase()}`)}
    ${p(`A customer has completed the quote flow and authorised a debit order for the ${esc(plan.name)} plan${app.routineCare ? ' with Routine Care' : ''}. The customer has been told their policy documents will arrive within 24 hours.`)}
    <div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
    ${tiles([
      { label: 'Premium', value: `${monthly}/mo` },
      { label: 'Debit date', value: `${banking.debitDayLabel} monthly` },
      { label: 'Reference', value: app.reference },
    ])}
    <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
    ${buttons([{ label: 'Email customer', href: `mailto:${app.email}?subject=${encodeURIComponent(replySubject)}` }])}`,
  );

  const flagCard = needsReview
    ? card(
        `<div class="t-warn" style="font-size:16px;line-height:1.4;font-weight:800;color:${COLORS.warnInk};">Review before issuing</div>
        <ul class="t-warn" style="margin:10px 0 0;padding:0 0 0 20px;font-size:14px;line-height:1.7;color:${COLORS.warnInk};">${flags.map(flag => `<li>${esc(flag)}</li>`).join('')}</ul>`,
        'warn',
      )
    : card(
        `<div class="t-ok" style="font-size:16px;line-height:1.4;font-weight:800;color:${COLORS.okInk};">No underwriting flags</div>
        <p class="t-ok" style="margin:6px 0 0;font-size:14px;line-height:1.6;color:${COLORS.okInk};">No conditions declared, vaccinations up to date, no commercial use, vet access granted and the pet is within the 8 week to 9 year entry age.</p>`,
        'ok',
      );

  const customerCard = card(
    `${h2('Customer and pet')}
    ${kv([
      {
        label: 'Email',
        value: `<a href="mailto:${esc(app.email)}" class="t-primary" style="color:${COLORS.primary};">${esc(app.email)}</a>`,
        html: true,
      },
      { label: 'Pet', value: pet.name },
      { label: 'Species', value: app.species },
      { label: 'Breed', value: pet.breed },
      { label: 'Gender', value: pet.gender },
      { label: 'Colour', value: pet.colour },
      { label: 'Weight', value: pet.weight },
      { label: 'Date of birth', value: `${pet.dobLabel} (${pet.ageLabel})` },
      { label: 'Microchip number', value: pet.chipNo },
    ])}`,
  );

  const planCard = card(
    `${h2('Plan and premium')}
    ${kv([
      { label: 'Plan', value: plan.name },
      { label: 'Annual limit', value: plan.annualLimit },
      { label: 'Excess', value: plan.excess },
      { label: 'Waiting period', value: plan.waitingPeriod },
      { label: `${plan.name} (${app.species.toLowerCase()} rate)`, value: money(app.planRate) },
      { label: 'Routine Care add-on', value: app.routineCare ? money(app.routineCarePrice) : 'Not selected' },
      { label: 'Monthly total', value: monthly, bold: true },
    ])}`,
  );

  const declarationCard = card(
    `${h2('Health declaration')}
    ${qa([
      { question: 'Any conditions in the last two years?', answer: health.conditions || 'None declared', flagged: !!health.conditions },
      { question: 'Other health or behaviour information', answer: health.additional || 'None declared', flagged: !!health.additional },
      { question: 'Vaccinations up to date?', answer: yesNo(health.vaccinations), flagged: !health.vaccinations },
      { question: 'Ever used commercially?', answer: yesNo(health.commercial), flagged: health.commercial },
      { question: 'Permission to contact the vet?', answer: yesNo(health.vetPermission), flagged: !health.vetPermission },
    ])}`,
  );

  const bankingCard = card(
    `${h2('Debit order')}
    ${kv([
      { label: 'Account holder', value: banking.accHolder },
      { label: 'Bank', value: banking.bank },
      { label: 'Account number', value: banking.accountNumber, bold: true },
      { label: 'Debit date', value: `${banking.debitDayLabel} of every month` },
      { label: 'Amount', value: `${monthly} per month`, bold: true },
    ])}
    <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>
    ${callout('This email contains the full account number. Keep it internal and do not forward it.', 'warn')}`,
  );

  const metaCard = card(
    `${kv([
      { label: 'Reference', value: app.reference },
      { label: 'Submitted', value: submitted },
      { label: 'Timestamp (UTC)', value: app.submittedAt.toISOString() },
    ])}`,
    'tint',
  );

  const html = renderEmail({
    title: subject,
    preheader,
    header: brandHeader('New application', 'night'),
    body: [hero, flagCard, customerCard, planCard, declarationCard, bankingCard, metaCard].join('\n'),
    footer: brandFooter(
      'Automated internal notification from petcovered.co.za. Replying to this email goes straight to the customer.',
    ),
  });

  const text = [
    `NEW APPLICATION${needsReview ? ' (REVIEW REQUIRED)' : ''}: ${pet.name} the ${app.species.toLowerCase()}`,
    `${plan.name}${app.routineCare ? ' with Routine Care' : ''} at ${monthly} per month. Issue the policy within 24 hours.`,
    '',
    needsReview ? ['REVIEW BEFORE ISSUING', ...flags.map(flag => `- ${flag}`)].join('\n') : 'No underwriting flags.',
    '',
    textSection('Customer and pet', [
      ['Email', app.email],
      ['Pet', pet.name],
      ['Species', app.species],
      ['Breed', pet.breed],
      ['Gender', pet.gender],
      ['Colour', pet.colour],
      ['Weight', pet.weight],
      ['Date of birth', `${pet.dobLabel} (${pet.ageLabel})`],
      ['Microchip number', pet.chipNo],
    ]),
    '',
    textSection('Plan and premium', [
      ['Plan', plan.name],
      ['Annual limit', plan.annualLimit],
      ['Excess', plan.excess],
      ['Waiting period', plan.waitingPeriod],
      [`${plan.name} (${app.species.toLowerCase()} rate)`, money(app.planRate)],
      ['Routine Care add-on', app.routineCare ? money(app.routineCarePrice) : 'Not selected'],
      ['Monthly total', monthly],
    ]),
    '',
    textSection('Health declaration', [
      ['Conditions in the last two years', health.conditions || 'None declared'],
      ['Other health or behaviour information', health.additional || 'None declared'],
      ['Vaccinations up to date', yesNo(health.vaccinations)],
      ['Ever used commercially', yesNo(health.commercial)],
      ['Permission to contact the vet', yesNo(health.vetPermission)],
    ]),
    '',
    textSection('Debit order', [
      ['Account holder', banking.accHolder],
      ['Bank', banking.bank],
      ['Account number', banking.accountNumber],
      ['Debit date', `${banking.debitDayLabel} of every month`],
      ['Amount', `${monthly} per month`],
    ]),
    'This email contains the full account number. Keep it internal and do not forward it.',
    '',
    textSection('Details', [
      ['Reference', app.reference],
      ['Submitted', submitted],
      ['Timestamp (UTC)', app.submittedAt.toISOString()],
    ]),
    '',
    `Replying to this email goes straight to the customer. ${BRAND.siteUrl}`,
  ].join('\n');

  return { subject, html, text };
}
