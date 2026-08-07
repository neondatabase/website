/**
 * Pure logic for the AI Gateway model catalog published at /models.json.
 *
 * `src/app/models.json/data.json` is the source of truth for that catalog: it is
 * authored and reviewed here, not derived from anywhere else. The `neon` provider
 * on models.dev is a downstream mirror we keep in sync, which is why drift is
 * classified by direction rather than reported as a single equality failure.
 *
 * Kept free of I/O so both the sync check and the offline validator can use it,
 * and so the classification rules can be tested without a network.
 */

/** Fields the two catalogs are expected to agree on. Everything else is shape. */
export const COMPARE_KEYS = [
  'name',
  'family',
  'attachment',
  'reasoning',
  'reasoning_options',
  'tool_call',
  'temperature',
  'structured_output',
  'open_weights',
  'knowledge',
  'release_date',
  'last_updated',
  'modalities',
  'limit',
  'cost',
  'status',
];

const BOOLEAN_KEYS = ['attachment', 'reasoning', 'tool_call', 'temperature', 'open_weights'];
const DATE_KEYS = ['release_date', 'last_updated', 'knowledge'];
const ISO_DATE = /^\d{4}-\d{2}(-\d{2})?$/;

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canonical(value[key]);
    return out;
  }
  return value;
}

function comparable(model) {
  const picked = {};
  for (const key of COMPARE_KEYS) if (model[key] !== undefined) picked[key] = model[key];
  return canonical(picked);
}

/**
 * Classify how the mirror differs from the catalog we publish.
 *
 * Direction is the whole point. We ship a model here first and open the upstream
 * PR afterwards, so a model we have and models.dev does not is the normal state
 * of an in-flight change, not a fault. The reverse is not: if models.dev lists a
 * `neon` model our own catalog does not, it is advertising something we may not
 * serve, and whoever reads it acts on that.
 *
 * A field that differs cannot be attributed to either side from a comparison
 * alone — we may have corrected a price, or upstream may have edited our entry —
 * so it is reported for review rather than blamed.
 */
export function classifyDrift(website, modelsDev) {
  const ours = new Set(Object.keys(website));
  const theirs = new Set(Object.keys(modelsDev));

  const awaitingUpstream = [...ours].filter((id) => !theirs.has(id)).sort();
  const missingFromWebsite = [...theirs].filter((id) => !ours.has(id)).sort();

  const fieldDrift = [];
  for (const id of [...ours].filter((x) => theirs.has(x)).sort()) {
    const w = comparable(website[id]);
    const m = comparable(modelsDev[id]);
    if (JSON.stringify(w) === JSON.stringify(m)) continue;
    const fields = [];
    for (const key of [...new Set([...Object.keys(w), ...Object.keys(m)])].sort()) {
      if (JSON.stringify(w[key]) !== JSON.stringify(m[key])) {
        fields.push({ field: key, website: w[key], modelsDev: m[key] });
      }
    }
    fieldDrift.push({ id, fields });
  }

  return {
    awaitingUpstream,
    missingFromWebsite,
    fieldDrift,
    inSync:
      awaitingUpstream.length === 0 && missingFromWebsite.length === 0 && fieldDrift.length === 0,
    /** Expected while an upstream PR is open. Reported, never failed on. */
    hasSyncDebt: awaitingUpstream.length > 0 || fieldDrift.length > 0,
    /** models.dev advertises a Neon model we do not publish. Always a fault. */
    hasFault: missingFromWebsite.length > 0,
  };
}

/**
 * Validate the authored catalog.
 *
 * Nothing generates this file any more, so nothing else guarantees its shape.
 * The checks are the invariants every consumer already assumes — `/models.json`,
 * `/models`, the docs model index, and the generated per-model markdown — stated
 * once here instead of each reader defaulting around a missing value.
 *
 * Deliberately not required: `cost`, `knowledge`, `structured_output`. Real
 * entries legitimately omit them, and demanding them would force a placeholder,
 * which is worse than an absent field.
 */
export function validateCatalog(data) {
  const errors = [];
  const fail = (msg) => errors.push(msg);

  const neon = data?.neon;
  if (!neon || typeof neon !== 'object') {
    fail('missing the top-level `neon` provider object');
    return errors;
  }
  for (const key of ['id', 'name', 'api', 'env', 'doc']) {
    if (neon[key] === undefined) fail(`neon.${key} is missing`);
  }
  const models = neon.models;
  if (!models || typeof models !== 'object' || Array.isArray(models)) {
    fail('neon.models is not an object');
    return errors;
  }
  if (Object.keys(models).length === 0) {
    fail('neon.models is empty');
    return errors;
  }

  for (const [key, model] of Object.entries(models)) {
    const at = (field) => `${key}.${field}`;
    if (!model || typeof model !== 'object') {
      fail(`${key} is not an object`);
      continue;
    }
    if (model.id !== key) fail(`${at('id')} is ${JSON.stringify(model.id)}, expected ${key}`);

    for (const field of ['name', 'provider', 'family']) {
      if (typeof model[field] !== 'string' || model[field].trim() === '') {
        fail(`${at(field)} must be a non-empty string`);
      }
    }
    for (const field of BOOLEAN_KEYS) {
      if (model[field] !== undefined && typeof model[field] !== 'boolean') {
        fail(`${at(field)} must be a boolean`);
      }
    }
    for (const field of DATE_KEYS) {
      if (model[field] !== undefined && !ISO_DATE.test(String(model[field]))) {
        fail(`${at(field)} must be YYYY-MM-DD, got ${JSON.stringify(model[field])}`);
      }
    }

    if (model.modalities !== undefined) {
      for (const side of ['input', 'output']) {
        const list = model.modalities?.[side];
        if (!Array.isArray(list) || list.some((x) => typeof x !== 'string')) {
          fail(`${at(`modalities.${side}`)} must be an array of strings`);
        }
      }
    }

    if (model.limit !== undefined) {
      for (const [field, value] of Object.entries(model.limit)) {
        if (!Number.isInteger(value) || value <= 0) {
          fail(`${at(`limit.${field}`)} must be a positive integer, got ${JSON.stringify(value)}`);
        }
      }
    }

    if (model.cost !== undefined) errors.push(...costErrors(model.cost, at('cost')));

    if (model.reasoning_options !== undefined) {
      if (!Array.isArray(model.reasoning_options)) {
        fail(`${at('reasoning_options')} must be an array`);
      } else {
        model.reasoning_options.forEach((opt, i) => {
          if (!opt || typeof opt.type !== 'string') {
            fail(`${at(`reasoning_options[${i}]`)} needs a string \`type\``);
          } else if (opt.type === 'effort' && !Array.isArray(opt.values)) {
            fail(`${at(`reasoning_options[${i}]`)} is an effort option without \`values\``);
          }
        });
      }
      if (model.reasoning !== true) {
        fail(`${at('reasoning_options')} is set but ${at('reasoning')} is not true`);
      }
    }
  }

  return errors;
}

function costErrors(cost, at) {
  const errors = [];
  if (!cost || typeof cost !== 'object') return [`${at} must be an object`];
  for (const [field, value] of Object.entries(cost)) {
    if (field === 'tiers') {
      if (!Array.isArray(value)) {
        errors.push(`${at}.tiers must be an array`);
        continue;
      }
      value.forEach((tier, i) => errors.push(...costErrors(stripTier(tier), `${at}.tiers[${i}]`)));
      continue;
    }
    // `context_over_200k` and friends are nested rate objects, not rates.
    if (value && typeof value === 'object') {
      errors.push(...costErrors(value, `${at}.${field}`));
      continue;
    }
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      errors.push(`${at}.${field} must be a non-negative number, got ${JSON.stringify(value)}`);
    }
  }
  return errors;
}

// A tier carries its own `tier` descriptor alongside the rates; the descriptor
// is metadata (type, size), not a price, so it is not rate-checked.
function stripTier(tier) {
  if (!tier || typeof tier !== 'object') return tier;
  const { tier: _descriptor, ...rates } = tier;
  return rates;
}
