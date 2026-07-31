import data from './data.json';

export const dynamic = 'force-static';

// Neon AI Gateway model catalog — the source of truth for the AI Gateway docs.
//
// The shape mirrors the models.dev API (https://models.dev/api.json): the
// top-level key is the provider id ("neon"), whose `models` map is keyed by the
// gateway catalog model id. Each model carries its underlying `provider`,
// capability flags (`attachment`, `reasoning`, `tool_call`, `temperature`),
// `modalities`, `limit`, and `cost`, so the same code that reads models.dev can
// read this endpoint.
//
// Every entry is live-verified against the Neon AI Gateway (text output +
// image-input + tool-calling probed directly). The data in ./data.json is
// generated from the Neon provider definition in models.dev and committed here
// (like .well-known/ai-catalog.json) so the endpoint stays self-contained.
// Served at /models.json.
export function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
