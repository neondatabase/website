const SERVER_BASE = 'https://mcp.neon.tech';
const PROD_LIST_TOOLS_URL = `${SERVER_BASE}/api/list-tools`;

const toolsPreviewCache = new Map();

export const MCP_PATH = '/mcp';
export const MCP_SERVER_BASE = SERVER_BASE;

export function getListToolsBaseUrl() {
  if (process.env.NEXT_PUBLIC_MCP_API_URL) {
    return process.env.NEXT_PUBLIC_MCP_API_URL;
  }
  return PROD_LIST_TOOLS_URL;
}

export function buildQueryParams({ readOnly, projectId, selectedScopes, scopeIdSet, scopeIds }) {
  const params = new URLSearchParams();
  if (readOnly) {
    params.set('readonly', 'true');
  }
  const trimmedProjectId = projectId.trim();
  if (trimmedProjectId) {
    params.set('projectId', trimmedProjectId);
  }
  const validScopes = selectedScopes.filter((id) => scopeIdSet.has(id));
  if (validScopes.length > 0 && validScopes.length < scopeIds.length) {
    params.set('category', validScopes.join(','));
  }
  return params;
}

export function appendParams(baseUrl, params) {
  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

export function getTools(payload) {
  return Array.isArray(payload?.tools) ? payload.tools : [];
}

export function getHiddenTools({ allTools, selectedTools }) {
  const selectedToolNames = new Set(selectedTools.map((tool) => tool.name));
  return allTools.filter((tool) => !selectedToolNames.has(tool.name));
}

export function getToolsPreviewErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unable to load tools.';
}

async function fetchTools({ url, timeoutMs = 12000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timeout)
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch tools preview: ${response.status}`);
  }
  return response.json();
}

export function getToolsPreviewResource({ filteredUrl, reloadNonce }) {
  const cacheKey = `${reloadNonce}:${filteredUrl}`;

  if (!toolsPreviewCache.has(cacheKey)) {
    const listToolsBaseUrl = getListToolsBaseUrl();
    const promise = Promise.allSettled([
      fetchTools({ url: filteredUrl }),
      fetchTools({ url: listToolsBaseUrl }),
    ]).then(([filteredResult, allResult]) => {
      const filteredPayload = filteredResult.status === 'fulfilled' ? filteredResult.value : null;
      const allPayload = allResult.status === 'fulfilled' ? allResult.value : null;
      const error = filteredResult.status === 'rejected' ? filteredResult.reason : null;

      return {
        allPayload,
        error,
        filteredPayload,
      };
    });

    toolsPreviewCache.set(cacheKey, promise);
  }

  return toolsPreviewCache.get(cacheKey);
}
