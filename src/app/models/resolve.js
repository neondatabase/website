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

/**
 * The catalog entry verbatim, plus what only this endpoint knows.
 *
 * `/models.json` is the catalog and `/models` builds on top of it, so this **adds
 * and never restates**. It used to hand-list sixteen fields, which failed in both
 * directions: `attachment` and `reasoning_options` were simply never listed and so
 * vanished from `/models` entirely, and each listed field carried a `??` fallback
 * that invented a value the catalog had not given. `cost: entry.cost ?? {}` was the
 * one that fired — a model with no price was published as `cost: {}`, which reads as
 * free, and made the two endpoints disagree about the same fact.
 *
 * Spreading also removes the reason they could drift: a field added to the catalog
 * now appears here without anyone remembering to add it.
 *
 * The other six fallbacks were dead. `validateCatalog` (scripts/lib/models-catalog.mjs)
 * requires id, name, provider, family, attachment, reasoning, tool_call, temperature,
 * modalities, limit, open_weights, release_date and last_updated on every PR, so there
 * is no path on which they were reachable. Note `provider ?? caps.owner` was worse than
 * dead: `provider` is the model's maker and `owner` is whoever hosts it, so the fallback
 * would have substituted "databricks" for "thinkingmachines".
 */
function toModel(id, entry, caps) {
  return {
    ...entry,
    id,
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
