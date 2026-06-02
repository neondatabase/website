export const dynamic = 'force-static';

const catalog = {
  linkset: [
    {
      anchor: 'https://console.neon.tech/api/v2',
      'service-desc': [
        { href: 'https://neon.com/api_spec/release/v2.json', type: 'application/json' },
      ],
      'service-doc': [{ href: 'https://neon.com/docs/reference/api-reference' }],
    },
  ],
};

export function GET() {
  return new Response(JSON.stringify(catalog), {
    headers: { 'Content-Type': 'application/linkset+json' },
  });
}
