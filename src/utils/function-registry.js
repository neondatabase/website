export const REGISTRY_SOURCE_BASE =
  'https://raw.githubusercontent.com/neondatabase/examples/main/registry/';
export const REGISTRY_CACHE_SECONDS = 3600;

const JSON_TYPE = 'application/json; charset=utf-8';

// Catalog and schemas only. Anything else 404s before GitHub is contacted.
const ALLOWED = new Map([
  ['registry.json', JSON_TYPE],
  ['schemas/registry.schema.json', JSON_TYPE],
  ['schemas/template.schema.json', JSON_TYPE],
]);

export const resolveRegistryPath = (segments) => {
  if (!Array.isArray(segments) || segments.length === 0) return null;
  if (!segments.every((segment) => typeof segment === 'string')) return null;
  const path = segments.join('/');
  const contentType = ALLOWED.get(path);
  if (!contentType) return null;
  return { path, contentType };
};

export const registrySourceUrl = (path) => new URL(path, REGISTRY_SOURCE_BASE).href;
