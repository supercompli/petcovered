import { ImageResponse } from 'next/og';
import { OgCard, loadOgFonts } from './_og/card';

export const alt = 'Petcovered: affordable pet health insurance for South African pet owners';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(<OgCard />, { ...size, fonts: await loadOgFonts() });
}
