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

const BOOLEAN_KEYS = [
  'attachment',
  'reasoning',
  'tool_call',
  'temperature',
  'open_weights',
  'structured_output',
];
const DATE_KEYS = ['release_date', 'last_updated', 'knowledge'];
const ISO_DATE = /^\d{4}-\d{2}(-\d{2})?$/;
/** Rate keys a `[cost]` block may carry, besides the `tiers` array. */
const COST_RATE_KEYS = new Set([
  'input',
  'output',
  'cache_read',
  'cache_write',
  'input_audio',
  'output_audio',
  'reasoning',
]);

const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

// A regex accepts 2026-02-31. Round-tripping through Date does not.
function isRealDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const parts = value.split('-').map(Number);
  const [y, m, d] = [parts[0], parts[1], parts[2] ?? 1];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

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
    if (key.trim() === '') fail('a model is keyed by an empty string');
    if (!isPlainObject(model)) {
      fail(`${key} is not an object`);
      continue;
    }
    if (model.id !== key) fail(`${at('id')} is ${JSON.stringify(model.id)}, expected ${key}`);

    for (const field of ['id', 'name', 'provider', 'family']) {
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
      if (model[field] !== undefined && !isRealDate(model[field])) {
        fail(`${at(field)} must be a real YYYY-MM-DD date, got ${JSON.stringify(model[field])}`);
      }
    }

    if (model.modalities !== undefined) {
      if (!isPlainObject(model.modalities)) {
        fail(`${at('modalities')} must be an object`);
      } else {
        for (const side of ['input', 'output']) {
          const list = model.modalities[side];
          if (!Array.isArray(list) || list.some((x) => typeof x !== 'string')) {
            fail(`${at(`modalities.${side}`)} must be an array of strings`);
          }
        }
      }
    }

    if (model.limit !== undefined) {
      if (!isPlainObject(model.limit)) {
        fail(`${at('limit')} must be an object`);
      } else {
        for (const [field, value] of Object.entries(model.limit)) {
          if (!Number.isInteger(value) || value <= 0) {
            fail(
              `${at(`limit.${field}`)} must be a positive integer, got ${JSON.stringify(value)}`
            );
          }
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

/**
 * A `[cost]` block, or one of the nested rate objects inside it.
 *
 * An empty block is rejected rather than tolerated: a model whose price is not
 * known omits `cost` entirely, and `{}` would render as a price of nothing.
 */
function costErrors(cost, at, { requireRates = true } = {}) {
  const errors = [];
  if (!isPlainObject(cost)) return [`${at} must be an object`];

  const rateKeys = Object.keys(cost).filter((k) => k !== 'tiers');
  if (requireRates && (typeof cost.input !== 'number' || typeof cost.output !== 'number')) {
    errors.push(`${at} needs both an input and an output rate; omit cost entirely if unknown`);
  }

  for (const field of rateKeys) {
    const value = cost[field];
    // `context_over_200k` and friends are nested rate objects, not rates.
    if (isPlainObject(value)) {
      errors.push(...costErrors(value, `${at}.${field}`, { requireRates: false }));
      continue;
    }
    if (!COST_RATE_KEYS.has(field)) {
      errors.push(`${at}.${field} is not a known rate; add it to COST_RATE_KEYS if it is real`);
      continue;
    }
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      errors.push(`${at}.${field} must be a non-negative number, got ${JSON.stringify(value)}`);
    }
  }

  if (cost.tiers !== undefined) {
    if (!Array.isArray(cost.tiers)) {
      errors.push(`${at}.tiers must be an array`);
    } else {
      const seen = new Set();
      cost.tiers.forEach((tier, i) => {
        const where = `${at}.tiers[${i}]`;
        if (!isPlainObject(tier)) {
          errors.push(`${where} must be an object`);
          return;
        }
        // The descriptor sits alongside the rates but is metadata, so it is
        // checked as metadata rather than rate-checked — `size` is a token
        // count, not a price.
        const { tier: descriptor, ...rates } = tier;
        if (!isPlainObject(descriptor)) {
          errors.push(`${where}.tier must be an object describing when the rate applies`);
        } else {
          if (typeof descriptor.type !== 'string' || descriptor.type.trim() === '') {
            errors.push(`${where}.tier.type must be a non-empty string`);
          }
          if (!Number.isInteger(descriptor.size) || descriptor.size <= 0) {
            errors.push(`${where}.tier.size must be a positive integer`);
          }
          const fingerprint = `${descriptor.type}:${descriptor.size}`;
          if (seen.has(fingerprint)) errors.push(`${at}.tiers has two entries for ${fingerprint}`);
          seen.add(fingerprint);
        }
        errors.push(...costErrors(rates, where, { requireRates: false }));
      });
    }
  }

  return errors;
}
