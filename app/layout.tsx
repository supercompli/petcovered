import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Petcovered | Affordable Pet Health Insurance',
  description: 'Affordable pet health insurance for South African pet owners.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
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
