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
// ./data.json is refreshed at build time from the Neon AI Gateway's
// GET /v1/models (scripts/update-models-from-ai-gateway.mjs); the committed copy
// is the fallback when the gateway is unset or unreachable, and the place for
// fields the gateway lacks (`released`, `last_updated`, `cost.input_audio`). The
// `neon` provider on models.dev is a mirror kept in sync afterwards. Served at
// /models.json.
export function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
