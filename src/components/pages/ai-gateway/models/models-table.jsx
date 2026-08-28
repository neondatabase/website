'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { SiMeta } from 'react-icons/si';

import AlibabaIcon from 'components/pages/doc/ai-gateway-model-index/images/alibaba.inline.svg';
import AnthropicIcon from 'components/pages/doc/ai-gateway-model-index/images/anthropic.inline.svg';
import GoogleIcon from 'components/pages/doc/ai-gateway-model-index/images/google.inline.svg';
import OpenAIIcon from 'components/pages/doc/ai-gateway-model-index/images/openai.inline.svg';
import {
  PROVIDER_ORDER,
  providerLabel,
} from 'components/pages/doc/ai-gateway-model-index/model-rows';
import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import ChevronDownIcon from 'icons/chevron-down.inline.svg';
import CloseIcon from 'icons/close-small.inline.svg';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';

const MODEL_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'text', label: 'Text' },
  { key: 'image', label: 'Image' },
  { key: 'video', label: 'Video' },
  { key: 'audio', label: 'Audio' },
  { key: 'pdf', label: 'PDF' },
];

const COLUMNS = [
  { key: 'name', label: 'Model', sortable: true, className: 'w-[22%]' },
  { key: 'id', label: 'Model ID', sortable: true, className: 'w-[14%]' },
  { key: 'provider', label: 'Provider', sortable: true, className: 'w-[10%]' },
  { key: 'inputs', label: 'Inputs', sortable: false, className: 'w-[18%]' },
  { key: 'contextWindow', label: 'Context', sortable: true, className: 'w-[5%]' },
  { key: 'releaseDate', label: 'Released', sortable: true, className: 'w-[9%]' },
  { key: 'costInput', label: 'Input', sortable: true, className: 'w-[6%]' },
  { key: 'costOutput', label: 'Output', sortable: true, className: 'w-[6%]' },
  { key: 'openWeights', label: 'License', sortable: true, className: 'w-[10%]' },
];

const PROVIDER_ICONS = {
  alibaba: AlibabaIcon,
  anthropic: AnthropicIcon,
  google: GoogleIcon,
  meta: SiMeta,
  openai: OpenAIIcon,
};

const compareRows = (a, b, key, direction) => {
  const directionMultiplier = direction === 'desc' ? -1 : 1;

  switch (key) {
    case 'contextWindow':
    case 'costInput':
    case 'costOutput': {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return (aValue - bValue) * directionMultiplier;
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

const ProviderLogo = ({ provider }) => {
  const Icon = PROVIDER_ICONS[provider];

  if (!Icon) return null;

  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center overflow-hidden',
        provider === 'meta' && 'text-[#0081fb]'
      )}
      aria-hidden="true"
    >
      <Icon className="size-5" />
    </span>
  );
};

ProviderLogo.propTypes = {
  provider: PropTypes.string.isRequired,
};

const CopyableModelId = ({ id }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(2000);

  return (
    <button
      type="button"
      className="group/model-id inline-flex max-w-full min-w-0 items-center gap-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-green-45"
      aria-label={isCopied ? `${id} copied` : `Copy ${id}`}
      onClick={() => handleCopy(id)}
    >
      <code
        className="min-w-0 overflow-hidden rounded-[0.1875rem] border border-white/10 bg-[#111315] px-1.5 py-0.75 font-mono text-[0.75rem] leading-none text-ellipsis whitespace-nowrap text-gray-new-80 transition-colors group-hover/model-id:text-white"
        title={id}
      >
        {id}
      </code>
      {isCopied ? (
        <CheckIcon className="size-3 shrink-0 text-green-45" aria-hidden="true" />
      ) : (
        <CopyIcon
          className="size-3 shrink-0 text-gray-new-50 opacity-0 transition-opacity group-hover/model-id:opacity-100 group-focus-visible/model-id:opacity-100"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

CopyableModelId.propTypes = {
  id: PropTypes.string.isRequired,
};

const ProviderFilter = ({ providers, selected, onToggle, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      setIsOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const label = selected.size === 0 ? 'All Providers' : `Providers (${selected.size})`;

  return (
    <div ref={rootRef} className="relative sm:w-full">
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          'flex h-9 w-30 items-center justify-between gap-2 border px-3 text-[0.75rem] leading-none whitespace-nowrap text-gray-new-80 transition-colors hover:border-gray-new-40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45 sm:h-11 sm:w-full',
          isOpen || selected.size > 0 ? 'border-gray-new-40' : 'border-gray-new-20'
        )}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{label}</span>
        <ChevronDownIcon
          className={cn(
            'size-3 shrink-0 text-gray-new-50 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="dialog"
          aria-label="Model providers"
          className="absolute top-[calc(100%+0.375rem)] right-0 z-[60] min-w-52 border border-gray-new-20 bg-black-pure p-1 shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] sm:right-auto sm:left-0 sm:w-full"
        >
          {providers.map((provider) => {
            const isSelected = selected.has(provider);

            return (
              <button
                key={provider}
                type="button"
                aria-pressed={isSelected}
                className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-[0.8125rem] leading-[1.2] text-gray-new-70 transition-colors hover:bg-gray-new-8 hover:text-white focus-visible:bg-gray-new-8 focus-visible:text-white focus-visible:outline-none"
                onClick={() => onToggle(provider)}
              >
                <span
                  className={cn(
                    'flex size-3.5 shrink-0 items-center justify-center border text-[0.625rem] leading-none',
                    isSelected
                      ? 'border-green-45 bg-green-45 text-black-pure'
                      : 'border-gray-new-40 text-transparent'
                  )}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <ProviderLogo provider={provider} />
                <span>{providerLabel(provider)}</span>
              </button>
            );
          })}

          {selected.size > 0 && (
            <button
              type="button"
              className="mt-1 w-full border-t border-gray-new-20 px-2.5 pt-2.5 pb-2 text-left text-[0.75rem] leading-none font-medium text-green-45 transition-colors hover:text-green-52 focus-visible:text-green-52 focus-visible:outline-none"
              onClick={onClear}
            >
              Clear providers
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ProviderFilter.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

const ModelsTable = ({ rows }) => {
  const tableId = useId();
  const searchInputRef = useRef(null);
  const [modelType, setModelType] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProviders, setSelectedProviders] = useState(() => new Set());
  const [openWeightsOnly, setOpenWeightsOnly] = useState(false);
  const [sort, setSort] = useState({ key: 'releaseDate', direction: 'desc' });

  const providers = useMemo(() => {
    const availableProviders = new Set(rows.map((row) => row.provider));

    return [
      ...PROVIDER_ORDER.filter((provider) => availableProviders.has(provider)),
      ...[...availableProviders].filter((provider) => !PROVIDER_ORDER.includes(provider)),
    ];
  }, [rows]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filteredRows = rows.filter((row) => modelType === 'all' || row.inputs.includes(modelType));

    if (selectedProviders.size > 0) {
      filteredRows = filteredRows.filter((row) => selectedProviders.has(row.provider));
    }

    if (openWeightsOnly) {
      filteredRows = filteredRows.filter((row) => row.openWeights);
    }

    if (query) {
      filteredRows = filteredRows.filter((row) =>
        [row.name, row.id, row.providerName, row.inputsLabel].some((value) =>
          value.toLowerCase().includes(query)
        )
      );
    }

    return [...filteredRows].sort((a, b) => compareRows(a, b, sort.key, sort.direction));
  }, [modelType, openWeightsOnly, rows, search, selectedProviders, sort]);

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleProvider = (provider) => {
    setSelectedProviders((current) => {
      const next = new Set(current);

      if (next.has(provider)) next.delete(provider);
      else next.add(provider);

      return next;
    });
  };

  return (
    <div className="mt-17.5 md:mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-full items-end gap-3 sm:w-full sm:flex-wrap">
          <div className="relative w-87 max-w-full min-w-0 flex-1 sm:w-full sm:flex-none">
            <label className="sr-only" htmlFor={`${tableId}-search`}>
              Search models
            </label>
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-gray-new-50"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id={`${tableId}-search`}
              type="search"
              value={search}
              placeholder="Search model..."
              className="h-9 w-full border border-gray-new-20 bg-transparent pr-9 pl-10 text-[0.75rem] leading-none text-white outline-none placeholder:text-gray-new-50 hover:border-gray-new-40 focus:border-gray-new-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45 md:text-[1rem] sm:h-11 search-cancel:appearance-none"
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center text-gray-new-50 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-45"
                aria-label="Clear model search"
                onClick={() => {
                  setSearch('');
                  searchInputRef.current?.focus();
                }}
              >
                <CloseIcon className="size-3" aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            className="no-scrollbars flex w-72.5 max-w-full shrink-0 overflow-x-auto border border-gray-new-20 p-0.75 sm:h-11 sm:w-full"
            role="group"
            aria-label="Filter models by supported input"
          >
            {MODEL_TYPES.map((type) => (
              <button
                key={type.key}
                type="button"
                className={cn(
                  'h-7 shrink-0 px-[0.609375rem] text-[0.75rem] leading-none font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-45 sm:h-full sm:flex-1 sm:px-2.5',
                  modelType === type.key
                    ? 'bg-gray-new-90 text-black-pure'
                    : 'text-gray-new-50 hover:text-white'
                )}
                aria-pressed={modelType === type.key}
                onClick={() => setModelType(type.key)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 sm:w-full sm:flex-col sm:items-stretch">
          <ProviderFilter
            providers={providers}
            selected={selectedProviders}
            onToggle={toggleProvider}
            onClear={() => setSelectedProviders(new Set())}
          />
          <button
            type="button"
            className={cn(
              'flex h-9 w-40 items-center gap-2 border px-3 text-[0.75rem] leading-none text-gray-new-80 transition-colors hover:border-gray-new-40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45 sm:h-11 sm:w-full',
              openWeightsOnly ? 'border-gray-new-40' : 'border-gray-new-20'
            )}
            aria-pressed={openWeightsOnly}
            onClick={() => setOpenWeightsOnly((current) => !current)}
          >
            <span
              className={cn(
                'flex size-3 items-center justify-center border text-[0.625rem] leading-none',
                openWeightsOnly
                  ? 'border-green-45 bg-green-45 text-black-pure'
                  : 'border-gray-new-40 text-transparent'
              )}
              aria-hidden="true"
            >
              ✓
            </span>
            Open weights only
          </button>
        </div>
      </div>

      <div
        className="no-scrollbars overflow-x-auto border border-gray-new-20"
        role="region"
        aria-labelledby="models-heading"
      >
        <div className="min-w-300">
          <table id={tableId} className="w-full table-fixed border-collapse">
            <colgroup>
              {COLUMNS.map((column) => (
                <col key={column.key} className={column.className} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-gray-new-20 bg-gray-new-8">
                {COLUMNS.map((column) => {
                  const isActive = sort.key === column.key;
                  const ariaSort = isActive
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none';

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={column.sortable ? ariaSort : undefined}
                      className="px-4 py-[0.90625rem] text-left text-[0.75rem] leading-none font-medium whitespace-nowrap text-gray-new-50"
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className="group/sort inline-flex items-center gap-1.5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-green-45"
                          aria-label={`Sort by ${column.label}${isActive ? `, currently ${sort.direction}ending` : ''}`}
                          onClick={() => handleSort(column.key)}
                        >
                          {column.label}
                          <span
                            className={cn(
                              'text-[0.625rem] leading-none transition-opacity',
                              isActive
                                ? 'text-gray-new-80 opacity-100'
                                : 'opacity-0 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60'
                            )}
                            aria-hidden="true"
                          >
                            {isActive && sort.direction === 'asc' ? '▲' : '▼'}
                          </span>
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const href = `/docs/ai-gateway/models/${encodeURIComponent(row.id)}`;

                return (
                  <tr
                    key={row.id}
                    className="border-b border-gray-new-20 transition-colors last:border-b-0 hover:bg-gray-new-8"
                  >
                    <td className="px-4 py-[0.96875rem] text-left text-[0.8125rem] leading-[1.2]">
                      <Link
                        href={href}
                        className="font-medium text-gray-new-90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-green-45"
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left">
                      <CopyableModelId id={row.id} />
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left text-[0.75rem] leading-[1.2] text-gray-new-80">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <ProviderLogo provider={row.provider} />
                        {row.providerName}
                      </span>
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left text-[0.75rem] leading-[1.2] text-gray-new-60">
                      {row.inputsLabel}
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left font-mono text-[0.75rem] leading-[1.2] text-gray-new-80">
                      {row.contextLabel}
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left text-[0.75rem] leading-[1.2] text-gray-new-60">
                      {row.releaseLabel}
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left font-mono text-[0.75rem] leading-[1.2] text-gray-new-80">
                      {row.costInputLabel}
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left font-mono text-[0.75rem] leading-[1.2] text-gray-new-80">
                      {row.costOutputLabel}
                    </td>
                    <td className="px-4 py-[0.96875rem] text-left text-[0.75rem] leading-[1.2] whitespace-nowrap text-gray-new-60">
                      {row.openWeights ? 'Open weights' : '—'}
                    </td>
                  </tr>
                );
              })}

              {visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-12 text-center text-[0.8125rem] leading-[1.4] text-gray-new-50"
                  >
                    No models match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visibleRows.length} {visibleRows.length === 1 ? 'model' : 'models'}.
      </p>
    </div>
  );
};

ModelsTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ModelsTable;
