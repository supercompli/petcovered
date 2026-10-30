import App from '../../App';
import { pageMetadata } from '../_seo';

export const metadata = pageMetadata({
  title: 'About Petcovered | Pet Health Insurance in South Africa',
  description: 'Learn about Petcovered and how we make pet health insurance affordable and transparent for South African pet owners.',
  path: '/about',
});

export default function AboutRoute() {
  return <App initialView="about" />;
}
