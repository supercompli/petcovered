import type { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

const IMAGE_ALT = 'Petcovered: affordable pet health insurance for South African pet owners';
const IMAGE_SIZE = { width: 1731, height: 909 };
const OPEN_GRAPH_IMAGE = '/Affordable%20Pet%20Insurance%20for%20South%20Africans.png';

// A page's own openGraph/twitter objects replace the layout's wholesale, and the file-based
// opengraph-image/twitter-image are dropped with them, so each page restates both here.
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
      images: [{ url: '/twitter-image', ...IMAGE_SIZE, alt: IMAGE_ALT }],
    },
  };
}
