import App from '../../App';
import { pageMetadata } from '../_seo';

export const metadata = pageMetadata({
  title: 'Pet Insurance Plans | Petcovered',
  description: 'Compare Petcovered pet health insurance plans for dogs and cats in South Africa and find the cover that fits your pet and budget.',
  path: '/plans',
});

export default function PlansRoute() {
  return <App initialView="plans" />;
}
