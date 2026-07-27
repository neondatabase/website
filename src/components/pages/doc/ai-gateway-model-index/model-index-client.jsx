'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SiMeta } from 'react-icons/si';

import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';

import AlibabaIcon from './images/alibaba.inline.svg';
import AnthropicIcon from './images/anthropic.inline.svg';
import GoogleIcon from './images/google.inline.svg';
import OpenAIIcon from './images/openai.inline.svg';
import { PROVIDER_ORDER, providerLabel } from './model-rows';

const ASIDE_COLLISION_GAP = 24;

const COLUMNS = [
  { key: 'name', label: 'Model', sortable: true },
  { key: 'id', label: 'Model ID', sortable: true },
  { key: 'provider', label: 'Provider', sortable: true },
  { key: 'inputs', label: 'Inputs', sortable: false },
  { key: 'contextWindow', label: 'Context', sortable: true },
  { key: 'releaseDate', label: 'Released', sortable: true },
  { key: 'costInput', label: 'Input /M', sortable: true },
  { key: 'costOutput', label: 'Output /M', sortable: true },
  { key: 'openWeights', label: 'License', sortable: true },
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

const PROVIDER_ICONS = {
  alibaba: AlibabaIcon,
  anthropic: AnthropicIcon,
  google: GoogleIcon,
  openai: OpenAIIcon,
  meta: SiMeta,
};

const ProviderLogo = ({ provider }) => {
  const Icon = PROVIDER_ICONS[provider];

  if (!Icon) return null;

  return (
    <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden" aria-hidden>
      <Icon className="size-5" />
    </span>
  );
};

ProviderLogo.propTypes = {
  provider: PropTypes.string.isRequired,
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
          'flex h-9 items-center gap-2 border bg-white px-3 text-[13px] text-black-new transition-colors dark:bg-black-new dark:text-white',
          selected.size > 0
            ? 'border-gray-new-60 dark:border-gray-new-50'
            : 'border-gray-new-80 hover:border-gray-new-60 dark:border-gray-new-20'
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
          className="absolute left-0 z-20 mt-1 min-w-[190px] border border-gray-new-80 bg-white p-1 shadow-lg dark:border-gray-new-20 dark:bg-gray-new-10"
        >
          {providers.map((providerId) => {
            const checked = selected.has(providerId);
            return (
              <button
                key={providerId}
                type="button"
                role="option"
                aria-selected={checked}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm text-gray-new-30 transition-colors hover:bg-gray-new-98 dark:text-gray-new-80 dark:hover:bg-gray-new-8"
                onClick={() => onToggle(providerId)}
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center border transition-colors',
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

// Keep model IDs copyable without triggering the row navigation.
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
      <code className="rounded-sm border border-gray-new-80 bg-gray-new-98 px-1 py-px font-mono text-[13px] leading-none whitespace-nowrap text-gray-new-30 group-hover/copy:text-gray-new-10 dark:border-gray-new-30 dark:bg-black-new dark:text-gray-new-85 dark:group-hover/copy:text-white">
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

const ModelIndexClient = ({ rows }) => {
  const router = useRouter();
  const rootRef = useRef(null);
  const [mode, setMode] = useState('text');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState(() => new Set());
  const [openWeightsOnly, setOpenWeightsOnly] = useState(false);
  const [sort, setSort] = useState({ key: 'releaseDate', dir: 'desc' });

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

  const getModelHref = (modelId) =>
    `/docs/ai-gateway/models/${encodeURIComponent(modelId)}${mode === 'image' ? '?mode=image' : ''}`;

  useEffect(() => {
    const root = rootRef.current;
    const aside = document.querySelector('[data-docs-aside]');
    const stickyContent = aside?.firstElementChild;

    if (!root || !aside || !stickyContent) return undefined;

    let animationFrame;
    const updateOcclusion = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const rootRect = root.getBoundingClientRect();
        const stickyTop = Number.parseFloat(getComputedStyle(stickyContent).top) || 0;
        const stickyBottom = stickyTop + stickyContent.offsetHeight;
        const obstacleTop = rootRect.top - ASIDE_COLLISION_GAP;
        const obstacleBottom = rootRect.bottom + ASIDE_COLLISION_GAP;
        const overlaps = obstacleTop < stickyBottom && obstacleBottom > stickyTop;
        let translateY = 0;
        let occluded = false;

        if (overlaps) {
          if (obstacleTop > stickyTop) {
            // The table is approaching from below: let the sticky rail be
            // pushed upward so its lower edge stops before the wide block.
            translateY = obstacleTop - stickyBottom;
          } else if (obstacleBottom < stickyBottom) {
            // The table has passed: reveal the rail immediately below it and
            // let it settle back into its sticky position.
            translateY = obstacleBottom - stickyTop;
          } else {
            translateY = -stickyContent.offsetHeight;
            occluded = true;
          }
        }

        stickyContent.style.transform = `translate3d(0, ${translateY}px, 0)`;
        aside.dataset.occluded = String(occluded);
        aside.inert = occluded;
      });
    };

    const resizeObserver = new ResizeObserver(updateOcclusion);
    resizeObserver.observe(root);
    resizeObserver.observe(stickyContent);
    window.addEventListener('scroll', updateOcclusion, { passive: true });
    window.addEventListener('resize', updateOcclusion);
    updateOcclusion();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateOcclusion);
      window.removeEventListener('resize', updateOcclusion);
      delete aside.dataset.occluded;
      aside.inert = false;
      stickyContent.style.removeProperty('transform');
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="not-prose relative z-20 my-11 w-[min(1380px,calc(100vw-472px))] bg-white dark:bg-black-pure 2xl:w-[calc(100vw-408px)] xl:w-full md:my-8"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <label className="relative w-[348px] max-w-full">
          <span className="sr-only">Search models</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-gray-new-50 dark:text-gray-new-60" />
          <input
            className="h-9 w-full border border-gray-new-80 bg-white pr-4 pl-9 text-[13px] text-gray-new-15 outline-none placeholder:text-gray-new-50 focus:border-secondary-8 dark:border-gray-new-20 dark:bg-black-new dark:text-white dark:placeholder:text-gray-new-60 dark:focus:border-primary-1 md:text-base"
            type="search"
            value={search}
            placeholder="Search model, ID, or provider..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-9 border border-gray-new-80 bg-white p-1 dark:border-gray-new-20 dark:bg-black-new">
            {[
              { key: 'text', label: 'Text' },
              { key: 'image', label: 'Image' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={cn(
                  'px-3 text-[13px] font-medium tracking-normal transition-colors',
                  mode === tab.key
                    ? 'bg-gray-new-94 text-gray-new-10 dark:bg-gray-new-10 dark:text-white'
                    : 'text-gray-new-50 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-80'
                )}
                onClick={() => changeMode(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === 'text' && (
            <>
              <ProviderMultiSelect
                providers={providers}
                selected={providerFilter}
                onToggle={toggleProvider}
                onClear={() => setProviderFilter(new Set())}
              />
              <label className="flex h-9 cursor-pointer items-center gap-2 border border-gray-new-80 bg-white px-3 text-[13px] tracking-normal text-gray-new-40 dark:border-gray-new-20 dark:bg-black-new dark:text-white">
                <input
                  type="checkbox"
                  className="size-3 rounded-none border-gray-new-40 accent-secondary-8 dark:accent-primary-1"
                  checked={openWeightsOnly}
                  onChange={(event) => setOpenWeightsOnly(event.target.checked)}
                />
                Open weights only
              </label>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-new-80 bg-white dark:border-gray-new-20 dark:bg-black-pure">
        <table className="ai-gateway-model-table my-0! w-full min-w-[1160px]! table-fixed border-collapse text-[13px]">
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[21%]" />
            <col className="w-[10%]" />
            <col className="w-[15%]" />
            <col className="w-[7%]" />
            <col className="w-[8%]" />
            <col className="w-[6%]" />
            <col className="w-[6%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-new-80 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8">
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4! py-3.5! text-left! text-xs font-medium whitespace-nowrap text-gray-new-50 dark:text-gray-new-60"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="group inline-flex items-center transition-colors hover:text-gray-new-20 dark:hover:text-white"
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
              const href = getModelHref(row.id);
              return (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-gray-new-80 transition-colors last:border-b-0 hover:bg-gray-new-98 dark:border-gray-new-20 dark:hover:bg-gray-new-8"
                  onClick={(event) => {
                    if (!event.target.closest('a, button, input, select')) router.push(href);
                  }}
                >
                  <td className="py-4! pl-4! text-left!">
                    <Link
                      href={href}
                      className="font-medium text-gray-new-10 no-underline! dark:text-white"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-4! pl-4! text-left!">
                    <CopyableModelId id={row.id} />
                  </td>
                  <td className="py-4! pl-4! text-left! text-[13px]! text-gray-new-30 dark:text-gray-new-80">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <ProviderLogo provider={row.provider} />
                      {row.providerName}
                    </span>
                  </td>
                  <td className="py-4! pl-4! text-left! text-[13px]! text-gray-new-40 dark:text-gray-new-60">
                    {row.inputsLabel}
                  </td>
                  <td className="py-4! pl-4! text-left! font-mono text-[13px]! text-gray-new-30 dark:text-gray-new-80">
                    {row.contextLabel}
                  </td>
                  <td className="py-4! pl-4! text-left! text-[13px]! text-gray-new-40 dark:text-gray-new-60">
                    {row.releaseLabel}
                  </td>
                  <td className="py-4! pl-4! text-left! font-mono text-[13px]! text-gray-new-30 dark:text-gray-new-80">
                    {row.costInputLabel}
                  </td>
                  <td className="py-4! pl-4! text-left! font-mono text-[13px]! text-gray-new-30 dark:text-gray-new-80">
                    {row.costOutputLabel}
                  </td>
                  <td className="pr-4 text-left! text-[13px]! whitespace-nowrap text-gray-new-40 dark:text-gray-new-60">
                    {row.openWeights ? 'Open weights' : '—'}
                  </td>
                </tr>
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
};

export default ModelIndexClient;
