// Maps the Neon AI Gateway models listing (GET /v1/models) to the entry shape of
// src/app/models.json/data.json. Fields the listing can't supply (`last_updated`,
// `cost.input_audio`) are carried over from the committed entry.

export const DEFAULT_TIMEOUT_MS = 15000;

const MODALITY = { file: 'pdf' };

export async function fetchAiGatewayModels({
  baseUrl,
  token,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  const res = await fetchImpl(`${baseUrl.replace(/\/+$/, '')}/v1/models`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`AI Gateway models fetch failed: ${res.status} ${res.statusText}`);
  const body = await res.json();
  if (!Array.isArray(body?.data)) throw new Error('AI Gateway models response has no data[]');
  return body.data;
}

// USD-per-token decimal string -> USD per 1M tokens, shifted as a string so
// "0.0000002" becomes 0.2 rather than 0.19999999999999998.
function perMillion(value) {
  const str = String(value);
  if (!/^\d+(\.\d+)?$/.test(str)) throw new Error(`Unexpected price: ${str}`);
  const [int, frac = ''] = str.split('.');
  const digits = frac.padEnd(6, '0');
  const whole = `${int}${digits.slice(0, 6)}`.replace(/^0+(?=\d)/, '');
  const rest = digits.slice(6).replace(/0+$/, '');
  return Number(rest ? `${whole}.${rest}` : whole);
}

function rates(pricing) {
  const out = {};
  if (pricing.prompt != null) out.input = perMillion(pricing.prompt);
  if (pricing.completion != null) out.output = perMillion(pricing.completion);
  if (pricing.input_cache_read != null) out.cache_read = perMillion(pricing.input_cache_read);
  if (pricing.input_cache_write != null) out.cache_write = perMillion(pricing.input_cache_write);
  return out;
}

function toCost(item, committedCost = {}) {
  const cost = rates(item.pricing);
  if (item.model_type === 'embedding') delete cost.output;
  if (committedCost.input_audio != null) cost.input_audio = committedCost.input_audio;
  const overrides = item.pricing.overrides ?? [];
  if (overrides.length) {
    cost.tiers = overrides.map((o) => ({
      ...rates(o),
      tier: { type: 'context', size: o.min_prompt_tokens },
    }));
    cost.context_over_200k = rates(overrides[0]);
  }
  return cost;
}

export function toCatalogEntry(item, committedEntry = {}) {
  const entry = {
    id: item.id,
    name: item.name,
    provider: item.owned_by,
    family: item.family,
    released: true,
  };
  const lastUpdated = committedEntry.last_updated ?? item.release_date;
  const f = item.features;

  if (item.model_type === 'embedding') {
    return {
      ...entry,
      type: 'embedding',
      dimensions: item.dimensions,
      open_weights: f.open_weights,
      release_date: item.release_date,
      last_updated: lastUpdated,
      cost: toCost(item, committedEntry.cost),
    };
  }

  entry.attachment = f.attachment;
  entry.reasoning = f.reasoning;
  if (item.reasoning_options?.length) entry.reasoning_options = item.reasoning_options;
  entry.tool_call = f.tool_call;
  entry.temperature = f.temperature;
  entry.structured_output = f.structured_output;
  entry.open_weights = f.open_weights;
  if (item.knowledge_cutoff) entry.knowledge = item.knowledge_cutoff;
  entry.release_date = item.release_date;
  entry.last_updated = lastUpdated;
  entry.modalities = {
    input: item.architecture.input_modalities.map((m) => MODALITY[m] ?? m),
    output: item.architecture.output_modalities,
  };
  entry.limit = { context: item.context_length };
  if (item.max_input_tokens && item.max_input_tokens !== item.context_length) {
    entry.limit.input = item.max_input_tokens;
  }
  entry.limit.output = item.max_tokens;
  entry.cost = toCost(item, committedEntry.cost);
  return entry;
}

// Committed ids keep their position; ids new to the listing are appended in
// listing order; ids the listing no longer has are dropped.
export function buildCatalog(items, committedCatalog) {
  const committedModels = committedCatalog.neon.models;
  const byId = new Map(items.map((item) => [item.id, item]));
  const ids = [
    ...Object.keys(committedModels).filter((id) => byId.has(id)),
    ...items.map((item) => item.id).filter((id) => !(id in committedModels)),
  ];
  const models = {};
  for (const id of ids) models[id] = toCatalogEntry(byId.get(id), committedModels[id]);
  return { ...committedCatalog, neon: { ...committedCatalog.neon, models } };
}
