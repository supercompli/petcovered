import { randomInt } from 'node:crypto';
import { PET_PLANS, ROUTINE_CARE_PRICE } from '../../constants';
import type { PetPlan } from '../../types';
import { describeAge, formatDate, ordinal } from './format';

export interface Application {
  reference: string;
  submittedAt: Date;
  email: string;
  plan: PetPlan;
  species: 'Dog' | 'Cat';
  routineCare: boolean;
  planRate: number;
  routineCarePrice: number;
  total: number;
  pet: {
    name: string;
    breed: string;
    gender: string;
    colour: string;
    weight: string;
    dob: string;
    dobLabel: string;
    ageLabel: string;
    chipNo: string;
  };
  health: {
    conditions: string;
    additional: string;
    vaccinations: boolean;
    commercial: boolean;
    vetPermission: boolean;
  };
  banking: {
    accHolder: string;
    bank: string;
    /** Digits only. For the team notification; the customer's email uses accountMasked. */
    accountNumber: string;
    accountMasked: string;
    debitDay: number;
    debitDayLabel: string;
  };
  /** Declaration answers an underwriter should look at before issuing the policy. */
  flags: string[];
}

export type ParseResult = { ok: true; application: Application } | { ok: false; error: string };

const REFERENCE_PATTERN = /^LEAD-[A-Z0-9]{9}$/;
const EMAIL_PATTERN = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[^\s@<>()",;:\\]{2,}$/;
const DEBIT_DAYS = [1, 5, 15, 25, 30];
const NOTHING_DECLARED = /^(none|no|nil|n\/a|na|nothing|-+|\.)$/i;
const REFERENCE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Trims, caps the length and drops control characters; keeps line breaks for free-text answers. */
const text = (value: unknown, max: number): string =>
  typeof value === 'string'
    ? value
        .replace(/[^\S\n]+/g, ' ')
        .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
        .trim()
        .slice(0, max)
    : '';

const line = (value: unknown, max: number): string => text(value, max).replace(/\s*\n\s*/g, ' ');

const isDeclared = (answer: string): boolean => answer !== '' && !NOTHING_DECLARED.test(answer);

const newReference = (): string =>
  `LEAD-${Array.from({ length: 9 }, () => REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)]).join('')}`;

export function parseApplication(input: unknown, now = new Date()): ParseResult {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Invalid request.' };
  const body = input as Record<string, any>;
  const pet = body.pet ?? {};
  const health = body.health ?? {};
  const banking = body.banking ?? {};

  const email = line(body.email, 254);
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'Please provide a valid email address.' };

  const plan = PET_PLANS.find(p => p.id === body.planId);
  if (!plan) return { ok: false, error: 'Unknown plan selected.' };

  const species = pet.species === 'Dog' || pet.species === 'Cat' ? pet.species : null;
  if (!species) return { ok: false, error: 'Species must be Dog or Cat.' };

  const petName = line(pet.name, 60);
  if (!petName) return { ok: false, error: "Please provide your pet's name." };

  const dob = line(pet.dob, 10);
  const dobDate = new Date(`${dob}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || Number.isNaN(dobDate.getTime()) || dobDate > now) {
    return { ok: false, error: "Please provide a valid date of birth." };
  }

  if (body.authorise !== true) return { ok: false, error: 'The debit order must be authorised.' };

  const routineCare = body.routineCare === true;
  const planRate = species === 'Dog' ? plan.priceDog : plan.priceCat;
  const routineCarePrice = routineCare ? ROUTINE_CARE_PRICE : 0;

  const age = describeAge(dobDate, now);
  const debitDay = DEBIT_DAYS.includes(Number(banking.debitDay)) ? Number(banking.debitDay) : 1;
  const accountNumber = line(banking.accNo, 40).replace(/\D/g, '').slice(0, 20);
  const weight = Number(pet.weight);

  const application: Application = {
    reference: REFERENCE_PATTERN.test(String(body.reference)) ? String(body.reference) : newReference(),
    submittedAt: now,
    email,
    plan,
    species,
    routineCare,
    planRate,
    routineCarePrice,
    total: planRate + routineCarePrice,
    pet: {
      name: petName,
      breed: line(pet.breed, 60),
      gender: pet.gender === 'F' ? 'Female' : pet.gender === 'M' ? 'Male' : '',
      colour: line(pet.colour, 40),
      weight: Number.isFinite(weight) && weight > 0 ? `${weight} kg` : '',
      dob,
      dobLabel: formatDate(dob),
      ageLabel: age.label,
      chipNo: line(pet.chipNo, 30),
    },
    health: {
      conditions: isDeclared(text(health.conditions, 1000)) ? text(health.conditions, 1000) : '',
      additional: isDeclared(text(health.additional, 1000)) ? text(health.additional, 1000) : '',
      vaccinations: health.vaccinations === 'Yes',
      commercial: health.commercial === 'Yes',
      vetPermission: health.vetPermission === 'Yes',
    },
    banking: {
      accHolder: line(banking.accHolder, 80),
      bank: line(banking.bank, 40),
      accountNumber: accountNumber || 'Not provided',
      accountMasked: accountNumber ? `•••• ${accountNumber.slice(-4)}` : 'Not provided',
      debitDay,
      debitDayLabel: ordinal(debitDay),
    },
    flags: [],
  };

  const { health: h } = application;
  if (h.conditions) application.flags.push('Health conditions declared in the last two years');
  if (h.additional) application.flags.push('Additional health or behaviour information provided');
  if (!h.vaccinations) application.flags.push('Vaccinations are not up to date');
  if (h.commercial) application.flags.push('Pet has been used commercially');
  if (!h.vetPermission) application.flags.push('Permission to contact the vet was declined');
  if (age.months > 108) application.flags.push(`Pet is ${age.label} old, above the 9 year entry age`);
  if (age.days < 56) application.flags.push(`Pet is ${age.label} old, below the 8 week entry age`);

  return { ok: true, application };
}
