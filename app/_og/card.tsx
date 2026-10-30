// Shared 1200x630 social card, rendered by opengraph-image.tsx and twitter-image.tsx.
// Satori (next/og) only supports a flexbox subset of CSS, so every multi-child div sets display: 'flex'.

const PRIMARY = '#a94694';
const DARK = '#0c161c';

const WORDMARK = { bold: 'Pet', medium: 'covered' };
const TAGLINE = 'Affordable pet health insurance for South African pet owners.';
const DOMAIN = 'petcovered.co.za';

const SHIELD = 'M24 3L41 9.5V23C41 33.5 34 41.5 24 45C14 41.5 7 33.5 7 23V9.5L24 3Z';
const CHECK = 'M15.5 24.5L21.5 30.5L33 18';

async function loadGoogleFont(weight: number): Promise<ArrayBuffer> {
  const text = `${WORDMARK.bold}${WORDMARK.medium}${TAGLINE}${DOMAIN}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=DM+Sans:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  // Satori can't read woff2; without a browser UA the API serves a TTF.
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!src) throw new Error(`No TTF source in Google Fonts CSS for DM Sans ${weight}`);
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error(`DM Sans ${weight} download failed (${res.status})`);
  return res.arrayBuffer();
}

export async function loadOgFonts() {
  try {
    const [bold, medium] = await Promise.all([loadGoogleFont(700), loadGoogleFont(500)]);
    return [
      { name: 'DM Sans', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'DM Sans', data: medium, weight: 500 as const, style: 'normal' as const },
    ];
  } catch (err) {
    console.warn('[og] DM Sans unavailable, falling back to the default OG font:', err);
    return undefined;
  }
}

const Badge = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="badge" x1="8" y1="3" x2="40" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c05aab" />
        <stop offset="1" stopColor={PRIMARY} />
      </linearGradient>
    </defs>
    <path d={SHIELD} fill="url(#badge)" />
    <path d={CHECK} stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function OgCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'DM Sans',
        backgroundColor: DARK,
        backgroundImage: `radial-gradient(circle at 88% 10%, rgba(169,70,148,0.55) 0%, rgba(169,70,148,0) 55%), linear-gradient(135deg, ${DARK} 0%, #1b1130 100%)`,
      }}
    >
      {/* Oversized outline badge bleeding off the bottom-right corner */}
      <svg
        width="470"
        height="470"
        viewBox="0 0 48 48"
        fill="none"
        style={{ position: 'absolute', right: -70, bottom: -100, opacity: 0.16 }}
      >
        <path d={SHIELD} fill={PRIMARY} stroke="#fff" strokeWidth="0.6" strokeLinejoin="round" />
        <path d={CHECK} stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Badge size={104} />
          <div style={{ display: 'flex', fontSize: 84, color: '#fff', lineHeight: 1, letterSpacing: -3 }}>
            <span style={{ fontWeight: 700 }}>{WORDMARK.bold}</span>
            <span style={{ fontWeight: 500 }}>{WORDMARK.medium}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            maxWidth: 820,
            fontSize: 54,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: -1,
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          {TAGLINE}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 14,
            padding: '14px 30px',
            borderRadius: 999,
            border: '2px solid rgba(255,255,255,0.22)',
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: '#fff',
            fontSize: 30,
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 999, backgroundColor: PRIMARY }} />
          {DOMAIN}
        </div>
      </div>
    </div>
  );
}
