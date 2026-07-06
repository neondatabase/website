// Shared pure helpers used by both the generator and client components.
// Keep this file framework-free so it can be imported from Node.js scripts.

// All-caps sequences of 2+ chars → TitleCase (JWKS → Jwks, VPC → Vpc).
// When the match is immediately followed by a lowercase letter, the last uppercase
// char starts the next word and must stay uppercase (VPCEndpoints → VpcEndpoints).
export function toSdkMethodName(operationId) {
  return operationId.replace(/[A-Z]{2,}/g, (match, offset, str) => {
    const nextChar = str[offset + match.length];
    if (nextChar && nextChar >= 'a' && nextChar <= 'z') {
      const acronym = match.slice(0, -1);
      return acronym[0] + acronym.slice(1).toLowerCase() + match.slice(-1);
    }
    return match[0] + match.slice(1).toLowerCase();
  });
}

export function buildCurl(operation, paramValues, paramIncluded, bodyJson) {
  let urlPath = operation.path.replace(/\{([^}]+)\}/g, (_, name) =>
    paramValues[name] != null && paramValues[name] !== ''
      ? encodeURIComponent(paramValues[name])
      : `{${name}}`
  );

  const queryParts = (operation.parameters ?? [])
    .filter((p) => p.in === 'query')
    .filter((p) => p.required || paramIncluded.has(p.name) || paramValues[p.name] !== undefined)
    .map((p) => {
      const val =
        paramValues[p.name] !== undefined
          ? paramValues[p.name]
          : p.default !== null && p.default !== undefined
            ? String(p.default)
            : `$${p.name.toUpperCase()}`;
      const encoded =
        typeof val === 'string' && val.startsWith('$') ? val : encodeURIComponent(val);
      return `${p.name}=${encoded}`;
    });

  if (queryParts.length > 0) urlPath += '?' + queryParts.join('&');

  const hasBody = Object.keys(bodyJson).length > 0;
  const lines = [`curl "https://console.neon.tech/api/v2${urlPath}" \\`];
  if (operation.method !== 'GET') lines.push(`  -X ${operation.method} \\`);
  lines.push(`  -H "Authorization: Bearer $NEON_API_KEY"`);
  if (hasBody) {
    lines[lines.length - 1] += ' \\';
    lines.push(`  -H "Content-Type: application/json" \\`);
    lines.push(`  -d '${JSON.stringify(bodyJson).replace(/'/g, "'\\''")}'`);
  }
  return lines.join('\n');
}

export function formatParamsArg(params) {
  const entries = Object.entries(params);
  if (entries.length === 0) return '{}';
  const parts = entries.map(([k, v]) => {
    if (typeof v === 'string' && v.startsWith('process.env.')) return `${k}: ${v}`;
    return `${k}: ${JSON.stringify(v)}`;
  });
  return `{ ${parts.join(', ')} }`;
}

function toSdkParamName(name) {
  return name.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function paramValue(p, val) {
  const type = p.type ?? p.schema?.type;
  if (val !== undefined) {
    return type === 'integer' || type === 'number'
      ? Number(val)
      : type === 'boolean'
        ? typeof val === 'boolean'
          ? val
          : val === 'true'
        : val;
  }
  return `process.env.${p.name.toUpperCase()}`;
}

export function buildTs(operation, paramValues, paramIncluded, bodyJson) {
  const sdkMethod = toSdkMethodName(operation.operationId);
  const hasBody = Object.keys(bodyJson).length > 0;
  const pathParams = (operation.parameters ?? []).filter((p) => p.in === 'path' && p.required);
  const queryParams = (operation.parameters ?? []).filter((p) => p.in === 'query');

  const activeQueryParams = [];
  for (const p of queryParams) {
    const active = p.required || paramIncluded.has(p.name) || paramValues[p.name] !== undefined;
    if (active) activeQueryParams.push(p);
  }

  const bodyStr = hasBody ? JSON.stringify(bodyJson, null, 2) : null;

  const args = [];
  // Mirrors @neondatabase/api-client generated signatures: operations with
  // query params receive one params object, while path-only operations use
  // positional path params before the optional request body.
  const needsQueryObject = queryParams.length > 0;
  if (needsQueryObject) {
    const queryObject = {};
    for (const p of pathParams) {
      queryObject[toSdkParamName(p.name)] = paramValue(p, paramValues[p.name]);
    }
    for (const p of activeQueryParams) {
      queryObject[p.name] = paramValue(p, paramValues[p.name]);
    }
    args.push(formatParamsArg(queryObject));
  } else {
    for (const p of pathParams) {
      const value = paramValue(p, paramValues[p.name]);
      args.push(
        typeof value === 'string' && value.startsWith('process.env.')
          ? value
          : JSON.stringify(value)
      );
    }
  }

  if (bodyStr) args.push(bodyStr);
  if (args.length === 0) args.push('{}');

  return [
    `import { createApiClient } from '@neondatabase/api-client';`,
    ``,
    `const api = createApiClient({ apiKey: process.env.NEON_API_KEY });`,
    `const { data } = await api.${sdkMethod}(${args.join(', ')});`,
  ].join('\n');
}

export function buildCliCommand(
  baseCommand,
  positionals,
  flags,
  cliEdits,
  cliIncluded,
  paramValues
) {
  let resolvedBase = baseCommand;
  for (const pos of positionals ?? []) {
    const key = pos.apiEquiv ?? pos.display;
    const val = cliEdits[key] ?? (pos.apiEquiv ? paramValues?.[pos.apiEquiv] : undefined);
    if (val) resolvedBase = resolvedBase.replace(pos.display, String(val));
  }

  const parts = [];
  for (const flag of flags) {
    const name = flag.name;
    const included = flag.required || cliIncluded.has(name) || cliEdits[name] !== undefined;
    if (!included) continue;
    const val =
      cliEdits[name] ?? flag.placeholder ?? flag.default ?? (flag.required ? `<${name}>` : '');
    if (flag.type === 'boolean') {
      parts.push(`--${name}`);
    } else if (val !== '' && val != null) {
      parts.push(`--${name} ${val}`);
    }
  }
  if (parts.length === 0) return resolvedBase;
  if (parts.length <= 2) return `${resolvedBase} ${parts.join(' ')}`;
  return `${resolvedBase} \\\n  ${parts.join(' \\\n  ')}`;
}
