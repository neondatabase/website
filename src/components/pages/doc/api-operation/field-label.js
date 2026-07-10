const WHOLE_FIELD_OVERRIDES = {
  id: 'ID',
  org_id: 'Organization',
  pg_version: 'Postgres version',
  allowed_ips: 'Allowed IPs',
  ips: 'IPs',
  cpu_used_sec: 'CPU used seconds',
};

const TOKEN_OVERRIDES = {
  id: 'ID',
  ids: 'IDs',
  ip: 'IP',
  ips: 'IPs',
  pg: 'Postgres',
  postgres: 'Postgres',
  cu: 'CU',
  cpu: 'CPU',
  vpc: 'VPC',
  lsn: 'LSN',
  api: 'API',
  uri: 'URI',
  uris: 'URIs',
  tls: 'TLS',
  ssl: 'SSL',
  jwt: 'JWT',
  jwks: 'JWKS',
  mcp: 'MCP',
  cli: 'CLI',
};

function splitFieldName(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .split('_')
    .filter(Boolean);
}

export function humanizeFieldName(name) {
  if (!name) return '';
  if (WHOLE_FIELD_OVERRIDES[name]) return WHOLE_FIELD_OVERRIDES[name];

  return splitFieldName(name)
    .map((token, index) => {
      const override = TOKEN_OVERRIDES[token];
      if (override) return override;
      return index === 0 ? token.charAt(0).toUpperCase() + token.slice(1) : token;
    })
    .join(' ');
}

export function fieldTitle(path, node, labels = null) {
  return labels?.[path]?.title ?? humanizeFieldName(node?.key ?? path?.split('.').pop() ?? '');
}

export function fieldDefaultLabel(path, node, labels = null) {
  if (labels?.[path]?.defaultLabel) return labels[path].defaultLabel;
  if (node?.value !== undefined && node.value !== null && node.value !== '')
    return String(node.value);
  return null;
}
