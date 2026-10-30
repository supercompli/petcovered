import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://petcovered.co.za'),
  title: 'Petcovered | Affordable Pet Health Insurance',
  description: 'Affordable pet health insurance for South African pet owners.',
  applicationName: 'Petcovered',
  category: 'finance',
  keywords: [
    'pet insurance South Africa',
    'dog insurance',
    'cat insurance',
    'affordable pet health insurance',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://petcovered.co.za/',
    siteName: 'Petcovered',
    title: 'Petcovered | Affordable Pet Health Insurance',
    description: 'Affordable pet health insurance for South African pet owners.',
    locale: 'en_ZA',
    images: [{
      url: '/Affordable%20Pet%20Insurance%20for%20South%20Africans.png',
      width: 1731,
      height: 909,
      alt: 'Petcovered: affordable pet health insurance for South African pet owners',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Petcovered | Affordable Pet Health Insurance',
    description: 'Affordable pet health insurance for South African pet owners.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

// One typed JSON-LD block per entity (rather than an untyped @graph wrapper); they link up via @id.
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://petcovered.co.za/#organization',
    name: 'Petcovered',
    url: 'https://petcovered.co.za/',
    logo: 'https://petcovered.co.za/Affordable%20Pet%20Insurance%20for%20South%20Africans.png',
    email: 'hello@petcovered.co.za',
    description: 'Affordable pet health insurance for South African pet owners.',
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@petcovered.co.za',
      availableLanguage: ['en'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': 'https://petcovered.co.za/#insurance-agency',
    name: 'Petcovered',
    url: 'https://petcovered.co.za/',
    description: 'Pet health insurance plans for dogs and cats in South Africa.',
    parentOrganization: {
      '@id': 'https://petcovered.co.za/#organization',
    },
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://petcovered.co.za/#website',
    url: 'https://petcovered.co.za/',
    name: 'Petcovered',
    description: 'Affordable pet health insurance for South African pet owners.',
    publisher: {
      '@id': 'https://petcovered.co.za/#organization',
    },
    inLanguage: 'en-ZA',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {structuredData.map((entity) => (
          <script
            key={entity['@id']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
          />
        ))}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PNWDY56WQF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PNWDY56WQF');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
