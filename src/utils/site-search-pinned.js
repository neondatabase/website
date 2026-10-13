// Queries with one obvious destination, answered without calling site search.
// A pinned query returns only its pinned pages. Matching is exact after
// normalizePinnedQuery, so "changelog march 2026" still goes to search.

const CHANGELOG = {
  url: 'https://neon.com/docs/changelog',
  title: 'Neon Changelog',
  slug: 'docs/changelog',
  collection: 'changelog',
  heading: '',
  excerpt: 'The latest product updates from Neon, every week.',
  score: 1,
};

const PRICING = [
  {
    url: 'https://neon.com/pricing',
    title: 'Pricing',
    slug: 'pricing',
    collection: 'page',
    heading: '',
    excerpt: 'Neon plans and prices: start for free, then pay for the compute and storage you use.',
    score: 2,
  },
  {
    url: 'https://neon.com/docs/introduction/plans',
    title: 'Neon plans',
    slug: 'docs/introduction/plans',
    collection: 'docs',
    heading: '',
    excerpt: 'What each Neon plan includes, its limits, and how usage is billed.',
    score: 1,
  },
];

const SAMPLE_DATABASE = [
  {
    url: 'https://neon.com/postgresql/getting-started/sample-database',
    title: 'PostgreSQL Sample Database',
    slug: 'postgresql/getting-started/sample-database',
    collection: 'tutorial',
    heading: '',
    excerpt:
      'The dvdrental sample database used throughout the PostgreSQL tutorial, with a download link.',
    score: 3,
  },
  {
    url: 'https://neon.com/postgresql/getting-started/load-postgresql-sample-database',
    title: 'Load PostgreSQL Sample Database',
    slug: 'postgresql/getting-started/load-postgresql-sample-database',
    collection: 'tutorial',
    heading: '',
    excerpt: 'Load dvdrental into a PostgreSQL database server.',
    score: 2,
  },
  {
    url: 'https://neon.com/docs/import/import-sample-data',
    title: 'Postgres sample data',
    slug: 'docs/import/import-sample-data',
    collection: 'docs',
    heading: '',
    excerpt: 'Download sample datasets and load them into Neon.',
    score: 1,
  },
];

const PINNED = [
  {
    queries: [
      'changelog',
      'changelogs',
      'change log',
      'change logs',
      'neon changelog',
      'release notes',
      'whats new',
    ],
    hits: [CHANGELOG],
  },
  { queries: ['pricing', 'price', 'prices', 'neon pricing', 'plans', 'neon plans'], hits: PRICING },
  {
    queries: [
      'dvdrental',
      'dvdrental zip',
      'dvd rental',
      'sample database',
      'postgres sample database',
    ],
    hits: SAMPLE_DATABASE,
  },
];

const PINNED_BY_QUERY = new Map(
  PINNED.flatMap((entry) => entry.queries.map((query) => [query, entry.hits]))
);

export function normalizePinnedQuery(query) {
  return query
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function pinnedSiteSearchHits(query) {
  const hits = PINNED_BY_QUERY.get(normalizePinnedQuery(query));
  return hits ? hits.map((hit) => ({ ...hit })) : null;
}
