import App from '../../App';
import { pageMetadata } from '../_seo';

export const metadata = pageMetadata({
  title: 'Get a Pet Insurance Quote | Petcovered',
  description: 'Get a pet health insurance quote from Petcovered in about two minutes.',
  path: '/quote',
});

interface QuoteRouteProps {
  searchParams: Promise<{
    plan?: string;
  }>;
}

export default async function QuoteRoute({ searchParams }: QuoteRouteProps) {
  const { plan } = await searchParams;

  return <App initialView="quote" initialPlanId={plan ?? null} />;
}
