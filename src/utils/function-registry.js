export const REGISTRY_SOURCE_BASE =
  'https://raw.githubusercontent.com/neondatabase/examples/main/registry/';

export const EXAMPLES_REGISTRY_TREE = 'https://github.com/neondatabase/examples/tree/main/registry';

export const REGISTRY_TEMPLATE_PAGE_BASE = 'functions/templates';

export const REGISTRY_PAGE_SIZE = 9;

const REGISTRY_USER_AGENT = { 'User-Agent': 'neon-website-function-registry' };

// Shared by every registry fetch (catalog, template.json, README) so they can be revalidated together.
export const REGISTRY_CACHE_TAG = 'function-registry';

export const registryFetchInit = () =>
  process.env.NODE_ENV === 'development'
    ? { cache: 'no-store', headers: REGISTRY_USER_AGENT }
    : {
        cache: 'force-cache',
        headers: REGISTRY_USER_AGENT,
        next: { revalidate: 3600, tags: [REGISTRY_CACHE_TAG] },
      };

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

export const registryTemplatePageHref = (id) => `/${REGISTRY_TEMPLATE_PAGE_BASE}/${id}`;

export const isInlineCodeSafe = (value) =>
  typeof value === 'string' && value !== '' && !/[`\r\n]/.test(value);

const SAFE_PATH_SEGMENT = /^[A-Za-z0-9._@~+-]+$/;

// Plain relative paths only: no empty, `.`/`..`, encoded, or URL-like segments, so a path
// resolved against a GitHub base can't escape it.
const safePathSegments = (path) => {
  if (typeof path !== 'string' || path === '') return null;
  const segments = path.split('/');
  const isSafe = segments.every((s) => s !== '.' && s !== '..' && SAFE_PATH_SEGMENT.test(s));
  return isSafe ? segments : null;
};

const TEMPLATE_JSON_FILE_NAME = 'template.json';

const templateJsonPathSegments = (path) => {
  const segments = safePathSegments(path);
  return segments && path.length <= 255 && segments.at(-1) === TEMPLATE_JSON_FILE_NAME
    ? segments
    : null;
};

export const isSafeTemplateJsonPath = (path) => (templateJsonPathSegments(path)?.length ?? 0) >= 2;

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

export const isNeonRegistryTemplate = (template) => {
  const provider = typeof template?.provider === 'string' ? template.provider.trim() : '';
  return !provider || provider.toLowerCase() === 'neon';
};

export const registryProviderLabel = (template) => {
  const provider = typeof template?.provider === 'string' ? template.provider.trim() : '';
  return provider;
};

export const registryLogoAlt = (template, { decorative = false } = {}) => {
  if (decorative) return '';
  if (isNeonRegistryTemplate(template)) return 'Neon logo';
  return `${registryProviderLabel(template)} logo`;
};

const REGISTRY_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const GITHUB_HOST = 'github.com';
const RAW_GITHUB_HOST = 'raw.githubusercontent.com';
const README_FILE_NAME = 'README.md';
const README_MAX_BYTES = 256 * 1024;

// Stops reading once the body passes maxBytes, so an oversized response without a
// `content-length` header is never buffered in full.
const readTextWithin = async (response, maxBytes) => {
  if (Number(response.headers.get('content-length')) > maxBytes) return null;
  if (!response.body) return '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
};

const rawGithubUrl = (segments) => `https://${RAW_GITHUB_HOST}/${segments.join('/')}`;

// github.com blob/raw pages are HTML, so images need the raw file instead.
export const toRawGithubImageUrl = (url) => {
  if (url.hostname !== GITHUB_HOST) return url.href;
  const [owner, repo, kind, ...rest] = url.pathname.split('/').filter(Boolean);
  if ((kind !== 'blob' && kind !== 'raw') || rest.length < 2) return url.href;
  return rawGithubUrl([owner, repo, ...rest]);
};

const isGithubName = (value) => safePathSegments(value)?.length === 1;

const examplesRegistryFolder = (template) => {
  if (isSafeTemplateJsonPath(template?.path)) return template.path.split('/').slice(0, -1);
  if (typeof template?.id === 'string' && REGISTRY_ID_PATTERN.test(template.id)) {
    return [template.id];
  }
  return null;
};

const trimSlashes = (value) => value.replace(/^\/+|\/+$/g, '');

const githubSourceLocation = (github) => {
  if (!github || typeof github !== 'object') return null;
  const { owner, repo, ref = 'HEAD', dir = '' } = github;
  if (!isGithubName(owner) || !isGithubName(repo) || typeof dir !== 'string') return null;
  const refSegments = safePathSegments(ref);
  const folder = trimSlashes(dir) ? safePathSegments(trimSlashes(dir)) : [];
  return refSegments && folder && { owner, repo, ref: refSegments.join('/'), folder };
};

// Where a template's files live on GitHub: its `source.github` repo or own `owner`/`repo` (and
// optional `folder`) for external templates, otherwise its folder in the examples registry.
const registryTemplateLocation = (template) => {
  if (template?.source != null) {
    const location = githubSourceLocation(template.source.github);
    const pathSegments = templateJsonPathSegments(template.path);
    if (!location || !pathSegments) return null;
    return { ...location, folder: [...location.folder, ...pathSegments.slice(0, -1)] };
  }
  if (isGithubName(template?.owner) && isGithubName(template?.repo)) {
    const folder = template.folder ? safePathSegments(template.folder) : [];
    return folder && { owner: template.owner, repo: template.repo, ref: 'HEAD', folder };
  }
  const folder = examplesRegistryFolder(template);
  return (
    folder && {
      owner: 'neondatabase',
      repo: 'examples',
      ref: 'main',
      folder: ['registry', ...folder],
    }
  );
};

const githubTreeUrl = ({ owner, repo, ref, folder }, kind = 'tree') =>
  `https://${GITHUB_HOST}/${[owner, repo, kind, ref, ...folder].join('/')}`;

// Returns the README with bases for its relative images (raw files) and links (github.com),
// or null when the template has no README or it can't be fetched.
export const getFunctionRegistryTemplateReadme = async (template) => {
  const location = registryTemplateLocation(template);
  if (!location) return null;
  const { owner, repo, ref, folder } = location;
  try {
    const response = await fetch(
      rawGithubUrl([owner, repo, ref, ...folder, README_FILE_NAME]),
      registryFetchInit()
    );
    if (!response.ok) return null;
    const markdown = await readTextWithin(response, README_MAX_BYTES);
    if (markdown === null) {
      console.warn(
        `Function registry: README for "${template.id}" is over ${README_MAX_BYTES / 1024} KB, skipping it.`
      );
      return null;
    }
    if (!markdown.trim()) return null;
    return {
      markdown,
      imageBase: `${rawGithubUrl([owner, repo, ref, ...folder])}/`,
      linkBase: `${githubTreeUrl(location, 'blob')}/`,
    };
  } catch (error) {
    console.error(`Function registry: failed to fetch the README for "${template.id}":`, error);
    return null;
  }
};

export const registryTemplateSourceUrl = (template) => {
  const location = registryTemplateLocation(template);
  if (location) return githubTreeUrl(location);
  return template?.source == null ? EXAMPLES_REGISTRY_TREE : null;
};

export const matchesRegistryTemplateQuery = (template, query) => {
  if (!query) return true;
  const haystack = [
    template.id,
    template.title,
    template.description,
    template.provider,
    ...registryTemplateCategories(template).map(registryCategoryLabel),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
};

export const REGISTRY_ALL_FILTER = 'all';

export const REGISTRY_FIRST_PARTY_CATEGORY = 'first-party';
export const REGISTRY_PARTNER_CATEGORY = 'partner';
export const REGISTRY_COMMUNITY_CATEGORY = 'community';

export const REGISTRY_SOURCE_CATEGORIES = [
  REGISTRY_FIRST_PARTY_CATEGORY,
  REGISTRY_PARTNER_CATEGORY,
  REGISTRY_COMMUNITY_CATEGORY,
];

// Mirrors the `categories` item rules in registry.schema.json.
const REGISTRY_CATEGORY_PATTERN = REGISTRY_ID_PATTERN;
const REGISTRY_CATEGORY_MAX_LENGTH = 64;
const REGISTRY_CATEGORY_MAX_ITEMS = 16;

// Categories are open-ended in the registry; unlisted ids fall back to a humanized label.
const REGISTRY_CATEGORY_LABELS = {
  [REGISTRY_FIRST_PARTY_CATEGORY]: 'First Party',
  [REGISTRY_PARTNER_CATEGORY]: 'Partner',
  [REGISTRY_COMMUNITY_CATEGORY]: 'Community',
  ai: 'AI',
  'ai-infrastructure': 'AI infrastructure',
  api: 'APIs',
  auth: 'Auth',
  bots: 'Bots',
  mcp: 'MCP servers',
};

const UPPERCASE_CATEGORY_WORDS = new Set(['ai', 'api', 'cdn', 'cli', 'llm', 'mcp', 'sdk', 'sql']);

export const registryCategoryLabel = (id) => {
  if (REGISTRY_CATEGORY_LABELS[id]) return REGISTRY_CATEGORY_LABELS[id];
  const words = id.split('-').filter(Boolean);
  return words
    .map((word, index) => {
      if (UPPERCASE_CATEGORY_WORDS.has(word)) return word.toUpperCase();
      return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    })
    .join(' ');
};

export const normalizeRegistryCategories = (value) => {
  if (!Array.isArray(value)) return [];
  const ids = value.filter(
    (id) =>
      typeof id === 'string' &&
      id.length <= REGISTRY_CATEGORY_MAX_LENGTH &&
      REGISTRY_CATEGORY_PATTERN.test(id)
  );
  return [...new Set(ids)].slice(0, REGISTRY_CATEGORY_MAX_ITEMS);
};

export const registryTemplateCategories = (template) =>
  normalizeRegistryCategories(template?.categories);

export const registryTemplateSource = (template) => {
  const categories = registryTemplateCategories(template);
  return REGISTRY_SOURCE_CATEGORIES.find((id) => categories.includes(id)) ?? null;
};

const registryCategoryRank = (id) => {
  const index = REGISTRY_SOURCE_CATEGORIES.indexOf(id);
  return index === -1 ? REGISTRY_SOURCE_CATEGORIES.length : index;
};

const matchesRegistryTemplateFilter = (template, filter) => {
  if (!filter || filter === REGISTRY_ALL_FILTER) return true;
  return registryTemplateCategories(template).includes(filter);
};

const countRegistryTemplates = (templates, filter) =>
  templates.filter((template) => matchesRegistryTemplateFilter(template, filter)).length;

// Source labels lead in a fixed order, then the most-used categories, ties broken by label.
export const registryCategoryIds = (templates) => {
  const ids = new Set(templates.flatMap(registryTemplateCategories));
  const counts = new Map([...ids].map((id) => [id, countRegistryTemplates(templates, id)]));
  return [...ids].sort(
    (a, b) =>
      registryCategoryRank(a) - registryCategoryRank(b) ||
      counts.get(b) - counts.get(a) ||
      registryCategoryLabel(a).localeCompare(registryCategoryLabel(b))
  );
};

export const registryTemplateFilters = (
  templates,
  categoryIds = registryCategoryIds(templates)
) => [
  { id: REGISTRY_ALL_FILTER, label: 'All templates', count: templates.length },
  ...categoryIds.map((id) => ({
    id,
    label: registryCategoryLabel(id),
    count: countRegistryTemplates(templates, id),
  })),
];

export const filterRegistryTemplates = (
  templates,
  { query = '', filter = REGISTRY_ALL_FILTER } = {}
) => {
  const q = query.trim().toLowerCase();
  return templates.filter(
    (template) =>
      matchesRegistryTemplateQuery(template, q) && matchesRegistryTemplateFilter(template, filter)
  );
};

export const paginateRegistryTemplates = (
  templates,
  { page = 1, pageSize = REGISTRY_PAGE_SIZE } = {}
) => {
  const total = templates.length;
  const size = pageSize > 0 ? pageSize : REGISTRY_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(total / size) || 1);
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), pageCount);
  const start = (currentPage - 1) * size;
  return {
    items: templates.slice(start, start + size),
    total,
    pageCount,
    currentPage,
    pageSize: size,
  };
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
      categories: normalizeRegistryCategories(template.categories),
      website: registryWebsiteUrl(template.website),
    }));
};

const fetchRegistryJson = async (path) => {
  const response = await fetch(registrySourceUrl(path), registryFetchInit());
  if (!response.ok) return null;
  return response.json();
};

const TEMPLATE_JSON_MAX_BYTES = 256 * 1024;
const TEMPLATE_JSON_TIMEOUT_MS = 5000;

const registryTemplateJsonUrl = (template) => {
  if (template?.source == null) {
    return isSafeTemplateJsonPath(template?.path) ? registrySourceUrl(template.path) : null;
  }
  const location = registryTemplateLocation(template);
  if (!location || !templateJsonPathSegments(template.path)) return null;
  const { owner, repo, ref, folder } = location;
  return rawGithubUrl([owner, repo, ref, ...folder, TEMPLATE_JSON_FILE_NAME]);
};

const fetchTemplateJson = async (template) => {
  const url = registryTemplateJsonUrl(template);
  if (!url) return null;
  const response = await fetch(url, {
    ...registryFetchInit(),
    signal: AbortSignal.timeout(TEMPLATE_JSON_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const text = await readTextWithin(response, TEMPLATE_JSON_MAX_BYTES);
  return text === null ? null : JSON.parse(text);
};

const withTemplateJsonCategories = async (entry) => {
  try {
    const data = await fetchTemplateJson(entry);
    if (!data) return entry;
    const topicalCategories = normalizeRegistryCategories(data.categories).filter(
      (id) => !REGISTRY_SOURCE_CATEGORIES.includes(id)
    );
    const categories = normalizeRegistryCategories([...entry.categories, ...topicalCategories]);
    return { ...entry, categories };
  } catch {
    return entry;
  }
};

export const getFunctionRegistryCatalog = async () => {
  try {
    const templates = normalizeRegistryTemplates(await fetchRegistryJson('registry.json'));
    return await Promise.all(templates.map(withTemplateJsonCategories));
  } catch {
    return [];
  }
};

export const REGISTRY_ENV_REQUIRED_ON_DEFAULT_BRANCH = 'default-branch';

const REGISTRY_ENV_REQUIRED_LABELS = new Map([
  [true, 'Yes'],
  [false, 'No'],
  [REGISTRY_ENV_REQUIRED_ON_DEFAULT_BRANCH, 'Default branch only'],
]);

export const registryEnvironmentRequiredLabel = (value) =>
  REGISTRY_ENV_REQUIRED_LABELS.get(value) ?? REGISTRY_ENV_REQUIRED_LABELS.get(true);

export const hasRegistryEnvironmentRequirements = (variables) =>
  variables.some(({ required }) => REGISTRY_ENV_REQUIRED_LABELS.has(required));

const pickTemplateJsonFields = (data) => {
  if (!data || typeof data !== 'object') return {};
  const picked = {};
  if (Array.isArray(data.environment)) {
    picked.environment = data.environment
      .filter(
        (item) => item && typeof item.name === 'string' && typeof item.description === 'string'
      )
      .map(({ name, description, required }) =>
        REGISTRY_ENV_REQUIRED_LABELS.has(required)
          ? { name, description, required }
          : { name, description }
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
  if (typeof id !== 'string' || !REGISTRY_ID_PATTERN.test(id)) return null;
  const templates = await getFunctionRegistryCatalog();
  const entry = templates.find((template) => template.id === id);
  if (!entry) return null;

  let detail = {};
  try {
    detail = pickTemplateJsonFields(await fetchTemplateJson(entry));
  } catch {
    detail = {};
  }

  return {
    ...entry,
    ...detail,
    id: entry.id,
    title: entry.title,
    description: entry.description,
    website: registryWebsiteUrl(entry.website),
  };
};

// Returns null for an unknown id. Throws when the catalog itself is unreachable,
// so a transient GitHub failure doesn't get cached as a 404.
export const getFunctionRegistryTemplatePage = async (id) => {
  const [template, templates] = await Promise.all([
    getFunctionRegistryTemplate(id),
    getFunctionRegistryCatalog(),
  ]);
  if (!template) {
    if (templates.length === 0) throw new Error('Function Registry catalog is unavailable');
    return null;
  }
  const index = templates.findIndex((item) => item.id === template.id);
  return { template, previous: templates[index - 1], next: templates[index + 1] };
};
