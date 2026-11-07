const SIGN_IN = [
  { value: 'oauth', label: 'OAuth' },
  { value: 'api_key', label: 'API key' },
];

const ACCESS = [
  { value: 'full_access', label: 'Full access' },
  { value: 'read_only', label: 'Read-only' },
  { value: 'project_scoped', label: 'One project' },
  { value: 'limited_categories', label: 'Limited tool categories' },
  { value: 'pinned_role', label: 'Pinned Postgres role' },
];

const DIMENSIONS = { sign_in: SIGN_IN, access: ACCESS };

// Rows are { dimension, value, share }. Values come back in the order above so
// the page reads the same every day, and an unknown value fails the build.
export function buildAccessSplit(rows) {
  const byKey = new Map(rows.map((row) => [`${row.dimension}:${row.value}`, row.share]));
  rows.forEach(({ dimension, value }) => {
    const known = DIMENSIONS[dimension]?.some((entry) => entry.value === value);
    if (!known) throw new Error(`Unknown MCP access value "${dimension}:${value}"`);
  });

  const pick = (dimension) =>
    DIMENSIONS[dimension].map(({ value, label }) => {
      const share = byKey.get(`${dimension}:${value}`);
      if (share === undefined) throw new Error(`Missing MCP access value "${dimension}:${value}"`);
      return { key: value, label, share };
    });

  return { signIn: pick('sign_in'), access: pick('access') };
}
