// Loader + validator for scripts/data/tag-config.json — the single source of
// truth for API tag metadata: tag order, display names, descriptions, URL
// slugs, editorial groups, and operation overrides.
//
// The JSON shape:
//   {
//     "tags": [
//       { "slug", "specName", "display", "description"?, "groups"? },
//       ...
//     ],
//     "operationOverrides": { "operationId": "tag-slug" }
//   }
//
// Array order is significant — it drives the sidebar/navigation order.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = resolve(HERE, '../../scripts/data/tag-config.json');

let _cache = null;

function readRaw() {
  if (_cache) return _cache;
  _cache = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  return _cache;
}

// Returns the parsed config, optionally extended against a live spec schema.
// When specSchema is provided, any spec tags not in the config are auto-injected
// as minimal entries (warn-only) so the build proceeds. Add proper entries to
// scripts/data/tag-config.json to control order, description, and groups.
export function loadTagConfig(specSchema = null) {
  const cfg = readRaw();
  validateStatic(cfg);
  if (!specSchema) return buildView(cfg);
  const injected = synthesizeMissingTags(cfg, specSchema);
  if (injected.length === 0) return buildView(cfg);
  return buildView({ ...cfg, tags: [...cfg.tags, ...injected] });
}

// Validate cfg structure that doesn't depend on the spec.
function validateStatic(cfg) {
  if (!Array.isArray(cfg.tags)) throw new Error('[tag-config] tags must be an array');

  const slugSet = new Set();
  const dupes = [];
  for (const tag of cfg.tags) {
    if (!tag.slug) throw new Error(`[tag-config] tag entry missing slug: ${JSON.stringify(tag)}`);
    if (!tag.display) {
      throw new Error(`[tag-config] tag "${tag.slug}" missing display name`);
    }
    if (slugSet.has(tag.slug)) dupes.push(tag.slug);
    slugSet.add(tag.slug);
  }
  if (dupes.length > 0) {
    throw new Error(`[tag-config] duplicate slug(s): ${dupes.join(', ')}`);
  }

  // operationOverrides values must point at existing tags
  for (const [opId, slug] of Object.entries(cfg.operationOverrides ?? {})) {
    if (!slugSet.has(slug)) {
      throw new Error(
        `[tag-config] operationOverrides["${opId}"] = "${slug}" but no tag with that slug exists`
      );
    }
  }

  // Each operation slug in a group must appear in exactly one group across
  // the whole config — catches accidental duplicate listings.
  const groupSlugCount = new Map();
  for (const tag of cfg.tags) {
    for (const group of tag.groups ?? []) {
      for (const slug of group.slugs ?? []) {
        groupSlugCount.set(slug, (groupSlugCount.get(slug) ?? 0) + 1);
      }
    }
  }
  const duped = [...groupSlugCount.entries()].filter(([, n]) => n > 1).map(([s]) => s);
  if (duped.length > 0) {
    throw new Error(
      `[tag-config] operation slug(s) listed in multiple groups: ${duped.join(', ')}`
    );
  }
}

// Detect spec tags not in cfg, warn, and return synthesized minimal entries
// for each. Resolution chain matches buildOperationData in generate-api-ref.mjs:
//   raw spec tag → toTagSlug → specName map → final url slug
function synthesizeMissingTags(cfg, specSchema) {
  const specToSlug = new Map();
  const slugSet = new Set();
  for (const t of cfg.tags) {
    if (t.specName) specToSlug.set(t.specName, t.slug);
    slugSet.add(t.slug);
  }

  const missing = new Set();
  for (const [, pathItem] of Object.entries(specSchema.paths ?? {})) {
    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const op = pathItem[method];
      if (!op?.operationId) continue;
      if (cfg.operationOverrides?.[op.operationId]) continue;
      const specTag = op.tags?.[0];
      if (!specTag) continue;
      const slugFromSpec = toTagSlug(specTag);
      const finalSlug = specToSlug.get(slugFromSpec) ?? slugFromSpec;
      if (!slugSet.has(finalSlug)) missing.add(specTag);
    }
  }

  if (missing.size === 0) return [];

  process.stderr.write(
    `[tag-config] warn: new spec tag(s) not in config: ${[...missing].join(', ')}.\n` +
      `  Auto-generating minimal entries. Add to scripts/data/tag-config.json\n` +
      `  to control display order, description, and operation groups.\n`
  );

  return [...missing].map((specTag) => ({
    slug: toTagSlug(specTag),
    specName: toTagSlug(specTag),
    display: specTag,
  }));
}

function toTagSlug(tag) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Build the lookup-friendly view that consumers want. Done once, cached
// (alongside the raw cache) on the assumption a single Node process only
// needs one view.
function buildView(cfg) {
  const tagOrder = cfg.tags.map((t) => t.slug);
  const display = Object.fromEntries(cfg.tags.map((t) => [t.slug, t.display]));
  const descriptions = Object.fromEntries(
    cfg.tags.filter((t) => t.description).map((t) => [t.slug, t.description])
  );
  const specToSlug = Object.fromEntries(
    cfg.tags.filter((t) => t.specName && t.specName !== t.slug).map((t) => [t.specName, t.slug])
  );
  const groups = Object.fromEntries(
    cfg.tags.filter((t) => t.groups).map((t) => [t.slug, { groups: t.groups }])
  );
  return {
    raw: cfg,
    tagOrder,
    display,
    descriptions,
    specToSlug,
    groups,
    operationOverrides: cfg.operationOverrides ?? {},
  };
}
