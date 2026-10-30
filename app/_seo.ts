import type { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

const IMAGE_ALT = 'Petcovered: affordable & convenient pet health insurance for pet owners';
const IMAGE_SIZE = { width: 1200, height: 630 };
const OPEN_GRAPH_IMAGE = '/affordable-pet-insurance-new.png';

// A page's own openGraph/twitter objects replace the layout's wholesale, so each page restates both here.
export function pageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      siteName: 'Petcovered',
      title,
      description,
      locale: 'en_ZA',
      images: [{ url: OPEN_GRAPH_IMAGE, ...IMAGE_SIZE, alt: IMAGE_ALT }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: OPEN_GRAPH_IMAGE, ...IMAGE_SIZE, alt: IMAGE_ALT }],
    },
  };
}
