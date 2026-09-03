'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { SiMeta } from 'react-icons/si';

import StickyTable from 'components/pages/doc/sticky-table';
import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';

import AlibabaIcon from './images/alibaba.inline.svg';
import AnthropicIcon from './images/anthropic.inline.svg';
import GoogleIcon from './images/google.inline.svg';
import OpenAIIcon from './images/openai.inline.svg';
import { MODEL_CATALOG_NOTE, PROVIDER_ORDER, providerLabel } from './model-rows';

const ASIDE_COLLISION_GAP = 24;

const MODEL_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'text', label: 'Text' },
  { key: 'image', label: 'Image' },
];

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

const VARIANT_STYLES = {
  docs: {
    root: 'my-11 w-[min(1380px,calc(100vw-472px))] bg-white dark:bg-black-pure 2xl:w-[calc(100vw-408px)] xl:w-full md:my-8',
    filters: 'top-[var(--docs-header-height)] bg-white dark:bg-black-pure lg:top-0',
    table: 'min-w-290!',
  },
  landing: {
    root: 'mt-17.5 w-full bg-black-pure [--docs-header-height:3.75rem] lg:[--docs-header-height:0] md:mt-12',
    filters: 'top-[var(--docs-header-height)] bg-black-pure',
    table: 'min-w-300!',
  },
};

const compareRows = (a, b, key, direction) => {
  const directionMultiplier = direction === 'desc' ? -1 : 1;

  switch (key) {
    case 'contextWindow':
    case 'costInput':
    case 'costOutput': {
      const av = a[key];
      const bv = b[key];
      if (av === undefined && bv === undefined) return 0;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      return (av - bv) * directionMultiplier;
    }
    case 'openWeights':
      return (Number(a.openWeights) - Number(b.openWeights)) * directionMultiplier;
    case 'releaseDate': {
      if (!a.releaseDate && !b.releaseDate) return 0;
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;

      return a.releaseDate.localeCompare(b.releaseDate) * directionMultiplier;
    }
    default:
      return String(a[key]).localeCompare(String(b[key])) * directionMultiplier;
  }
};

const SortArrow = ({ active, dir }) => (
  <span
    className={cn(
      'ml-1 inline-block text-[.625rem] transition-opacity',
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
  <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1.5 5 L4 7.5 L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
    <path
      d="M1.5 1.5L10.5 10.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 1.5L1.5 10.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Provider filter as a compact multi-select dropdown — stays a single control
// no matter how many providers the catalog grows to.
const ProviderMultiSelect = ({ providers, selected, onToggle, onClear }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      setOpen(false);
      buttonRef.current?.focus();
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
    <div
      ref={ref}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-controls={open ? listboxId : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex h-9 items-center gap-2 border bg-transparent px-3 text-[.8125rem] text-gray-new-15 transition-colors outline-none hover:border-gray-new-70 focus:border-gray-new-30 dark:text-[#F1F2F4] dark:hover:border-gray-new-30 dark:focus:border-gray-new-60',
          open
            ? 'border-gray-new-30 dark:border-gray-new-60'
            : selected.size > 0
              ? 'border-gray-new-60 dark:border-gray-new-40'
              : 'border-gray-new-80 dark:border-gray-new-20'
        )}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="min-w-19">{label}</span>
        <svg
          viewBox="0 0 12 12"
          className={cn(
            'size-3 shrink-0 text-gray-new-40 transition-transform',
            open && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M1.75 4.25L6 8.5L10.25 4.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Model providers"
          aria-multiselectable="true"
          className="absolute left-0 z-20 mt-1 min-w-47.5 border border-gray-new-80 bg-white p-1 shadow-lg dark:border-gray-new-20 dark:bg-gray-new-10"
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
                    'flex size-3.5 shrink-0 items-center justify-center border transition-colors',
                    checked
                      ? 'border-[#2D8665] bg-[#2D8665] text-white dark:border-green-52 dark:bg-green-52 dark:text-black-new'
                      : 'border-gray-new-40'
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
      className="group/copy inline-flex max-w-full min-w-0 items-center gap-1.5 rounded text-left transition-colors"
      aria-label={isCopied ? 'Copied' : `Copy ${id}`}
      title={isCopied ? 'Copied' : 'Copy model ID'}
      onClick={(event) => {
        event.stopPropagation();
        handleCopy(id);
      }}
    >
      <code
        className="min-w-0 overflow-hidden rounded-sm border border-gray-new-80 bg-gray-new-98 px-1 py-px font-mono text-[.8125rem] leading-none text-ellipsis whitespace-nowrap text-gray-new-30 group-hover/copy:text-gray-new-10 dark:border-gray-new-30 dark:bg-black-new dark:text-gray-new-85 dark:group-hover/copy:text-white"
        title={id}
      >
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

const ModelIndexClient = ({ rows, variant = 'docs' }) => {
  const router = useRouter();
  const rootRef = useRef(null);
  const filtersRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchId = useId();
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState(() => new Set());
  const [openWeightsOnly, setOpenWeightsOnly] = useState(false);
  const [sort, setSort] = useState({ key: 'releaseDate', dir: 'desc' });
  const [filtersHeight, setFiltersHeight] = useState(0);

  const providers = useMemo(() => {
    const present = new Set(rows.map((row) => row.provider));
    return [
      ...PROVIDER_ORDER.filter((p) => present.has(p)),
      ...[...present].filter((p) => !PROVIDER_ORDER.includes(p)),
    ];
  }, [rows]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = rows.filter((row) => {
      if (mode === 'image') return row.isImageCapable;
      if (mode === 'text') return row.inputs.includes('text');
      return true;
    });
    if (providerFilter.size > 0) list = list.filter((row) => providerFilter.has(row.provider));
    if (openWeightsOnly) list = list.filter((row) => row.openWeights);
    if (query) {
      list = list.filter(
        (row) =>
          row.name.toLowerCase().includes(query) ||
          row.id.toLowerCase().includes(query) ||
          row.providerName.toLowerCase().includes(query)
      );
    }
    return [...list].sort((a, b) => compareRows(a, b, sort.key, sort.dir));
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

  const variantStyles = VARIANT_STYLES[variant];

  useEffect(() => {
    const filters = filtersRef.current;
    if (!filters) return undefined;

    const updateFiltersHeight = () => setFiltersHeight(filters.offsetHeight);
    const resizeObserver = new ResizeObserver(updateFiltersHeight);
    resizeObserver.observe(filters);
    updateFiltersHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (variant !== 'docs') return undefined;

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
  }, [variant]);

  return (
    <div ref={rootRef} className={cn('not-prose relative z-20', variantStyles.root)}>
      <div
        ref={filtersRef}
        className={cn(
          'sticky z-50 mb-0 flex flex-wrap items-center justify-between gap-3 pt-5 pb-5',
          variantStyles.filters
        )}
      >
        <div className="flex max-w-full flex-wrap items-center gap-3">
          <div className="relative w-87 max-w-full">
            <label className="sr-only" htmlFor={searchId}>
              Search models
            </label>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-gray-new-30 dark:text-gray-new-70" />
            <input
              ref={searchInputRef}
              id={searchId}
              className="h-9 w-full border border-gray-new-80 bg-gray-new-98 pr-10 pl-9 text-[.8125rem] text-black-pure transition-colors outline-none placeholder:text-gray-new-40 hover:border-gray-new-70 focus:border-gray-new-30 dark:border-gray-new-20 dark:bg-black-new dark:text-white dark:placeholder:text-gray-new-60 dark:hover:border-gray-new-30 dark:focus:border-gray-new-60 md:text-base search-cancel:appearance-none"
              type="search"
              value={search}
              placeholder="Search model, ID, or provider..."
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute top-1/2 right-3 flex size-5 -translate-y-1/2 items-center justify-center text-gray-new-60 transition-colors hover:text-gray-new-40 dark:text-gray-new-70 dark:hover:text-gray-new-80"
                aria-label="Clear search"
                onClick={() => {
                  setSearch('');
                  searchInputRef.current?.focus();
                }}
              >
                <ClearIcon />
              </button>
            )}
          </div>

          <div
            className="inline-flex h-9 border border-gray-new-80 bg-white p-0.75 dark:border-gray-new-20 dark:bg-black-new"
            role="group"
            aria-label="Filter models by type"
          >
            {MODEL_TYPES.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={mode === tab.key}
                className={cn(
                  'px-2 text-[.8125rem] font-medium tracking-normal transition-colors focus-visible:outline-gray-new-30 focus-visible:dark:outline-gray-new-60',
                  mode === tab.key
                    ? 'bg-gray-new-94 text-gray-new-10 dark:bg-[#1D1E20] dark:text-white'
                    : 'text-gray-new-50 hover:text-gray-new-30 dark:text-[#8E9196] dark:hover:text-gray-new-80'
                )}
                onClick={() => changeMode(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ProviderMultiSelect
            providers={providers}
            selected={providerFilter}
            onToggle={toggleProvider}
            onClear={() => setProviderFilter(new Set())}
          />
          <label
            className={cn(
              'group/check flex h-9 cursor-pointer items-center gap-2 border bg-transparent px-3 text-[.8125rem] tracking-normal text-gray-new-15 transition-colors focus-within:border-gray-new-30 hover:border-gray-new-70 dark:text-[#F1F2F4] dark:focus-within:border-gray-new-60 dark:hover:border-gray-new-30',
              openWeightsOnly
                ? 'border-gray-new-60 dark:border-gray-new-40'
                : 'border-gray-new-80 dark:border-gray-new-20'
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={openWeightsOnly}
              onChange={(event) => setOpenWeightsOnly(event.target.checked)}
            />
            <span
              className={cn(
                'flex size-3 shrink-0 items-center justify-center border transition-colors',
                openWeightsOnly
                  ? 'border-[#2D8665] bg-[#2D8665] text-white dark:border-green-52 dark:bg-green-52 dark:text-black-new'
                  : 'border-gray-new-60 group-hover/check:border-gray-new-40 dark:border-gray-new-40 group-hover/check:dark:border-gray-new-60'
              )}
              aria-hidden
            >
              {openWeightsOnly && <CheckMark />}
            </span>
            Open weights only
          </label>
        </div>
      </div>

      <StickyTable
        className={cn(
          'ai-gateway-model-table my-0! w-full table-fixed border-collapse text-[.8125rem]',
          variantStyles.table
        )}
        headerClassName="pointer-events-auto! border-x border-t border-gray-new-80 2xl:px-0! dark:border-gray-new-20"
        headerKey={`${sort.key}:${sort.dir}`}
        interactiveHeader
        nativeSticky
        stickyTopOffset={filtersHeight}
      >
        <div className="table-wrapper my-0! overflow-x-auto border border-gray-new-80 bg-white dark:border-gray-new-20 dark:bg-black-pure 2xl:mx-0! 2xl:px-0!">
          <table
            className={cn(
              'ai-gateway-model-table my-0! w-full table-fixed border-collapse text-[.8125rem]',
              variantStyles.table
            )}
          >
            <colgroup>
              <col className="w-[19%]" />
              <col className="w-[21%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[5%]" />
              <col className="w-[8%]" />
              <col className="w-[5%]" />
              <col className="w-[5%]" />
              <col className="w-[9%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-new-80 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8">
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? sort.key === column.key
                          ? sort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                    className="px-4! py-3.5! text-left! text-xs font-medium whitespace-nowrap text-gray-new-50 dark:text-gray-new-60"
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="group inline-flex items-center transition-colors hover:text-gray-new-20 dark:hover:text-white"
                        aria-label={`Sort by ${column.label}${
                          sort.key === column.key ? `, currently ${sort.dir}ending` : ''
                        }`}
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
                    <td className="py-4! pl-4! text-left! text-[.8125rem]! text-gray-new-30 dark:text-gray-new-80">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <ProviderLogo provider={row.provider} />
                        {row.providerName}
                      </span>
                    </td>
                    <td className="py-4! pl-4! text-left! text-[.8125rem]! text-gray-new-40 dark:text-gray-new-60">
                      {row.inputsLabel}
                    </td>
                    <td className="py-4! pl-4! text-left! font-mono text-[.8125rem]! text-gray-new-30 dark:text-gray-new-80">
                      {row.contextLabel}
                    </td>
                    <td className="py-4! pl-4! text-left! text-[.8125rem]! text-gray-new-40 dark:text-gray-new-60">
                      {row.releaseLabel}
                    </td>
                    <td className="py-4! pl-4! text-left! font-mono text-[.8125rem]! text-gray-new-30 dark:text-gray-new-80">
                      {row.costInputLabel}
                    </td>
                    <td className="py-4! pl-4! text-left! font-mono text-[.8125rem]! text-gray-new-30 dark:text-gray-new-80">
                      {row.costOutputLabel}
                    </td>
                    <td className="pr-4! text-left! text-[.8125rem]! whitespace-nowrap text-gray-new-40 dark:text-gray-new-60">
                      {row.openWeights ? 'Open weights' : '—'}
                    </td>
                  </tr>
                );
              })}
              {visibleRows.length === 0 && (
                <tr className="border-b-0!">
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
      </StickyTable>

      <p className="mt-3 text-[.8125rem] text-gray-new-40 dark:text-gray-new-60">
        {MODEL_CATALOG_NOTE}
      </p>
      <p className="sr-only" aria-live="polite">
        Showing {visibleRows.length} {visibleRows.length === 1 ? 'model' : 'models'}.
      </p>
    </div>
  );
};

ModelIndexClient.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  variant: PropTypes.oneOf(['docs', 'landing']),
};

export default ModelIndexClient;
