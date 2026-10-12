// Read-through for the Neon Function Registry catalog, served at
// https://neon.com/functions/registry/<path>, the way /bootstrap/templates.yaml
// serves the `neon bootstrap` manifest. `neon functions templates list` fetches
// registry.json here. Installing a template downloads the examples tarball from
// GitHub and extracts registry/<id>/; this route does not serve modules.
//
// The source of truth is neondatabase/examples/registry on `main`. The route
// caches each file for an hour, so a merge there goes live within ~1h with no
// website redeploy.

export const REGISTRY_SOURCE_BASE =
  'https://raw.githubusercontent.com/neondatabase/examples/main/registry/';
export const REGISTRY_CACHE_SECONDS = 3600;

const JSON_TYPE = 'application/json; charset=utf-8';

// Catalog and schemas only. Loose .ts files, README, and anything else 404
// before GitHub is contacted. Installing uses codeload, not this proxy.
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
