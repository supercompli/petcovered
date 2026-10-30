const TIME_ZONE = 'Africa/Johannesburg';

export const money = (amount: number): string =>
  `R${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function ordinal(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  const suffix = ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${suffix}`;
}

export const formatDateTime = (date: Date): string =>
  `${new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TIME_ZONE,
  }).format(date)} SAST`;

/** Formats a calendar date (YYYY-MM-DD) without letting the server time zone shift the day. */
export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

export function describeAge(dob: Date, now: Date): { label: string; months: number; days: number } {
  let months =
    (now.getUTCFullYear() - dob.getUTCFullYear()) * 12 + (now.getUTCMonth() - dob.getUTCMonth());
  if (now.getUTCDate() < dob.getUTCDate()) months--;
  const days = Math.floor((now.getTime() - dob.getTime()) / 86_400_000);

  let label: string;
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    label = rest ? `${plural(years, 'year')} ${plural(rest, 'month')}` : plural(years, 'year');
  } else if (months >= 1) {
    label = plural(months, 'month');
  } else {
    label = plural(Math.max(days, 0), 'day');
  }
  return { label, months, days };
}
