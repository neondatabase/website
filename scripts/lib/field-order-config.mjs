// Editorial display order for operation fields.
//
// Keys are operationIds. Values are objects keyed by path:
//   'requestBody'         — top-level request body fields
//   'response'            — top-level response fields
//   'requestBody.project' — children of `project` inside request body
//   'response.branch'     — children of `branch` inside response
//   (any depth: 'requestBody.a.b.c')
//
// Fields not listed are appended after the ordered ones in their original spec
// order. Adding or removing spec fields is safe — unknown config names are
// silently ignored; new spec fields without a config entry appear at the end.

export const FIELD_ORDER = {
  createProject: {
    response: ['project', 'connection_uris', 'roles', 'databases', 'operations', 'branch', 'endpoints'],
    'requestBody.project': [
      'name',
      'region_id',
      'pg_version',
      'org_id',
      'branch',
      'autoscaling_limit_min_cu',
      'autoscaling_limit_max_cu',
      'provisioner',
      'default_endpoint_settings',
      'store_passwords',
      'history_retention_seconds',
      'settings',
    ],
  },
  createProjectBranch: {
    requestBody: ['branch', 'endpoints', 'annotation_value'],
    response: ['branch', 'connection_uris', 'roles', 'databases', 'operations', 'endpoints'],
  },
  createProjectBranchAnonymized: {
    requestBody: ['branch_create', 'masking_rules', 'start_anonymization', 'annotation_value'],
    response: ['branch', 'connection_uris', 'roles', 'databases', 'operations', 'endpoints'],
  },
  createProjectBranchDataAPI: {
    requestBody: ['auth_provider', 'jwks_url', 'provider_name', 'jwt_audience', 'add_default_grants', 'skip_auth_schema', 'settings'],
  },
  createProjectBranchDatabase: {
    response: ['database', 'operations', 'branch'],
  },
  createProjectBranchRole: {
    response: ['role', 'operations', 'branch'],
  },
  createProjectEndpoint: {
    response: ['endpoint', 'operations'],
  },
};

// ---------------------------------------------------------------------------
// Heuristic scorer — used when no manual override exists.
// Higher score = earlier in the list.
// ---------------------------------------------------------------------------

// Score buckets are positioned with gaps so future fields can slot between
// existing buckets without renumbering. Higher score = appears earlier.
// Order of buckets, highest first:
//   1000   required fields — always first
//      85   primary connection URI (the literal thing you need to connect)
//      75   any URI/URL/connection-named field (helper variants of above)
//      70   bare `id` field — primary resource identifier
//      68   bare `name` — secondary identifier just after id
//      50   default (unscored) — original spec order preserved within bucket
//      30   `operations` — background async ops; useful but not first
//      15   timestamps (*_at, *_time) — informational metadata at the end
function scoreField(name, schema, requiredSet) {
  if (requiredSet.has(name)) return 1000;

  if (name === 'connection_uris' || name === 'connection_uri') return 85;
  if (name.includes('uri') || name.includes('url') || name.includes('connection')) return 75;

  // Primary identifiers (bare 'id' only — compound *_id fields stay at default
  // to avoid separating credential pairs like client_id / client_secret)
  if (name === 'id') return 70;
  if (name === 'name') return 68;

  if (name === 'operations') return 30;
  if (name.endsWith('_at') || name.endsWith('_time')) return 15;

  return 50;
}

// ---------------------------------------------------------------------------
// Public: compute display order for a set of properties.
//
// operationId  — e.g. 'createProject'
// properties   — the schema properties object
// requiredFields — array of required field names
// pathKey      — dot-path config key, e.g. 'requestBody', 'response',
//                'requestBody.project', 'response.branch.settings'
// ---------------------------------------------------------------------------

export function computeDisplayOrder(operationId, properties, requiredFields, pathKey) {
  if (!properties) return [];
  const keys = Object.keys(properties);
  if (keys.length === 0) return [];

  // Manual override takes full precedence
  const manual = FIELD_ORDER[operationId]?.[pathKey];
  if (manual?.length) {
    const manualSet = new Set(manual);
    const rest = keys.filter((k) => !manualSet.has(k));
    return [...manual.filter((k) => keys.includes(k)), ...rest];
  }

  // Heuristic: score each field, stable-sort descending
  const reqSet = new Set(requiredFields ?? []);
  // Build an O(1) index lookup for the tie-break instead of an O(n) indexOf
  // on every comparison (sort runs ~n log n comparisons, so the old shape
  // was effectively n² log n for very wide objects).
  const order = new Map(keys.map((k, i) => [k, i]));
  return [...keys].sort((a, b) => {
    const diff = scoreField(b, properties[b], reqSet) - scoreField(a, properties[a], reqSet);
    if (diff !== 0) return diff;
    return order.get(a) - order.get(b);
  });
}
