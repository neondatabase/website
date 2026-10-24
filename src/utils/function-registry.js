export const REGISTRY_SOURCE_BASE =
  'https://raw.githubusercontent.com/neondatabase/examples/main/registry/';

export const EXAMPLES_REGISTRY_TREE = 'https://github.com/neondatabase/examples/tree/main/registry';

export const REGISTRY_TEMPLATE_DOCS_BASE = 'compute/functions/registry/templates';

const REGISTRY_USER_AGENT = { 'User-Agent': 'neon-website-function-registry' };

export const registryFetchInit = () =>
  process.env.NODE_ENV === 'development'
    ? { cache: 'no-store', headers: REGISTRY_USER_AGENT }
    : { cache: 'force-cache', headers: REGISTRY_USER_AGENT, next: { revalidate: 3600 } };

const JSON_TYPE = 'application/json; charset=utf-8';

// Allowlist before GitHub: catalog and schemas only.
const ALLOWED = new Map([
  ['registry.json', JSON_TYPE],
  ['schemas/registry.schema.json', JSON_TYPE],
  ['schemas/template.schema.json', JSON_TYPE],
]);

export const REGISTRY_PUBLIC_PATHS = [...ALLOWED.keys()];

export const resolveRegistryPath = (segments) => {
  if (!Array.isArray(segments) || segments.length === 0) return null;
  if (!segments.every((segment) => typeof segment === 'string')) return null;
  const path = segments.join('/');
  const contentType = ALLOWED.get(path);
  if (!contentType) return null;
  return { path, contentType };
};

export const registrySourceUrl = (path) => new URL(path, REGISTRY_SOURCE_BASE).href;

export const registryTemplateDocsSlug = (id) => `${REGISTRY_TEMPLATE_DOCS_BASE}/${id}`;

export const registryTemplateDocsHref = (id) => `/docs/${registryTemplateDocsSlug(id)}`;

export const isSafeTemplateJsonPath = (path) => {
  if (typeof path !== 'string') return false;
  if (path.includes('..') || path.includes('\\') || path.startsWith('/')) return false;
  return path.length <= 255 && path.endsWith('/template.json');
};

export const isRegistryHttpsUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isRegistryLogoUrl = isRegistryHttpsUrl;

export const registryWebsiteUrl = (value) => (isRegistryHttpsUrl(value) ? value.trim() : null);

export const registryWebsiteLinkText = (href, title) => {
  if (isRegistryHttpsUrl(href)) {
    const host = new URL(href).hostname.replace(/^www\./i, '');
    if (host) return host;
  }
  if (typeof title === 'string' && title.trim()) return title.trim();
  return href;
};

export const isNeonRegistryTemplate = (template) => {
  const provider = typeof template?.provider === 'string' ? template.provider.trim() : '';
  return !provider || provider.toLowerCase() === 'neon';
};

export const registryProviderLabel = (template) => {
  const provider = typeof template?.provider === 'string' ? template.provider.trim() : '';
  return provider;
};

export const registryLogoAlt = (template, { decorative = false } = {}) => {
  const provider = registryProviderLabel(template);
  if (decorative) return '';
  if (provider) return provider;
  return typeof template?.title === 'string' ? template.title : '';
};

export const registryTemplateSourceUrl = (template) => {
  const rawPath = typeof template?.path === 'string' ? template.path : '';
  const folder = rawPath.replace(/\/?template\.json$/i, '').replace(/^\/+|\/+$/g, '');
  if (folder && !folder.includes('..') && !folder.includes('\\')) {
    return `${EXAMPLES_REGISTRY_TREE}/${folder}`;
  }
  if (typeof template?.id === 'string' && template.id) {
    return `${EXAMPLES_REGISTRY_TREE}/${template.id}`;
  }
  return EXAMPLES_REGISTRY_TREE;
};

export const normalizeRegistryTemplates = (data) => {
  if (!data || !Array.isArray(data.templates)) return [];
  return data.templates
    .filter(
      (template) =>
        template &&
        typeof template.id === 'string' &&
        template.id &&
        typeof template.title === 'string' &&
        template.title &&
        typeof template.description === 'string' &&
        template.description
    )
    .map((template) => ({
      ...template,
      website: registryWebsiteUrl(template.website),
    }));
};

const fetchRegistryJson = async (path) => {
  const response = await fetch(registrySourceUrl(path), registryFetchInit());
  if (!response.ok) return null;
  return response.json();
};

export const getFunctionRegistryIndex = async () => {
  try {
    const data = await fetchRegistryJson('registry.json');
    if (!data) return { homepage: null, name: null, templates: [] };
    return {
      homepage: typeof data.homepage === 'string' ? data.homepage : null,
      name: typeof data.name === 'string' ? data.name : null,
      templates: normalizeRegistryTemplates(data),
    };
  } catch {
    return { homepage: null, name: null, templates: [] };
  }
};

export const getFunctionRegistryCatalog = async () => {
  const { templates } = await getFunctionRegistryIndex();
  return templates;
};

const pickTemplateJsonFields = (data) => {
  if (!data || typeof data !== 'object') return {};
  const picked = {};
  if (data.layout === 'router' || data.layout === 'separate') picked.layout = data.layout;
  if (Array.isArray(data.dependencies))
    picked.dependencies = data.dependencies.filter((item) => typeof item === 'string');
  if (Array.isArray(data.environment)) {
    picked.environment = data.environment.filter(
      (item) => item && typeof item.name === 'string' && typeof item.description === 'string'
    );
  }
  if (Array.isArray(data.operations)) {
    picked.operations = data.operations.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string'
    );
  }
  if (typeof data.provider === 'string' && data.provider) picked.provider = data.provider;
  return picked;
};

export const getFunctionRegistryTemplate = async (id) => {
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) return null;
  const { homepage, templates } = await getFunctionRegistryIndex();
  const entry = templates.find((template) => template.id === id);
  if (!entry) return null;

  let detail = {};
  if (isSafeTemplateJsonPath(entry.path)) {
    try {
      detail = pickTemplateJsonFields(await fetchRegistryJson(entry.path));
    } catch {
      detail = {};
    }
  }

  return {
    ...entry,
    ...detail,
    id: entry.id,
    title: entry.title,
    description: entry.description,
    homepage,
    website: registryWebsiteUrl(entry.website),
  };
};
