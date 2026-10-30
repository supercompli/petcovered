import App from '../../App';

interface QuoteRouteProps {
  searchParams: Promise<{
    plan?: string;
  }>;
}

export default async function QuoteRoute({ searchParams }: QuoteRouteProps) {
  const { plan } = await searchParams;

  return <App initialView="quote" initialPlanId={plan ?? null} />;
}
