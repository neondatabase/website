'use client';

import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import highlight from 'lib/shiki';
import { cn } from 'utils/cn';

import { PROVIDER_ORDER, providerLabel } from './model-rows';

const COLUMNS = [
  { key: 'name', label: 'Model', sortable: true, align: 'left' },
  { key: 'id', label: 'Model ID', sortable: true, align: 'left' },
  { key: 'provider', label: 'Provider', sortable: true, align: 'left' },
  { key: 'inputs', label: 'Inputs', sortable: false, align: 'left' },
  { key: 'contextWindow', label: 'Context', sortable: true, align: 'right' },
  { key: 'releaseDate', label: 'Released', sortable: true, align: 'right' },
  { key: 'costInput', label: 'Input /M', sortable: true, align: 'right' },
  { key: 'costOutput', label: 'Output /M', sortable: true, align: 'right' },
  { key: 'openWeights', label: 'License', sortable: true, align: 'left' },
];

const compareRows = (a, b, key) => {
  switch (key) {
    case 'contextWindow':
    case 'costInput':
    case 'costOutput': {
      const av = a[key];
      const bv = b[key];
      if (av === undefined && bv === undefined) return 0;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      return av - bv;
    }
    case 'openWeights':
      return Number(a.openWeights) - Number(b.openWeights);
    case 'releaseDate':
      return (a.releaseDate ?? '').localeCompare(b.releaseDate ?? '');
    default:
      return String(a[key]).localeCompare(String(b[key]));
  }
};

// Client-side syntax highlighting with a graceful <pre> fallback — the same
// pattern the API reference / MCP configurator use (lib/shiki in useEffect).
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

const SortArrow = ({ active, dir }) => (
  <span
    className={cn(
      'ml-1 inline-block text-[10px] transition-opacity',
      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
    )}
    aria-hidden
  >
    {active && dir === 'asc' ? '▲' : '▼'}
  </span>
);

SortArrow.propTypes = {
  active: PropTypes.bool.isRequired,
  dir: PropTypes.string.isRequired,
};

const CheckMark = () => (
  <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 5 L4 7 L8 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Provider filter as a compact multi-select dropdown — stays a single control
// no matter how many providers the catalog grows to.
const ProviderMultiSelect = ({ providers, selected, onToggle, onClear }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const label = selected.size === 0 ? 'All providers' : `Providers (${selected.size})`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm transition-colors dark:bg-gray-new-8',
          selected.size > 0
            ? 'border-secondary-8/50 text-secondary-8 dark:border-primary-1/50 dark:text-primary-1'
            : 'border-gray-new-80 text-gray-new-40 hover:border-gray-new-60 dark:border-gray-new-20 dark:text-gray-new-60'
        )}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <svg
          viewBox="0 0 12 12"
          className={cn('size-3 shrink-0 transition-transform', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M3 4.5 L6 7.5 L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 z-20 mt-1 min-w-[190px] rounded-md border border-gray-new-80 bg-white p-1 shadow-lg dark:border-gray-new-20 dark:bg-gray-new-10"
        >
          {providers.map((providerId) => {
            const checked = selected.has(providerId);
            return (
              <button
                key={providerId}
                type="button"
                role="option"
                aria-selected={checked}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-gray-new-30 transition-colors hover:bg-gray-new-98 dark:text-gray-new-80 dark:hover:bg-gray-new-8"
                onClick={() => onToggle(providerId)}
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
                    checked
                      ? 'border-secondary-8 bg-secondary-8 text-white dark:border-primary-1 dark:bg-primary-1'
                      : 'border-gray-new-70 dark:border-gray-new-30'
                  )}
                >
                  {checked && <CheckMark />}
                </span>
                {providerLabel(providerId)}
              </button>
            );
          })}
          {selected.size > 0 && (
            <button
              type="button"
              className="mt-1 w-full border-t border-gray-new-90 px-2 pt-2 pb-1 text-left text-xs font-medium text-secondary-8 dark:border-gray-new-20 dark:text-primary-1"
              onClick={onClear}
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ProviderMultiSelect.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

// Click-to-copy model id. Stops propagation so copying doesn't also toggle the
// row's expand/collapse.
const CopyableModelId = ({ id }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(2000);
  return (
    <button
      type="button"
      className="group/copy inline-flex items-center gap-1.5 rounded text-left transition-colors"
      aria-label={isCopied ? 'Copied' : `Copy ${id}`}
      title={isCopied ? 'Copied' : 'Copy model ID'}
      onClick={(event) => {
        event.stopPropagation();
        handleCopy(id);
      }}
    >
      <code className="font-mono text-[13px] whitespace-nowrap text-gray-new-30 group-hover/copy:text-gray-new-10 dark:text-gray-new-80 dark:group-hover/copy:text-white">
        {id}
      </code>
      {isCopied ? (
        <CheckIcon className="size-3 shrink-0 text-green-45" />
      ) : (
        <CopyIcon className="size-3 shrink-0 text-gray-new-50 opacity-0 transition-opacity group-hover/copy:opacity-100 dark:text-gray-new-60" />
      )}
    </button>
  );
};

CopyableModelId.propTypes = {
  id: PropTypes.string.isRequired,
};

// The expanded quickstart panel under a selected row.
const RowDetail = ({ row, snippets, mode }) => {
  const languages = useMemo(() => {
    const all = snippets.tabs[mode]?.languages ?? [];
    // Mastra can't reach Responses-only (Codex) models through the
    // OpenAI-compatible endpoint yet, so drop it for those in the text tab.
    if (mode === 'text' && row.isResponsesOnly) {
      return all.filter((lang) => lang.key !== 'mastra');
    }
    return all;
  }, [snippets, mode, row.isResponsesOnly]);

  const [langKey, setLangKey] = useState(languages[0]?.key);
  const [view, setView] = useState('code');

  useEffect(() => {
    setLangKey(languages[0]?.key);
    setView('code');
  }, [languages]);

  const activeLang = languages.find((lang) => lang.key === langKey) ?? languages[0];
  if (!activeLang) return null;

  const placeholder = snippets.modelIdPlaceholder;
  const codeForModel = activeLang.code.split(placeholder).join(row.id);
  const isEnv = view === 'env';
  const shownCode = isEnv ? snippets.envExample : codeForModel;
  const shownLang = isEnv ? 'bash' : activeLang.lang;
  // The code sub-tab always shows the language's filename; only the `.env` tab
  // is fixed. (Computing it from `isEnv` would mislabel the code tab as `.env`.)
  const codeFilename =
    { typescript: 'index.ts', python: 'main.py', bash: 'request.sh' }[activeLang.lang] || 'snippet';

  const specs = [
    { label: 'Context', value: row.contextLabel },
    { label: 'Input', value: `${row.costInputLabel}/M` },
    { label: 'Output', value: `${row.costOutputLabel}/M` },
    { label: 'Knowledge', value: row.knowledge || '—' },
    { label: 'Endpoints', value: row.endpoints.join(' · ') },
  ];

  return (
    <div className="flex flex-col gap-4 border-t border-gray-new-90 bg-gray-new-98 p-4 dark:border-gray-new-20 dark:bg-gray-new-8">
      <dl className="flex flex-wrap gap-x-6 gap-y-2">
        {specs.map((spec) => (
          <div key={spec.label} className="flex flex-col gap-0.5">
            <dt className="text-[10px] font-semibold tracking-wide text-gray-new-50 uppercase dark:text-gray-new-60">
              {spec.label}
            </dt>
            <dd className="m-0 font-mono text-[13px] text-gray-new-20 dark:text-gray-new-90">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-gray-new-50 uppercase dark:text-gray-new-60">
            Language
          </span>
          <select
            className="h-8 rounded-md border border-gray-new-80 bg-white px-2 text-sm text-gray-new-20 outline-none focus:border-secondary-8 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-90 dark:focus:border-primary-1"
            value={activeLang.key}
            onChange={(event) => {
              setLangKey(event.target.value);
              setView('code');
            }}
          >
            {languages.map((lang) => (
              <option key={lang.key} value={lang.key}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>

        {activeLang.install && (
          <code className="rounded bg-gray-new-94 px-2 py-1 text-[12px] text-gray-new-30 dark:bg-gray-new-15 dark:text-gray-new-80">
            {activeLang.install}
          </code>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1 border border-b-0 border-gray-new-80 bg-gray-new-98 px-1 pt-1 dark:border-gray-new-20 dark:bg-gray-new-8">
          {[
            { key: 'code', label: codeFilename },
            { key: 'env', label: '.env' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={cn(
                'rounded-t-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                (tab.key === 'env') === isEnv
                  ? 'bg-white text-gray-new-10 dark:bg-gray-new-10 dark:text-white'
                  : 'text-gray-new-50 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-80'
              )}
              onClick={() => setView(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CodeBlockWrapper
          className="overflow-hidden rounded-b-md border border-gray-new-80 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10"
          as="div"
          copyCode={shownCode}
        >
          <HighlightedCode code={shownCode} language={shownLang} />
        </CodeBlockWrapper>
      </div>
    </div>
  );
};

RowDetail.propTypes = {
  row: PropTypes.object.isRequired,
  snippets: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
};

const ModelIndexClient = ({ rows, snippets }) => {
  const [mode, setMode] = useState('text');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState(() => new Set());
  const [openWeightsOnly, setOpenWeightsOnly] = useState(false);
  const [sort, setSort] = useState({ key: 'releaseDate', dir: 'desc' });
  const [expandedId, setExpandedId] = useState(null);

  const providers = useMemo(() => {
    const present = new Set(rows.map((row) => row.provider));
    return [
      ...PROVIDER_ORDER.filter((p) => present.has(p)),
      ...[...present].filter((p) => !PROVIDER_ORDER.includes(p)),
    ];
  }, [rows]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = rows.filter((row) => (mode === 'image' ? row.isImageCapable : true));
    if (mode === 'text') {
      if (providerFilter.size > 0) list = list.filter((row) => providerFilter.has(row.provider));
      if (openWeightsOnly) list = list.filter((row) => row.openWeights);
    }
    if (query) {
      list = list.filter(
        (row) =>
          row.name.toLowerCase().includes(query) ||
          row.id.toLowerCase().includes(query) ||
          row.providerName.toLowerCase().includes(query)
      );
    }
    const sorted = [...list].sort((a, b) => compareRows(a, b, sort.key));
    return sort.dir === 'desc' ? sorted.reverse() : sorted;
  }, [rows, mode, providerFilter, openWeightsOnly, search, sort]);

  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setExpandedId(null);
  };

  const onSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const toggleProvider = (providerId) => {
    setProviderFilter((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) next.delete(providerId);
      else next.add(providerId);
      return next;
    });
  };

  return (
    <div className="not-prose my-6">
      {/* Text / Image tabs */}
      <div className="mb-4 inline-flex rounded-lg border border-gray-new-90 bg-gray-new-98 p-1 dark:border-gray-new-20 dark:bg-gray-new-8">
        {[
          { key: 'text', label: 'Text' },
          { key: 'image', label: 'Image' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              mode === tab.key
                ? 'bg-white text-gray-new-10 shadow-sm dark:bg-gray-new-10 dark:text-white'
                : 'text-gray-new-50 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-80'
            )}
            onClick={() => changeMode(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[200px] flex-1">
          <span className="sr-only">Search models</span>
          <input
            className="h-10 w-full rounded-md border border-gray-new-80 bg-white px-3 text-sm text-gray-new-15 outline-none placeholder:text-gray-new-50 focus:border-secondary-8 dark:border-gray-new-20 dark:bg-black-pure dark:text-white dark:placeholder:text-gray-new-60 dark:focus:border-primary-1"
            type="search"
            value={search}
            placeholder="Search model, ID, or provider..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        {mode === 'text' && (
          <>
            <ProviderMultiSelect
              providers={providers}
              selected={providerFilter}
              onToggle={toggleProvider}
              onClear={() => setProviderFilter(new Set())}
            />
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-gray-new-40 dark:text-gray-new-60">
              <input
                type="checkbox"
                className="size-4 rounded border-gray-new-70 accent-secondary-8 dark:accent-primary-1"
                checked={openWeightsOnly}
                onChange={(event) => setOpenWeightsOnly(event.target.checked)}
              />
              Open weights only
            </label>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-new-90 dark:border-gray-new-20">
        <table className="my-0! w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8">
              {COLUMNS.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-3 py-2.5 font-medium text-gray-new-40 dark:text-gray-new-60',
                    index === 0 && 'pl-5',
                    index === COLUMNS.length - 1 && 'pr-5',
                    column.align === 'right' ? 'text-right' : 'text-left'
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={cn(
                        'group inline-flex items-center transition-colors hover:text-gray-new-20 dark:hover:text-white',
                        column.align === 'right' && 'flex-row-reverse'
                      )}
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      <SortArrow active={sort.key === column.key} dir={sort.dir} />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const expanded = expandedId === row.id;
              return (
                <Fragment key={row.id}>
                  <tr
                    className={cn(
                      'cursor-pointer border-t border-gray-new-90 transition-colors first:border-t-0 hover:bg-gray-new-98 dark:border-gray-new-20 dark:hover:bg-gray-new-8',
                      expanded && 'bg-gray-new-98 dark:bg-gray-new-8'
                    )}
                    onClick={() => setExpandedId(expanded ? null : row.id)}
                  >
                    <td className="py-2.5 pr-3 pl-5 font-medium text-gray-new-10 dark:text-white">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={cn(
                            'inline-block text-[9px] text-gray-new-50 transition-transform',
                            expanded && 'rotate-90'
                          )}
                          aria-hidden
                        >
                          ▶
                        </span>
                        {row.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <CopyableModelId id={row.id} />
                    </td>
                    <td className="px-3 py-2.5 text-gray-new-30 dark:text-gray-new-80">
                      {row.providerName}
                    </td>
                    <td className="px-3 py-2.5 text-gray-new-40 dark:text-gray-new-60">
                      {row.inputsLabel}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[13px] text-gray-new-30 dark:text-gray-new-80">
                      {row.contextLabel}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-new-40 dark:text-gray-new-60">
                      {row.releaseLabel}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[13px] text-gray-new-30 dark:text-gray-new-80">
                      {row.costInputLabel}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[13px] text-gray-new-30 dark:text-gray-new-80">
                      {row.costOutputLabel}
                    </td>
                    <td className="py-2.5 pr-5 pl-3 whitespace-nowrap text-gray-new-40 dark:text-gray-new-60">
                      {row.openWeights ? 'Open weights' : '—'}
                    </td>
                  </tr>
                  {expanded && (
                    <tr>
                      <td colSpan={COLUMNS.length} className="p-0">
                        <RowDetail row={row} snippets={snippets} mode={mode} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-3 py-8 text-center text-gray-new-40 dark:text-gray-new-60"
                >
                  No models match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[13px] text-gray-new-40 dark:text-gray-new-60">
        Prices are provider list prices per million tokens. Inference is free during the private
        preview. Click a model for a copy-paste quickstart.
      </p>
    </div>
  );
};

ModelIndexClient.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  snippets: PropTypes.shape({
    modelIdPlaceholder: PropTypes.string.isRequired,
    tabs: PropTypes.object.isRequired,
    envExample: PropTypes.string.isRequired,
  }).isRequired,
};

export default ModelIndexClient;
