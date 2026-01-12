
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
