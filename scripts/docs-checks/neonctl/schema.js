// Loads the committed schema.json (produced by generate-schema.js) and
// exposes helpers for resolving a command path and getting the set of
// valid options at each node.

const fs = require('fs');
const path = require('path');

const DEFAULT_SCHEMA_PATH = path.join(__dirname, 'schema.json');

// Cache by resolved file path so passing a different schema to
// `loadSchema()` actually reloads.
const schemaCache = new Map();

function validateSchemaShape(schema, file) {
  if (!schema || typeof schema !== 'object') {
    throw new Error(`Schema at ${file} is not an object`);
  }
  if (!schema.commands || typeof schema.commands !== 'object') {
    throw new Error(`Schema at ${file} is missing a \`commands\` object`);
  }
  if (schema.globalOptions && typeof schema.globalOptions !== 'object') {
    throw new Error(`Schema at ${file} has a non-object \`globalOptions\``);
  }
}

function loadSchema(file = DEFAULT_SCHEMA_PATH) {
  const abs = path.resolve(file);
  if (schemaCache.has(abs)) return schemaCache.get(abs);
  const raw = fs.readFileSync(abs, 'utf8');
  const schema = JSON.parse(raw);
  validateSchemaShape(schema, abs);
  schemaCache.set(abs, schema);
  return schema;
}

const hasOwn = Object.prototype.hasOwnProperty;

// Convert the schema's `commands` map to a lookup that understands
// top-level aliases (`role` -> `roles`, `cs` -> `connection-string`).
function buildTopAliasMap(schema) {
  const map = new Map();
  for (const [name, node] of Object.entries(schema.commands)) {
    map.set(name, name);
    for (const a of node.aliases || []) map.set(a, name);
  }
  return map;
}

// Within a single parent node, resolve a possibly-aliased subcommand name.
// Uses `hasOwn` so a schema entry named `__proto__` or `constructor` can't
// reach Object.prototype.
function resolveSubcommand(parent, token) {
  if (!parent || !parent.commands) return null;
  if (hasOwn.call(parent.commands, token)) return parent.commands[token];
  for (const node of Object.values(parent.commands)) {
    if ((node.aliases || []).includes(token)) return node;
  }
  return null;
}

// Walk from the root down to the deepest subcommand that matches the
// provided argv tokens. Returns:
//   { node: deepestNode, path: [names], remaining: [...unconsumed] }
// If the first token is not a known command, returns { node: null }.
function resolvePath(schema, argv) {
  const top = buildTopAliasMap(schema);
  if (argv.length === 0) return { node: null, path: [], remaining: argv.slice() };
  const first = argv[0];
  const canonicalFirst = top.get(first);
  if (!canonicalFirst) return { node: null, path: [], remaining: argv.slice() };

  const pathNames = [canonicalFirst];
  let node = hasOwn.call(schema.commands, canonicalFirst) ? schema.commands[canonicalFirst] : null;
  if (!node) return { node: null, path: [], remaining: argv.slice() };
  let i = 1;
  while (i < argv.length) {
    const tok = argv[i];
    // Only consider tokens that look like command names: kebab-case
    // letters, no digits, no uppercase. This keeps positional ids like
    // `vpce-1234567890abcdef0` from being misclassified as subcommands.
    if (!/^[a-z][a-z-]*$/.test(tok) || tok.length > 20) break;
    const next = resolveSubcommand(node, tok);
    if (!next) break;
    node = next;
    pathNames.push(next.name);
    i += 1;
  }
  return { node, path: pathNames, remaining: argv.slice(i) };
}

// Walk the same chain but accumulate ALL options visible at the deepest
// node: globals + every parent's options + the leaf's options. Returns a
// Map keyed by every valid surface form: `--long`, `-short`, `--no-xxx`
// for booleans, to the canonical option spec.
function resolveValidOptions(schema, pathNames) {
  // Use a null-prototype object so malicious keys (__proto__, constructor)
  // can't reach Object.prototype.
  const collected = Object.create(null);
  const merge = (src) => {
    if (!src) return;
    for (const key of Object.keys(src)) {
      if (!hasOwn.call(src, key)) continue;
      collected[key] = src[key];
    }
  };
  merge(schema.globalOptions);
  // Walk down.
  let node = schema;
  for (const name of pathNames) {
    if (!node.commands || !hasOwn.call(node.commands, name)) break;
    const child = node.commands[name];
    merge(child.options);
    node = child;
  }

  const byForm = new Map();
  const register = (form, canonicalName, spec) => {
    byForm.set(form, { name: canonicalName, spec });
  };
  for (const [name, spec] of Object.entries(collected)) {
    register(`--${name}`, name, spec);
    if (spec.type === 'boolean') {
      register(`--no-${name}`, name, spec);
    }
    const alias = spec.alias;
    if (typeof alias === 'string') {
      register(alias.length === 1 ? `-${alias}` : `--${alias}`, name, spec);
      if (spec.type === 'boolean' && alias.length > 1) {
        register(`--no-${alias}`, name, spec);
      }
    } else if (Array.isArray(alias)) {
      for (const a of alias) {
        register(a.length === 1 ? `-${a}` : `--${a}`, name, spec);
        if (spec.type === 'boolean' && a.length > 1) {
          register(`--no-${a}`, name, spec);
        }
      }
    }
  }
  return byForm;
}

module.exports = {
  loadSchema,
  resolvePath,
  resolveValidOptions,
};
