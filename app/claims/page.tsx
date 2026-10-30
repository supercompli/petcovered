import App from '../../App';
import { pageMetadata } from '../_seo';

export const metadata = pageMetadata({
  title: 'How to Claim | Petcovered',
  description: 'A step-by-step guide to making a pet health insurance claim with Petcovered.',
  path: '/claims',
});

export default function ClaimsRoute() {
  return <App initialView="claims" />;
}
