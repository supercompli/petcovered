import type { Metadata } from 'next';
import App from '../../App';

// robots.txt only disallows "/admin/", so the bare "/admin" URL needs an explicit noindex.
export const metadata: Metadata = {
  title: 'Admin | Petcovered',
  alternates: { canonical: '/admin' },
  robots: { index: false, follow: false },
};

export default function AdminRoute() {
  return <App initialView="admin" />;
}
