
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
