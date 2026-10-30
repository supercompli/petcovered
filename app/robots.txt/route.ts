const robotsTxt = `# Petcovered robots policy
# Content-signal: ai-train=yes, search=yes, ai-input=yes

User-agent: *
Allow: /
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: https://petcovered.co.za/sitemap.xml
`;

export function GET() {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Signal': 'ai-train=yes, search=yes, ai-input=yes',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
