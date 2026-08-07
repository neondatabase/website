// Joins the models.json catalog with measured gateway capabilities.
//
// models.json says what a model *advertises*; capabilities say what the
// gateway *did* when the model was called. The two disagree often enough that code examples
// cannot be derived from the catalog alone.
//
// Pure on purpose: callers pass the data in. The route imports the JSON, and the CI sync check
// requires it, so neither has to know how the other loads it.

import { buildExamples, USE_CASES } from './examples.js';

export const DEFAULT_USE_CASE = 'chat';
export { USE_CASES };

const blendedCost = (cost) =>
  typeof cost?.input === 'number' && typeof cost?.output === 'number'
    ? Math.round(((3 * cost.input + cost.output) / 4) * 1000) / 1000
    : undefined;

/** models.json fields plus the measured ones. Snake_case is kept so the two line up. */
function toModel(id, entry, caps) {
  return {
    id,
    name: entry.name ?? id,
    provider: entry.provider ?? caps.owner,
    family: entry.family,
    release_date: entry.release_date,
    last_updated: entry.last_updated,
    knowledge: entry.knowledge,
    reasoning: Boolean(entry.reasoning),
    tool_call: Boolean(entry.tool_call),
    structured_output: entry.structured_output,
    temperature: entry.temperature,
    open_weights: entry.open_weights,
    modalities: entry.modalities ?? { input: [], output: [] },
    limit: entry.limit ?? {},
    cost: entry.cost ?? {},
    blended_cost: blendedCost(entry.cost),
    capabilities: {
      entitled: caps.entitled !== false,
      chat: caps.chat,
      deviations: caps.deviations ?? [],
      native_dialect: caps.nativeDialect,
      responses: caps.responses,
      web_search: caps.webSearch,
      image_generation: caps.imageGeneration,
    },
  };
}

/**
 * @param {object} catalog models.json payload (the whole file, with its `neon` key)
 * @param {object} capabilities capabilities.json payload
 * @param {string} id
 * @param {string} useCase
 * @returns {object|null} The model with its examples, or null when the gateway does not serve it.
 */
export function resolveModel(catalog, capabilities, id, useCase = DEFAULT_USE_CASE) {
  const caps = capabilities.models.find((entry) => entry.id === id);
  if (!caps) return null;

  const { examples, unsupported } = buildExamples(id, useCase, caps);
  return {
    ...toModel(id, catalog.neon.models[id] ?? {}, caps),
    use_case: useCase,
    ...(unsupported ? { unsupported } : {}),
    examples,
  };
}

export function resolveAll(catalog, capabilities, useCase = DEFAULT_USE_CASE) {
  return capabilities.models.map((caps) => resolveModel(catalog, capabilities, caps.id, useCase));
}

export const servedModelIds = (capabilities) => capabilities.models.map((entry) => entry.id);
