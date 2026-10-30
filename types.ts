
export interface PetPlan {
  id: string;
  name: string;
  caption: string;
  priceDog: number;
  priceCat: number;
  featured: boolean;
  annualLimit: string;
  excess: string;
  features: string[];
  waitingPeriod: string;
  speciesNotes?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  stars: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuoteLead {
  id: string;
  submittedAt: string;
  petName: string;
  species: string;
  breed: string;
  premium: string;
  contactEmail: string;
  details: any;
}

export interface WebhookSettings {
  url: string;
  format: 'json' | 'form';
  enabled: boolean;
}

/**
 * Wire format the quote flow POSTs to /api/quote once the debit order is authorised.
 * Prices are deliberately absent: the server recomputes them from the plan, species and add-on.
 * The full account number is for the team notification only; the customer's copy masks it.
 */
export interface ApplicationRequest {
  reference: string;
  planId: string;
  routineCare: boolean;
  authorise: boolean;
  email: string;
  pet: {
    name: string;
    species: string;
    breed: string;
    gender: string;
    colour: string;
    weight: string;
    dob: string;
    chipNo: string;
  };
  health: {
    conditions: string;
    additional: string;
    vaccinations: string;
    commercial: string;
    vetPermission: string;
  };
  banking: {
    accHolder: string;
    bank: string;
    accNo: string;
    debitDay: string;
  };
}

/**
 * CMS Content Schema
 * Defines all editable regions across the application
 */
export interface CMSContent {
  hero: {
    badge: string;
    title_1: string;
    title_2: string;
    title_3: string;
    description: string;
    cta_primary: string;
    cta_secondary: string;
    main_image: string;
    price_val: string;
    price_label: string;
  };
  about: {
    hero_title: string;
    hero_subtitle: string;
    philosophy_title: string;
    philosophy_text: string;
    founder_quote: string;
    founder_name: string;
  };
  global: {
    contact_email: string;
    contact_phone: string;
    office_location: string;
  };
}
