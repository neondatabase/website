import catalog from '../models.json/data.json';

import capabilities from './capabilities.json';
import {
  DEFAULT_USE_CASE,
  USE_CASES,
  resolveAll,
  resolveModel,
  servedModelIds,
} from './resolve.js';

// Must be dynamic: under 'force-static' Next prerenders the handler once and
// `request.nextUrl.searchParams` is always empty, so ?model= and ?use_case= are silently
// ignored. The Cache-Control header below still lets the CDN cache each query string.
export const dynamic = 'force-dynamic';

const SCHEMA = 'https://neon.com/schemas/ai-gateway-models.json';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      // Public catalog data; same policy Vercel already applies to the static /models.json sibling.
      'Access-Control-Allow-Origin': '*',
    },
  });

// Neon AI Gateway models as a REST resource, served at /models.
//
// Sibling of /models.json, and deliberately a different thing. /models.json mirrors the
// models.dev schema so anything that reads models.dev can read it unchanged. /models answers the
// question a developer actually has — "what do I paste to use this model?" — by pairing each
// model with the code examples that work for it.
//
// Support is not uniform: 7 of 21 models return a non-conforming chat completions body, only
// Gemini has a native dialect, codex is Responses-only, and image generation and web search are
// served for the gpt-5 family alone. Those facts are measured against the live gateway and
// committed in ./capabilities.json, and they decide which examples each model gets. A model that
// cannot do the requested use case returns `unsupported` with an empty `examples` array rather
// than examples that would fail.
//
//   /models                                          every model, chat examples
//   /models?use_case=web-search                      every model, web search examples
//   /models?model=gpt-5-4-mini                       one model, chat examples
//   /models?model=gpt-5-4-mini&use_case=image-generation
//
// Core model data comes from the same ./models.json/data.json this site already serves, so the
// two endpoints cannot drift on the facts they share. CI enforces that — see
// src/scripts/check-models-endpoint-sync.js.
export function GET(request) {
  const { searchParams } = request.nextUrl;

  const useCase = searchParams.get('use_case') ?? DEFAULT_USE_CASE;
  if (!USE_CASES.includes(useCase)) {
    return json({ error: `Unknown use_case "${useCase}"`, supported: USE_CASES }, 400);
  }

  const modelId = searchParams.get('model');
  if (modelId) {
    const model = resolveModel(catalog, capabilities, modelId, useCase);
    if (!model) {
      return json(
        { error: `Unknown model "${modelId}"`, supported: servedModelIds(capabilities) },
        404
      );
    }
    return json({ $schema: SCHEMA, probed_at: capabilities.probedAt, use_case: useCase, model });
  }

  const models = resolveAll(catalog, capabilities, useCase);
  return json({
    $schema: SCHEMA,
    probed_at: capabilities.probedAt,
    use_case: useCase,
    total: models.length,
    models,
  });
}
