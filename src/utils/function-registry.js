export const REGISTRY_SOURCE_BASE =
  'https://raw.githubusercontent.com/neondatabase/examples/main/registry/';

export const EXAMPLES_REGISTRY_TREE = 'https://github.com/neondatabase/examples/tree/main/registry';

export const REGISTRY_TEMPLATE_PAGE_BASE = 'functions/templates';

export const REGISTRY_PAGE_SIZE = 9;

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

export const isSafeTemplateJsonPath = (path) => {
  const segments = safePathSegments(path);
  return (
    Boolean(segments) &&
    path.length <= 255 &&
    segments.length >= 2 &&
    segments.at(-1) === 'template.json'
  );
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
const GITHUB_FILE_KINDS = new Set(['tree', 'blob', 'raw']);
const README_FILE_NAME = 'README.md';
const README_MAX_LENGTH = 256 * 1024;

const rawGithubUrl = (segments) => `https://${RAW_GITHUB_HOST}/${segments.join('/')}`;

// Only GitHub URLs with plain path segments, so a registry entry can't point the server elsewhere.
const parseGithubUrl = (value) => {
  if (!isRegistryHttpsUrl(value)) return null;
  const url = new URL(value.trim());
  if (url.hostname !== GITHUB_HOST && url.hostname !== RAW_GITHUB_HOST) return null;
  const segments = safePathSegments(url.pathname.replace(/^\/|\/$/g, ''));
  return segments ? { host: url.hostname, segments } : null;
};

const withReadmeFile = (segments) =>
  /\.(md|markdown)$/i.test(segments.at(-1)) ? segments : [...segments, README_FILE_NAME];

// Resolves a GitHub repo, tree, blob, or raw URL to the raw URL of its README.
// In `tree/<ref>/<dir>`, the ref is the first segment, so refs containing `/` aren't supported.
export const resolveRegistryReadmeUrl = (value) => {
  const github = parseGithubUrl(value);
  if (!github) return null;
  const { host, segments } = github;
  if (host === RAW_GITHUB_HOST)
    return segments.length >= 3 ? rawGithubUrl(withReadmeFile(segments)) : null;

  const [owner, repo, kind, ref, ...rest] = segments;
  const repoName = repo?.replace(/\.git$/, '');
  if (segments.length === 2) return rawGithubUrl([owner, repoName, 'HEAD', README_FILE_NAME]);
  if (GITHUB_FILE_KINDS.has(kind) && ref) {
    return rawGithubUrl(withReadmeFile([owner, repoName, ref, ...rest]));
  }
  return null;
};

// github.com blob/raw pages are HTML, so images need the raw file instead.
export const toRawGithubImageUrl = (url) => {
  if (url.hostname !== GITHUB_HOST) return url.href;
  const [owner, repo, kind, ...rest] = url.pathname.split('/').filter(Boolean);
  if ((kind !== 'blob' && kind !== 'raw') || rest.length < 2) return url.href;
  return rawGithubUrl([owner, repo, ...rest]);
};

const registryTemplateFolder = (template) => {
  if (isSafeTemplateJsonPath(template?.path))
    return template.path.split('/').slice(0, -1).join('/');
  if (typeof template?.id === 'string' && REGISTRY_ID_PATTERN.test(template.id)) {
    return template.id;
  }
  return null;
};

export const registryTemplateReadmeUrl = (template) => {
  const remote =
    resolveRegistryReadmeUrl(template?.readme) || resolveRegistryReadmeUrl(template?.repository);
  if (remote) return remote;
  const folder = registryTemplateFolder(template);
  return folder ? registrySourceUrl(`${folder}/${README_FILE_NAME}`) : null;
};

// Bases for resolving a README's relative images (raw files) and links (github.com pages).
export const registryReadmeBases = (readmeUrl) => {
  const [owner, repo, ref, ...rest] = new URL(readmeUrl).pathname.split('/').filter(Boolean);
  const dir = rest
    .slice(0, -1)
    .map((segment) => `${segment}/`)
    .join('');
  return {
    imageBase: `${rawGithubUrl([owner, repo, ref])}/${dir}`,
    linkBase: `https://${GITHUB_HOST}/${owner}/${repo}/blob/${ref}/${dir}`,
  };
};

// Returns null when the template has no README or it can't be fetched.
export const getFunctionRegistryTemplateReadme = async (template) => {
  const url = registryTemplateReadmeUrl(template);
  if (!url) return null;
  try {
    const response = await fetch(url, registryFetchInit());
    if (!response.ok) return null;
    if (response.redirected && new URL(response.url).hostname !== RAW_GITHUB_HOST) return null;
    if (Number(response.headers.get('content-length')) > README_MAX_LENGTH) return null;
    const markdown = (await response.text()).slice(0, README_MAX_LENGTH);
    return markdown.trim() ? { markdown, ...registryReadmeBases(url) } : null;
  } catch {
    return null;
  }
};

const registryRepositoryUrl = (template) => {
  const github = parseGithubUrl(template?.repository);
  if (github?.host !== GITHUB_HOST || github.segments.length < 2) return null;
  return `https://${GITHUB_HOST}/${github.segments.join('/')}`;
};

export const registryTemplateSourceUrl = (template) => {
  const repository = registryRepositoryUrl(template);
  if (repository) return repository;
  const folder = registryTemplateFolder(template);
  return folder ? `${EXAMPLES_REGISTRY_TREE}/${folder}` : EXAMPLES_REGISTRY_TREE;
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

// Mirrors the `categories` item rules in registry.schema.json.
const REGISTRY_CATEGORY_PATTERN = REGISTRY_ID_PATTERN;
const REGISTRY_CATEGORY_MAX_LENGTH = 64;
const REGISTRY_CATEGORY_MAX_ITEMS = 16;

// Categories are open-ended in the registry; unlisted ids fall back to a humanized label.
const REGISTRY_CATEGORY_LABELS = {
  [REGISTRY_FIRST_PARTY_CATEGORY]: 'First Party',
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

export const isFirstPartyRegistryTemplate = (template) =>
  registryTemplateCategories(template).includes(REGISTRY_FIRST_PARTY_CATEGORY);

const matchesRegistryTemplateFilter = (template, filter) => {
  if (!filter || filter === REGISTRY_ALL_FILTER) return true;
  return registryTemplateCategories(template).includes(filter);
};

const countRegistryTemplates = (templates, filter) =>
  templates.filter((template) => matchesRegistryTemplateFilter(template, filter)).length;

// First party leads, then the most-used categories, ties broken by label.
export const registryCategoryIds = (templates) => {
  const ids = new Set(templates.flatMap(registryTemplateCategories));
  const counts = new Map([...ids].map((id) => [id, countRegistryTemplates(templates, id)]));
  return [...ids].sort((a, b) => {
    if (a === REGISTRY_FIRST_PARTY_CATEGORY) return -1;
    if (b === REGISTRY_FIRST_PARTY_CATEGORY) return 1;
    return (
      counts.get(b) - counts.get(a) ||
      registryCategoryLabel(a).localeCompare(registryCategoryLabel(b))
    );
  });
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

export const getFunctionRegistryCatalog = async () => {
  try {
    return normalizeRegistryTemplates(await fetchRegistryJson('registry.json'));
  } catch {
    return [];
  }
};

const pickTemplateJsonFields = (data) => {
  if (!data || typeof data !== 'object') return {};
  const picked = {};
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
  if (isRegistryHttpsUrl(data.readme)) picked.readme = data.readme.trim();
  if (isRegistryHttpsUrl(data.repository)) picked.repository = data.repository.trim();
  return picked;
};

export const getFunctionRegistryTemplate = async (id) => {
  if (typeof id !== 'string' || !REGISTRY_ID_PATTERN.test(id)) return null;
  const templates = await getFunctionRegistryCatalog();
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
