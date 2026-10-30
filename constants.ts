
import { PetPlan, FAQItem, Testimonial } from './types';

export const PET_PLANS: PetPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    caption: 'Consultation Only - Non-hospital costs',
    priceDog: 95,
    priceCat: 95,
    featured: false,
    annualLimit: 'R15,000',
    excess: '10% minimum R500',
    waitingPeriod: '31 Days',
    features: [
      'Consultation Only cover',
      'Non-hospital related treatment',
      'No Microchip Required',
      '8 weeks to 9 years age',
      'Vet of own choice',
      'Prompt claim settlements'
    ]
  },
  {
    id: 'accident',
    name: 'Accident Only',
    caption: 'Accident Only Medical Expenses',
    priceDog: 214.73,
    priceCat: 179.76,
    featured: false,
    annualLimit: 'R25,000',
    excess: '10% minimum R500',
    waitingPeriod: 'N/A for Accidents',
    features: [
      'Accident Only Medical Expenses',
      'Direct payment to Vets',
      'No Microchip Required',
      '8 weeks to 9 years age',
      'No Breed Exclusions',
      'Third Party Liability'
    ]
  },
  {
    id: 'hospital',
    name: 'Hospital Only',
    caption: 'Accident & Illness In-hospital Only',
    priceDog: 305.20,
    priceCat: 256.80,
    featured: false,
    annualLimit: 'R35,000',
    excess: '10% minimum R500',
    waitingPeriod: '31 Days',
    features: [
      'Accident and Illness In-hospital',
      'Emergency Treatment Cover',
      'Pre-hospital consultation cover',
      '12 Month Pre-existing wait',
      'Routine Care Option',
      'Double Up Available'
    ]
  },
  {
    id: 'comp',
    name: 'Comprehensive Only',
    caption: 'Accident and Illness Medical Expenses',
    priceDog: 386.40,
    priceCat: 315.65,
    featured: true,
    annualLimit: 'R40,000',
    excess: '10% minimum R500',
    waitingPeriod: '31 Days',
    features: [
      'Full Accident and Illness cover',
      'Our Most Popular Plan',
      'In-hospital Medical Expenses',
      'Chronic Medication Cover',
      '12 Month Pre-existing wait',
      'Direct payment to Vets'
    ]
  },
  {
    id: 'comp-plus',
    name: 'Comprehensive+',
    caption: 'Accident, Illness & Extended Cover',
    priceDog: 448.00,
    priceCat: 342.40,
    featured: false,
    annualLimit: 'R45,000',
    excess: '10% minimum R500',
    waitingPeriod: '31 Days',
    features: [
      'Highest Annual Limits',
      'Alternative/Dental/Boarding',
      'Missing or Stolen Pet cover',
      'Prescription Diet included',
      'Death/Condolence Benefit',
      'Specialist Treatments'
    ]
  }
];

export const ROUTINE_CARE_PRICE = 85;
export const ROUTINE_CARE_ANNUAL_VALUE = 1500;
export const ROUTINE_CARE_ITEMS = [
  'Sterilisation', 'Vaccinations', 'De-worming',
  'Grooming', 'Tick/Flea Control', 'Anal Gland Exp',
  'Dental Polish', 'Microchipping', 'Annual Checkup'
];

export const FAQS: FAQItem[] = [
  {
    question: "How many family members (pets) can you cover?",
    answer: "You can cover as many family members (pets) as you can. We offer a 10% multi-pet discount for 2 or more pets on the same policy!"
  },
  {
    question: "What hospitals does this medical insurance cover?",
    answer: "You can go to any private hospital in South Africa. Our network is extensive and designed for your convenience."
  },
  {
    question: "My GP is not on your network, now what can you do?",
    answer: "Send us your GP details and we will negotiate with them so they can become part of the network."
  },
  {
    question: "Is there an age limit for pets?",
    answer: "Yes, we cover pets from 8 weeks up to 9 years of age. Once covered, they remain covered for their lifetime."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Jackie",
    role: "Day-to-Day Patient",
    stars: 5,
    text: "Your prompt replies and the professional, polite way you dealt with me is honourable. WELL DONE!"
  },
  {
    name: "Siphesilisiwe",
    role: "Recently Hospitalised",
    stars: 5,
    text: "My experience with Petcovered® has been very positive. Chantelle & Zelda their consultants are always helpful."
  },
  {
    name: "Jeandrik",
    role: "Online Applicant",
    stars: 5,
    text: "I did my application online and I had a very quick response. Bradford helped me with amazing service. I will promote Petcovered® everywhere!"
  }
];
