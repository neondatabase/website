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
  let urlPath = operation.path.replace(
    /\{([^}]+)\}/g,
    (_, name) =>
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
            : p.name;
      return `${p.name}=${encodeURIComponent(val)}`;
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

export function buildTs(operation, paramValues, paramIncluded, bodyJson) {
  const sdkMethod = toSdkMethodName(operation.operationId);
  const hasBody = Object.keys(bodyJson).length > 0;

  const params = {};
  for (const p of operation.parameters ?? []) {
    const active =
      p.in === 'path' ||
      p.required ||
      paramIncluded.has(p.name) ||
      paramValues[p.name] !== undefined;
    if (!active) continue;
    const val = paramValues[p.name];
    if (val !== undefined) {
      params[p.name] =
        p.type === 'integer' || p.type === 'number'
          ? Number(val)
          : p.type === 'boolean'
            ? val === 'true'
            : val;
    } else if (p.in === 'path') {
      params[p.name] = `process.env.${p.name.toUpperCase()}`;
    }
  }

  const paramsStr = formatParamsArg(params);
  const bodyStr = hasBody
    ? JSON.stringify(bodyJson, null, 2)
        .split('\n')
        .map((l, i) => (i === 0 ? l : '  ' + l))
        .join('\n')
    : null;
  const callArgs = bodyStr ? `${paramsStr}, ${bodyStr}` : paramsStr;

  return [
    `import { createApiClient } from '@neondatabase/api-client';`,
    ``,
    `const api = createApiClient({ apiKey: process.env.NEON_API_KEY });`,
    `const { data } = await api.${sdkMethod}(${callArgs});`,
  ].join('\n');
}

export function buildCliCommand(baseCommand, positionals, flags, cliEdits, cliIncluded, paramValues) {
  let resolvedBase = baseCommand;
  for (const pos of positionals ?? []) {
    const key = pos.apiEquiv ?? pos.display;
    const val = cliEdits[key] ?? (pos.apiEquiv ? paramValues?.[pos.apiEquiv] : undefined);
    if (val) resolvedBase = resolvedBase.replace(pos.display, String(val));
  }

  const parts = [];
  for (const flag of flags) {
    const name = flag.name;
    // A flag with globalEquiv is "included" when the global has a
    // non-empty value, even if the user never typed in this op's CLI tab.
    const globalVal = flag.globalEquiv ? paramValues?.[flag.globalEquiv] : undefined;
    const included =
      flag.required ||
      cliIncluded.has(name) ||
      cliEdits[name] !== undefined ||
      globalVal !== undefined;
    if (!included) continue;
    const val =
      cliEdits[name] ??
      globalVal ??
      flag.placeholder ??
      flag.default ??
      (flag.required ? `<${name}>` : '');
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
