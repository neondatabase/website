'use client';

import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';

const SERVER_BASE = 'https://mcp.neon.tech';
const MCP_PATH = '/mcp';
const PROD_LIST_TOOLS_URL = `${SERVER_BASE}/api/list-tools`;

const AUTH_MODES = [
  {
    id: 'oauth',
    label: 'OAuth',
    description: 'Browser-based authorization. Best for local IDEs.',
  },
  {
    id: 'apiKey',
    label: 'API Key',
    description: 'Static bearer token. Best for headless and remote agents.',
  },
];

const SCOPE_CATEGORIES = [
  { id: 'projects', label: 'Projects', description: 'Create and manage projects' },
  { id: 'branches', label: 'Branches', description: 'Create, reset, delete branches' },
  { id: 'schema', label: 'Schema', description: 'Tables, columns, indexes' },
  { id: 'querying', label: 'Querying', description: 'Run SQL and explain plans' },
  { id: 'neon_auth', label: 'Neon Auth', description: 'Users and sessions' },
  { id: 'data_api', label: 'Data API', description: 'RESTful data endpoints' },
  { id: 'docs', label: 'Docs', description: 'Search and fetch docs' },
];
const SCOPE_IDS = SCOPE_CATEGORIES.map((scope) => scope.id);
const SCOPE_ID_SET = new Set(SCOPE_IDS);

const CARD_CLASS =
  'rounded-xl border border-gray-new-90 bg-white/80 p-5 backdrop-blur-sm dark:border-gray-new-20 dark:bg-gray-new-10/50';
const SECTION_LABEL_CLASS =
  'mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-new-40 dark:text-gray-new-60';
const FIELD_LABEL_CLASS =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-new-30 dark:text-gray-new-70';
const HELPER_TEXT_CLASS = 'text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60';

function getListToolsBaseUrl() {
  if (process.env.NEXT_PUBLIC_MCP_API_URL) {
    return process.env.NEXT_PUBLIC_MCP_API_URL;
  }
  return PROD_LIST_TOOLS_URL;
}

function buildQueryParams({ readOnly, projectId, selectedScopes }) {
  const params = new URLSearchParams();
  if (readOnly) {
    params.set('readonly', 'true');
  }
  const trimmedProjectId = projectId.trim();
  if (trimmedProjectId) {
    params.set('projectId', trimmedProjectId);
  }
  const validScopes = selectedScopes.filter((id) => SCOPE_ID_SET.has(id));
  if (validScopes.length > 0 && validScopes.length < SCOPE_IDS.length) {
    params.set('category', validScopes.join(','));
  }
  return params;
}

function appendParams(baseUrl, params) {
  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
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

const SegmentedControl = ({ name, options, value, onChange }) => (
  <div
    className="relative grid grid-cols-2 gap-1 rounded-lg border border-gray-new-90 bg-gray-new-98 p-1 dark:border-gray-new-20 dark:bg-gray-new-8 sm:grid-cols-1"
    role="radiogroup"
  >
    {options.map((option) => {
      const selected = value === option.id;
      return (
        <button
          key={option.id}
          type="button"
          role="radio"
          name={name}
          aria-checked={selected}
          className={clsx(
            'flex flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
            selected
              ? 'bg-white text-gray-new-10 shadow-sm ring-1 ring-gray-new-90 dark:bg-gray-new-10 dark:text-white dark:ring-gray-new-20'
              : 'text-gray-new-40 hover:text-gray-new-20 dark:text-gray-new-60 dark:hover:text-gray-new-90'
          )}
          onClick={() => onChange(option.id)}
        >
          <span className="font-medium">{option.label}</span>
          <span className="text-[11px] leading-snug opacity-80">{option.description}</span>
        </button>
      );
    })}
  </div>
);

SegmentedControl.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Toggle = ({ checked, onChange, label, description }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className="flex w-full items-start gap-3 text-left"
    onClick={() => onChange(!checked)}
  >
    <span
      className={clsx(
        'mt-0.5 inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border transition-colors',
        checked
          ? 'border-secondary-8 bg-secondary-8 dark:border-primary-1 dark:bg-primary-1'
          : 'border-gray-new-80 bg-gray-new-90 dark:border-gray-new-30 dark:bg-gray-new-20'
      )}
    >
      <span
        className={clsx(
          'inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-white shadow-sm transition-transform',
          checked && 'translate-x-[18px]'
        )}
      />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-medium text-gray-new-10 dark:text-white">{label}</span>
      {description && (
        <span className={clsx('mt-0.5 block', HELPER_TEXT_CLASS)}>{description}</span>
      )}
    </span>
  </button>
);

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
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
  const [apiKey, setApiKey] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [selectedScopes, setSelectedScopes] = useState(SCOPE_IDS);
  const [toolsPreview, setToolsPreview] = useState(null);
  const [allTools, setAllTools] = useState(null);
  const [toolsPreviewLoading, setToolsPreviewLoading] = useState(false);
  const [toolsPreviewError, setToolsPreviewError] = useState(false);
  const [toolsPreviewErrorMessage, setToolsPreviewErrorMessage] = useState('');
  const [lastSuccessfulToolsPreview, setLastSuccessfulToolsPreview] = useState(null);
  const [lastSuccessfulAllTools, setLastSuccessfulAllTools] = useState(null);
  const [toolsReloadNonce, setToolsReloadNonce] = useState(0);

  const queryParams = useMemo(
    () => buildQueryParams({ readOnly, projectId, selectedScopes }),
    [readOnly, projectId, selectedScopes]
  );
  const queryString = queryParams.toString();

  const baseServerUrl = `${SERVER_BASE}${MCP_PATH}`;
  const generatedServerUrl = useMemo(
    () => appendParams(baseServerUrl, queryParams),
    [baseServerUrl, queryParams]
  );

  const generatedHeaders = useMemo(() => {
    const headers = {};
    if (authMode === 'apiKey') {
      headers.Authorization = `Bearer ${apiKey.trim() || '<NEON_API_KEY>'}`;
    }
    return headers;
  }, [apiKey, authMode]);

  const generatedConfig = useMemo(() => {
    const neonEntry = {
      type: 'http',
      url: generatedServerUrl,
    };
    if (Object.keys(generatedHeaders).length > 0) {
      neonEntry.headers = generatedHeaders;
    }
    const config = {
      mcpServers: {
        Neon: neonEntry,
      },
    };
    return JSON.stringify(config, null, 2);
  }, [generatedHeaders, generatedServerUrl]);

  const addMcpCommand = useMemo(() => {
    const urlArg = queryString ? `"${generatedServerUrl}"` : generatedServerUrl;
    const commandParts = [`npx add-mcp@latest ${urlArg}`, '--name Neon'];
    if (authMode === 'apiKey') {
      commandParts.push(
        `--header "Authorization: ${generatedHeaders.Authorization || 'Bearer <NEON_API_KEY>'}"`
      );
    }
    return commandParts.join(' \\\n  ');
  }, [authMode, generatedHeaders.Authorization, generatedServerUrl, queryString]);

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
    let cancelled = false;
    const listToolsBase = getListToolsBaseUrl();
    const filteredUrl = appendParams(listToolsBase, queryParams);

    setToolsPreviewLoading(true);
    setToolsPreviewError(false);
    setToolsPreviewErrorMessage('');

    Promise.all([fetchTools({ url: filteredUrl }), fetchTools({ url: listToolsBase })])
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
  }, [queryParams, toolsReloadNonce]);

  const toggleScope = (scopeId) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((item) => item !== scopeId) : [...prev, scopeId]
    );
  };

  const allScopesSelected = selectedScopes.length === SCOPE_IDS.length;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-gray-new-90 bg-white shadow-sm dark:border-gray-new-20 dark:bg-gray-new-8">
      <div className="border-b border-gray-new-90 bg-gradient-to-br from-gray-new-98 via-white to-gray-new-98 px-6 py-5 dark:border-gray-new-20 dark:from-gray-new-10 dark:via-gray-new-8 dark:to-gray-new-10">
        <h3 className="mt-0 mb-1 text-lg font-semibold text-gray-new-10 dark:text-white">
          MCP Server Config Generator
        </h3>
        <p className="mt-0 mb-0 text-sm text-gray-new-40 dark:text-gray-new-60">
          Generate a ready-to-use config for Neon&apos;s hosted MCP server.
        </p>
      </div>

      <div className="grid grid-cols-1">
        <div className="space-y-5 bg-gray-new-98/60 p-6 dark:bg-gray-new-10/30">
          <h4 className="sr-only">Configuration</h4>

          <div className={CARD_CLASS}>
            <span className={FIELD_LABEL_CLASS}>Authentication</span>
            <SegmentedControl
              name="auth-mode"
              options={AUTH_MODES}
              value={authMode}
              onChange={setAuthMode}
            />
            {authMode === 'apiKey' && (
              <label className="mt-3 block">
                <span className={FIELD_LABEL_CLASS}>Neon API key</span>
                <input
                  type="text"
                  value={apiKey}
                  placeholder="<NEON_API_KEY>"
                  className="w-full rounded-lg border border-gray-new-90 bg-white px-3 py-2 font-mono text-sm text-gray-new-20 transition-colors outline-none focus:border-secondary-8 focus:ring-2 focus:ring-secondary-8/20 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-90 dark:focus:border-primary-1 dark:focus:ring-primary-1/20"
                  onChange={(event) => setApiKey(event.target.value)}
                />
                <span className={clsx('mt-2 block', HELPER_TEXT_CLASS)}>
                  Do not commit API keys. Prefer OAuth for project-scoped MCP config files.
                </span>
              </label>
            )}
          </div>

          <div className={CARD_CLASS}>
            <span className={FIELD_LABEL_CLASS}>Access</span>
            <div className="mt-3 space-y-4">
              <Toggle
                checked={readOnly}
                label="Read-only"
                description="Limit tools to read-safe actions. Good default for exploration."
                onChange={setReadOnly}
              />
              <div>
                <label className="block">
                  <span className={FIELD_LABEL_CLASS}>Project ID (optional)</span>
                  <input
                    type="text"
                    value={projectId}
                    placeholder="proj_123"
                    className="w-full rounded-lg border border-gray-new-90 bg-white px-3 py-2 font-mono text-sm text-gray-new-20 transition-colors outline-none focus:border-secondary-8 focus:ring-2 focus:ring-secondary-8/20 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-90 dark:focus:border-primary-1 dark:focus:ring-primary-1/20"
                    onChange={(event) => setProjectId(event.target.value)}
                  />
                </label>
                <span className={clsx('mt-2 block', HELPER_TEXT_CLASS)}>
                  Scopes the agent to a single project. Hides project-wide management tools.
                </span>
              </div>
            </div>
          </div>

          <div className={CARD_CLASS}>
            <div className="flex items-center justify-between gap-3">
              <span className={clsx(FIELD_LABEL_CLASS, 'mb-0')}>Tool categories</span>
              <button
                type="button"
                className="text-xs font-medium text-secondary-8 underline-offset-2 transition-colors hover:underline dark:text-primary-1"
                onClick={() => setSelectedScopes(allScopesSelected ? [] : SCOPE_IDS)}
              >
                {allScopesSelected ? 'Clear all' : 'Select all'}
              </button>
            </div>
            <p className={clsx('mt-2 mb-3', HELPER_TEXT_CLASS)}>
              Pick which capability groups the agent can access. Unselected categories are excluded
              via the{' '}
              <code className="rounded bg-gray-new-94 px-1 py-0.5 text-[12px] dark:bg-gray-new-15">
                category
              </code>{' '}
              query param.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              {SCOPE_CATEGORIES.map((scope) => {
                const checked = selectedScopes.includes(scope.id);
                return (
                  <button
                    key={scope.id}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    className={clsx(
                      'flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-all',
                      checked
                        ? 'border-secondary-8/50 bg-secondary-8/5 dark:border-primary-1/50 dark:bg-primary-1/10'
                        : 'border-gray-new-90 bg-white hover:border-gray-new-70 hover:bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8 dark:hover:border-gray-new-30 dark:hover:bg-gray-new-10'
                    )}
                    onClick={() => toggleScope(scope.id)}
                  >
                    <span
                      className={clsx(
                        'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors',
                        checked
                          ? 'border-secondary-8 bg-secondary-8 dark:border-primary-1 dark:bg-primary-1'
                          : 'border-gray-new-70 bg-white dark:border-gray-new-30 dark:bg-gray-new-10'
                      )}
                    >
                      {checked && (
                        <svg
                          viewBox="0 0 10 10"
                          className="h-2.5 w-2.5 text-white dark:text-gray-new-10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 5 L4 7 L8 3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-gray-new-10 dark:text-white">
                        {scope.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-gray-new-40 dark:text-gray-new-60">
                        {scope.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className={SECTION_LABEL_CLASS}>
              <span className="bg-green-500 inline-block h-1 w-4 rounded-full" />
              Result
            </p>
          </div>

          <div className="rounded-xl border border-gray-new-90 bg-white p-4 dark:border-gray-new-20 dark:bg-gray-new-10">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-gray-new-40 uppercase dark:text-gray-new-60">
                Tools preview
              </span>
              <span className="text-xs text-gray-new-40 dark:text-gray-new-60">
                {selectedTools.length} enabled · {notIncludedTools.length} hidden
              </span>
            </div>

            {toolsPreviewLoading && (
              <div className="animate-pulse">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <span
                      key={`tool-skeleton-${idx}`}
                      className="inline-block h-6 w-24 rounded-md bg-gray-new-94 dark:bg-gray-new-15"
                    />
                  ))}
                </div>
              </div>
            )}

            {toolsPreviewError && (
              <div className="rounded-lg border border-secondary-1/40 bg-secondary-1/5 px-3 py-2.5 text-secondary-1 dark:border-secondary-1/30 dark:bg-secondary-1/10 dark:text-secondary-4">
                <p className="m-0 text-[13px]">
                  Could not refresh selected tools.
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
              <>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTools.map((tool) => (
                    <span
                      key={tool.name}
                      className="inline-flex items-center rounded-md border border-secondary-8/30 bg-secondary-8/5 px-2 py-1 font-mono text-[11px] leading-tight text-secondary-8 dark:border-primary-1/30 dark:bg-primary-1/10 dark:text-primary-1"
                    >
                      {tool.title || tool.name}
                    </span>
                  ))}
                  {selectedTools.length === 0 && (
                    <span className="text-[13px] text-gray-new-40 dark:text-gray-new-60">
                      No tools match the current configuration.
                    </span>
                  )}
                </div>
                {notIncludedTools.length > 0 && (
                  <>
                    <div className="my-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-gray-new-90 dark:bg-gray-new-20" />
                      <span className="text-[10px] font-semibold tracking-wider text-gray-new-40 uppercase dark:text-gray-new-60">
                        Hidden
                      </span>
                      <span className="h-px flex-1 bg-gray-new-90 dark:bg-gray-new-20" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {notIncludedTools.map((tool) => (
                        <span
                          key={tool.name}
                          className="inline-flex items-center rounded-md border border-gray-new-90 bg-gray-new-98 px-2 py-1 font-mono text-[11px] leading-tight text-gray-new-40 line-through decoration-gray-new-70/60 dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-gray-new-60 dark:decoration-gray-new-30/60"
                        >
                          {tool.title || tool.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div>
            <span className={FIELD_LABEL_CLASS}>add-mcp command</span>
            <CodeBlockWrapper
              className="rounded-xl border border-gray-new-90 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10"
              as="div"
              copyCode={addMcpCommand}
            >
              <HighlightedCode code={addMcpCommand} language="bash" />
            </CodeBlockWrapper>
          </div>

          <div>
            <span className={FIELD_LABEL_CLASS}>MCP JSON config</span>
            <CodeBlockWrapper
              className="rounded-xl border border-gray-new-90 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10"
              as="div"
              copyCode={generatedConfig}
            >
              <HighlightedCode code={generatedConfig} language="json" />
            </CodeBlockWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default McpSetupConfigurator;
