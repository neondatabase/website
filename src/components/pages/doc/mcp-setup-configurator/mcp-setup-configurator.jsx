'use client';

import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';

const SERVER_BASE = 'https://mcp.neon.tech';
const PREVIEW_LIST_TOOLS_URL = 'https://mcp.neon.tech/api/list-tools';
const TRANSPORTS = [
  {
    id: 'mcp',
    label: 'Streamable HTTP (/mcp)',
    url: `${SERVER_BASE}/mcp`,
    deprecated: false,
  },
  {
    id: 'sse',
    label: 'SSE (/sse)',
    url: `${SERVER_BASE}/sse`,
    deprecated: true,
  },
];
const AUTH_MODES = [
  { id: 'oauth', label: 'OAuth' },
  { id: 'apiKey', label: 'API Key' },
];
const SCOPE_CATEGORIES = [
  'projects',
  'branches',
  'schema',
  'querying',
  'performance',
  'neon_auth',
  'data_api',
  'docs',
];
const SUPPORTED_HEADER_NAMES = new Set([
  'Authorization',
  'X-Neon-Read-Only',
  'x-read-only',
  'X-Neon-Scopes',
  'X-Neon-Project-Id',
]);
const OPTION_BLOCK_CLASS =
  'rounded-lg border border-gray-new-90 bg-white/70 p-4 dark:border-gray-new-20 dark:bg-gray-new-10/40';

function getListToolsUrl(transportUrl) {
  if (process.env.NEXT_PUBLIC_MCP_API_URL) {
    return process.env.NEXT_PUBLIC_MCP_API_URL;
  }
  void transportUrl;
  return PREVIEW_LIST_TOOLS_URL;
}

function validateHeaders(headers) {
  const invalidHeaderNames = Object.keys(headers).filter(
    (headerName) => !SUPPORTED_HEADER_NAMES.has(headerName)
  );
  return invalidHeaderNames;
}

async function fetchToolsPreview({ listToolsUrl, headers = {}, timeoutMs = 12000 }) {
  const previewHeaders = {};
  for (const [key, value] of Object.entries(headers)) {
    if (key === 'Authorization') continue;
    previewHeaders[key] = value;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(listToolsUrl, {
    headers: previewHeaders,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
  if (!response.ok) {
    throw new Error(`Failed to fetch tools preview: ${response.status}`);
  }
  return response.json();
}

const ToggleGroup = ({ name, options, value, onChange }) => (
  <div className="grid gap-2 sm:grid-cols-2">
    {options.map((option) => (
      <label
        key={option.id}
        className={clsx(
          'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
          value === option.id
            ? 'border-secondary-8 bg-secondary-8/5 dark:border-primary-1 dark:bg-primary-1/10'
            : 'border-gray-new-90 bg-white hover:border-gray-new-70 dark:border-gray-new-20 dark:bg-gray-new-8 dark:hover:border-gray-new-30'
        )}
      >
        <input
          type="radio"
          name={name}
          value={option.id}
          checked={value === option.id}
          className="accent-secondary-8 dark:accent-primary-1"
          onChange={() => onChange(option.id)}
        />
        <span className="text-gray-new-20 dark:text-gray-new-90">{option.label}</span>
      </label>
    ))}
  </div>
);

ToggleGroup.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const HighlightedCode = ({ code, language }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    highlight(code, language).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (!html) {
    return (
      <pre
        className="my-0 overflow-x-auto !bg-gray-new-98 p-4 text-sm leading-relaxed dark:!bg-gray-new-10"
        data-language={language}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return <>{parse(html)}</>;
};

HighlightedCode.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

const McpSetupConfigurator = () => {
  const [authMode, setAuthMode] = useState('oauth');
  const [transport, setTransport] = useState('mcp');
  const [apiKey, setApiKey] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [scopes, setScopes] = useState(SCOPE_CATEGORIES);
  const [toolsPreview, setToolsPreview] = useState(null);
  const [allTools, setAllTools] = useState(null);
  const [toolsPreviewLoading, setToolsPreviewLoading] = useState(false);
  const [toolsPreviewError, setToolsPreviewError] = useState(false);
  const [toolsPreviewErrorMessage, setToolsPreviewErrorMessage] = useState('');
  const [lastSuccessfulToolsPreview, setLastSuccessfulToolsPreview] = useState(null);
  const [lastSuccessfulAllTools, setLastSuccessfulAllTools] = useState(null);
  const [toolsReloadNonce, setToolsReloadNonce] = useState(0);

  const currentTransport = useMemo(
    () => TRANSPORTS.find((item) => item.id === transport) ?? TRANSPORTS[0],
    [transport]
  );
  const scopeSet = useMemo(() => new Set(SCOPE_CATEGORIES), []);
  const unknownScopes = useMemo(
    () => scopes.filter((scope) => !scopeSet.has(scope)),
    [scopeSet, scopes]
  );
  const validScopes = useMemo(
    () => scopes.filter((scope) => scopeSet.has(scope)),
    [scopeSet, scopes]
  );

  const generatedHeaders = useMemo(() => {
    const headers = {};
    if (readOnly) {
      headers['X-Neon-Read-Only'] = 'true';
    }
    if (authMode === 'apiKey') {
      headers.Authorization = `Bearer ${apiKey.trim() || '<NEON_API_KEY>'}`;
    }
    if (validScopes.length > 0 && validScopes.length < SCOPE_CATEGORIES.length) {
      headers['X-Neon-Scopes'] = validScopes.join(',');
    }
    if (projectId.trim()) {
      headers['X-Neon-Project-Id'] = projectId.trim();
    }
    return headers;
  }, [apiKey, authMode, projectId, readOnly, validScopes]);

  const invalidHeaderNames = useMemo(() => validateHeaders(generatedHeaders), [generatedHeaders]);

  const generatedConfig = useMemo(() => {
    const config = {
      mcpServers: {
        Neon: {
          type: 'http',
          url: currentTransport.url,
          headers: generatedHeaders,
        },
      },
    };
    return JSON.stringify(config, null, 2);
  }, [currentTransport.url, generatedHeaders]);

  const addMcpCommand = useMemo(() => {
    const commandParts = [`npx add-mcp@latest ${currentTransport.url}`, '--name Neon'];
    if (generatedHeaders['X-Neon-Read-Only']) {
      commandParts.push(`--header "X-Neon-Read-Only: ${generatedHeaders['X-Neon-Read-Only']}"`);
    }
    if (authMode === 'apiKey') {
      commandParts.push('--header "Authorization: Bearer $NEON_API_KEY"');
    }
    if (generatedHeaders['X-Neon-Scopes']) {
      commandParts.push(`--header "X-Neon-Scopes: ${generatedHeaders['X-Neon-Scopes']}"`);
    }
    if (generatedHeaders['X-Neon-Project-Id']) {
      commandParts.push(`--header "X-Neon-Project-Id: ${generatedHeaders['X-Neon-Project-Id']}"`);
    }
    return commandParts.join(' \\\n  ');
  }, [authMode, currentTransport.url, generatedHeaders]);

  const effectiveToolsPreview = useMemo(() => {
    if (toolsPreviewError && lastSuccessfulToolsPreview) return lastSuccessfulToolsPreview;
    return toolsPreview;
  }, [lastSuccessfulToolsPreview, toolsPreview, toolsPreviewError]);

  const effectiveAllTools = useMemo(() => {
    if (toolsPreviewError && lastSuccessfulAllTools) return lastSuccessfulAllTools;
    return allTools;
  }, [allTools, lastSuccessfulAllTools, toolsPreviewError]);

  const selectedTools = useMemo(() => {
    if (!Array.isArray(effectiveToolsPreview?.tools)) return [];
    return effectiveToolsPreview.tools;
  }, [effectiveToolsPreview]);

  const notIncludedTools = useMemo(() => {
    if (!Array.isArray(effectiveAllTools?.tools) || !Array.isArray(effectiveToolsPreview?.tools)) {
      return [];
    }
    const selectedNames = new Set(effectiveToolsPreview.tools.map((tool) => tool.name));
    return effectiveAllTools.tools.filter((tool) => !selectedNames.has(tool.name));
  }, [effectiveAllTools, effectiveToolsPreview]);

  useEffect(() => {
    if (invalidHeaderNames.length > 0 || unknownScopes.length > 0) {
      return;
    }

    let cancelled = false;
    const listToolsUrl = getListToolsUrl(currentTransport.url);

    setToolsPreviewLoading(true);
    setToolsPreviewError(false);
    setToolsPreviewErrorMessage('');

    Promise.all([
      fetchToolsPreview({ listToolsUrl, headers: generatedHeaders }),
      fetchToolsPreview({ listToolsUrl }),
    ])
      .then(([filteredPayload, allPayload]) => {
        if (!cancelled) {
          setToolsPreview(filteredPayload);
          setAllTools(allPayload);
          setLastSuccessfulToolsPreview(filteredPayload);
          setLastSuccessfulAllTools(allPayload);
          setToolsPreviewLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setToolsPreviewError(true);
          if (error instanceof Error) {
            const message =
              error.name === 'AbortError'
                ? 'Request timed out while loading tools.'
                : error.message;
            setToolsPreviewErrorMessage(message);
          } else {
            setToolsPreviewErrorMessage('Unable to load tools.');
          }
          setToolsPreviewLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentTransport.url,
    generatedHeaders,
    invalidHeaderNames.length,
    unknownScopes.length,
    toolsReloadNonce,
  ]);

  return (
    <div className="my-5 rounded-xl border border-gray-new-90 dark:border-gray-new-20">
      <div className="border-b border-gray-new-90 bg-gray-new-98 p-5 dark:border-gray-new-20 dark:bg-gray-new-8">
        <h3 className="mb-1 mt-0 text-base font-semibold text-gray-new-10 dark:text-white">
          MCP Server Config Generator
        </h3>
        <p className="mb-5 mt-0 text-sm text-gray-new-40 dark:text-gray-new-60">
          Generate valid MCP client configuration for the hosted Neon MCP server.
        </p>

        <div className="space-y-3">
          <fieldset className={OPTION_BLOCK_CLASS}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
              Auth mode
            </legend>
            <ToggleGroup
              name="auth-mode"
              options={AUTH_MODES}
              value={authMode}
              onChange={setAuthMode}
            />
            <p className="mt-2 text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
              OAuth is best when your client supports browser authorization. API key mode is better
              for headless or remote agent setups.
            </p>
          </fieldset>

          <fieldset className={OPTION_BLOCK_CLASS}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
              Transport
            </legend>
            <ToggleGroup
              name="transport-mode"
              options={TRANSPORTS.map((item) => ({ id: item.id, label: item.label }))}
              value={transport}
              onChange={setTransport}
            />
            <p className="mt-2 text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
              Use Streamable HTTP whenever available. Use SSE only for clients that do not support
              Streamable HTTP yet.
            </p>
            {currentTransport.deprecated && (
              <p className="mt-2 rounded-lg border border-secondary-3/40 bg-secondary-3/10 px-3 py-2 text-[13px] text-gray-new-20 dark:border-secondary-3/30 dark:bg-secondary-3/10 dark:text-gray-new-90">
                SSE is deprecated by the MCP spec and is intended only as a fallback solution.
              </p>
            )}
          </fieldset>

          {authMode === 'apiKey' && (
            <label className={clsx('block', OPTION_BLOCK_CLASS)}>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
                API key
              </span>
              <input
                type="password"
                value={apiKey}
                placeholder="<NEON_API_KEY>"
                className="w-full rounded-lg border border-gray-new-90 bg-white px-3 py-2 text-sm text-gray-new-20 outline-none transition-colors focus:border-secondary-8 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-90 dark:focus:border-primary-1"
                onChange={(event) => setApiKey(event.target.value)}
              />
              <span className="mt-2 block text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
                Use API key mode for headless setups or to avoid OAuth re-auth after session expiry.
                Do not store API keys in project-scoped MCP config files.
              </span>
            </label>
          )}

          <div className={OPTION_BLOCK_CLASS}>
            <label className="flex items-center gap-2 text-sm text-gray-new-20 dark:text-gray-new-90">
              <input
                type="checkbox"
                checked={readOnly}
                className="accent-secondary-8 dark:accent-primary-1"
                onChange={(event) => setReadOnly(event.target.checked)}
              />
              Read-only
            </label>
            <p className="mt-2 text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
              Limits available tools to read-safe actions to reduce risk of unintended writes.
            </p>
          </div>

          <label className={clsx('block', OPTION_BLOCK_CLASS)}>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
              Limit access to one project (optional)
            </span>
            <input
              type="text"
              value={projectId}
              placeholder="proj_123"
              className="w-full rounded-lg border border-gray-new-90 bg-white px-3 py-2 text-sm text-gray-new-20 outline-none transition-colors focus:border-secondary-8 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-90 dark:focus:border-primary-1"
              onChange={(event) => setProjectId(event.target.value)}
            />
            <span className="mt-2 block text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
              Restricts project-scoped tools to a single Neon project and hides project-wide
              management actions.
            </span>
          </label>

          <fieldset className={OPTION_BLOCK_CLASS}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
              Tool access categories
            </legend>
            <p className="mb-2 text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
              Choose which capability groups the agent can use. Unselected categories are excluded.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SCOPE_CATEGORIES.map((scope) => (
                <label
                  key={scope}
                  className={clsx(
                    'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                    scopes.includes(scope)
                      ? 'border-secondary-8/40 bg-secondary-8/5 dark:border-primary-1/40 dark:bg-primary-1/10'
                      : 'border-gray-new-90 bg-white hover:border-gray-new-70 dark:border-gray-new-20 dark:bg-gray-new-8 dark:hover:border-gray-new-30'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={scopes.includes(scope)}
                    className="accent-secondary-8 dark:accent-primary-1"
                    onChange={() => {
                      if (scopes.includes(scope)) {
                        setScopes(scopes.filter((item) => item !== scope));
                      } else {
                        setScopes([...scopes, scope]);
                      }
                    }}
                  />
                  <span>{scope}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="space-y-4 bg-white p-5 dark:bg-gray-new-10">
        {authMode === 'oauth' && (
          <div className="rounded-lg border border-secondary-9/60 bg-secondary-9/25 px-4 py-3 text-[13px] text-gray-new-20 dark:border-secondary-7/40 dark:bg-secondary-7/10 dark:text-gray-new-90">
            <strong>Safety note:</strong>
            <p className="mb-0 mt-2">
              In OAuth mode, read-only/project/scope-category behavior depends on the active OAuth
              session. Once authorized, logging out and signing in again is required after config
              changes.
            </p>
          </div>
        )}

        <div className="rounded-lg border border-gray-new-90 px-4 py-3 text-[13px] dark:border-gray-new-20">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
            Selected tools ({selectedTools.length})
          </p>
          {toolsPreviewLoading && (
            <div className="mt-3 animate-pulse">
              <div className="mb-2 h-3 w-24 rounded bg-gray-new-90 dark:bg-gray-new-20" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <span
                    key={`tool-skeleton-${idx}`}
                    className="inline-block h-6 w-24 rounded-md bg-gray-new-90 dark:bg-gray-new-20"
                  />
                ))}
              </div>
            </div>
          )}
          {toolsPreviewError && (
            <div className="mt-3 rounded-lg border border-secondary-1/40 bg-secondary-1/10 px-3 py-2 text-secondary-1 dark:border-secondary-1/40 dark:bg-secondary-1/10 dark:text-secondary-4">
              <p className="m-0 text-[13px]">
                Could not refresh selected tools right now.
                {toolsPreviewErrorMessage ? ` ${toolsPreviewErrorMessage}` : ''}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="cursor-pointer text-xs font-medium text-secondary-8 underline underline-offset-2 hover:no-underline dark:text-primary-1"
                  onClick={() => setToolsReloadNonce((prev) => prev + 1)}
                >
                  Retry
                </button>
                {lastSuccessfulToolsPreview && (
                  <span className="text-xs text-gray-new-40 dark:text-gray-new-60">
                    Showing last successful results.
                  </span>
                )}
              </div>
            </div>
          )}
          {!toolsPreviewLoading && !toolsPreviewError && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedTools.map((tool) => (
                <span
                  key={tool.name}
                  className="inline-block rounded-md border border-gray-new-90 bg-gray-new-98 px-2 py-1 text-xs leading-tight text-gray-new-30 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-70"
                >
                  {tool.title || tool.name}
                </span>
              ))}
              {selectedTools.length === 0 && (
                <span className="text-gray-new-40 dark:text-gray-new-60">None</span>
              )}
            </div>
          )}
          {!toolsPreviewLoading && !toolsPreviewError && (
            <div className="mt-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
                Not included ({notIncludedTools.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {notIncludedTools.map((tool) => (
                  <span
                    key={tool.name}
                    className="inline-block rounded-md border border-gray-new-90 bg-white px-2 py-1 text-xs leading-tight text-gray-new-40 dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-gray-new-60"
                  >
                    {tool.title || tool.name}
                  </span>
                ))}
                {notIncludedTools.length === 0 && (
                  <span className="text-gray-new-40 dark:text-gray-new-60">None</span>
                )}
              </div>
            </div>
          )}
        </div>

        {unknownScopes.length > 0 && (
          <div className="rounded-lg border border-secondary-1/40 bg-secondary-1/10 px-4 py-3 text-[13px] text-secondary-1 dark:border-secondary-1/40 dark:bg-secondary-1/10 dark:text-secondary-4">
            Unknown scope categories were rejected: {unknownScopes.join(', ')}
          </div>
        )}

        {invalidHeaderNames.length > 0 && (
          <div className="rounded-lg border border-secondary-1/40 bg-secondary-1/10 px-4 py-3 text-[13px] text-secondary-1 dark:border-secondary-1/40 dark:bg-secondary-1/10 dark:text-secondary-4">
            Unsupported header names were blocked: {invalidHeaderNames.join(', ')}
          </div>
        )}

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
            add-mcp command
          </span>
          <CodeBlockWrapper
            className="rounded-lg border border-gray-new-90 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10"
            as="div"
          >
            <HighlightedCode code={addMcpCommand} language="bash" />
          </CodeBlockWrapper>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-60">
            MCP JSON config
          </span>
          <CodeBlockWrapper
            className="rounded-lg border border-gray-new-90 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10"
            as="div"
          >
            <HighlightedCode code={generatedConfig} language="json" />
          </CodeBlockWrapper>
        </div>
      </div>
    </div>
  );
};

export default McpSetupConfigurator;
