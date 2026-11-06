'use client';

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import PropTypes from 'prop-types';
import { useId, useMemo, useRef } from 'react';

import FunctionRegistryTemplateCard from 'components/pages/functions/templates/registry/template-card';
import Button from 'components/shared/button';
import SearchClearButton from 'components/shared/search-clear-button';
import LINKS from 'constants/links';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';
import {
  REGISTRY_ALL_FILTER,
  REGISTRY_FIRST_PARTY_CATEGORY,
  filterRegistryTemplates,
  paginateRegistryTemplates,
  registryCategoryIds,
  registryTemplateFilters,
  registryTemplatePageHref,
} from 'utils/function-registry';

import Pagination from '../pagination';

const catalogParams = {
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(REGISTRY_ALL_FILTER),
  page: parseAsInteger.withDefault(1),
};

const PINNED_FILTERS = new Set([REGISTRY_ALL_FILTER, REGISTRY_FIRST_PARTY_CATEGORY]);

const INLINE_LINK_CLASS_NAME =
  'text-white underline underline-offset-2 transition-colors hover:text-green-45';

const FilterButton = ({ filter, isActive, onChange }) => (
  <button
    type="button"
    aria-pressed={isActive}
    className={cn(
      'flex items-center justify-between gap-2.5 py-[7px] text-left font-mono text-sm leading-snug tracking-tight uppercase transition-colors hover:text-white lg:shrink-0 lg:border-b-2 lg:py-[3px] lg:whitespace-nowrap',
      isActive ? 'text-white lg:border-green-45' : 'text-gray-new-60 lg:border-transparent',
      filter.count === 0 && !isActive && 'text-gray-new-50'
    )}
    onClick={() => onChange(filter.id)}
  >
    {filter.label}
    <span
      className={cn('tabular-nums', isActive ? 'text-green-45' : 'text-gray-new-50')}
      aria-hidden
    >
      {filter.count}
    </span>
    <span className="sr-only">
      , {filter.count} template{filter.count === 1 ? '' : 's'}
    </span>
  </button>
);

FilterButton.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const CategoryFilter = ({ filters, activeFilter, onChange }) => {
  const pinned = filters.filter((filter) => PINNED_FILTERS.has(filter.id));
  const categories = filters.filter((filter) => !PINNED_FILTERS.has(filter.id));

  const renderButtons = (items) =>
    items.map((filter) => (
      <FilterButton
        key={filter.id}
        filter={filter}
        isActive={filter.id === activeFilter}
        onChange={onChange}
      />
    ));

  return (
    <nav
      className="sticky top-24 flex flex-col gap-2 lg:static lg:no-scrollbars lg:flex-1 lg:flex-row lg:gap-x-5 lg:overflow-x-auto md:-mx-5 md:flex-none md:px-5"
      aria-label="Template categories"
    >
      {renderButtons(pinned)}
      {categories.length > 0 && (
        <p className="mt-6 mb-1 font-mono text-xs leading-none tracking-tight text-gray-new-50 uppercase lg:hidden">
          Categories
        </p>
      )}
      {renderButtons(categories)}
    </nav>
  );
};

CategoryFilter.propTypes = {
  filters: PropTypes.arrayOf(FilterButton.propTypes.filter).isRequired,
  activeFilter: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center py-16">
    <h3 className="text-center text-xl font-medium tracking-tight text-white">
      No templates found
    </h3>
    <p className="mt-2 max-w-xs text-center text-base leading-snug text-pretty text-gray-new-60">
      Try another search or clear the filters to see the full catalog.
    </p>
    <Button className="mt-6" type="button" size="xs" theme="white-filled" onClick={onClear}>
      Clear filters
    </Button>
  </div>
);

EmptyState.propTypes = {
  onClear: PropTypes.func.isRequired,
};

const getStatusText = ({ total, shown, currentPage, pageCount }) => {
  if (total === 0) return 'No templates match those filters.';
  const pageInfo = pageCount > 1 ? `, page ${currentPage} of ${pageCount}` : '';
  return `Showing ${shown} of ${total} template${total === 1 ? '' : 's'}${pageInfo}.`;
};

const CatalogClient = ({ templates }) => {
  const searchId = useId();
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const [{ q, category, page }, setParams] = useQueryStates(catalogParams);

  const categoryIds = useMemo(() => registryCategoryIds(templates), [templates]);
  const filters = useMemo(
    () => registryTemplateFilters(filterRegistryTemplates(templates, { query: q }), categoryIds),
    [templates, q, categoryIds]
  );
  const { items, total, pageCount, currentPage } = useMemo(
    () =>
      paginateRegistryTemplates(
        filterRegistryTemplates(templates, { query: q, filter: category }),
        { page }
      ),
    [templates, q, category, page]
  );

  const setPage = (nextPage) => {
    setParams({ page: nextPage }, { history: 'push' });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearFilters = () => {
    setParams({ q: null, category: null, page: null });
    searchInputRef.current?.focus();
  };

  if (templates.length === 0) {
    return (
      <p className="text-base text-gray-new-60">
        The catalog is temporarily unavailable. See the{' '}
        <a className={INLINE_LINK_CLASS_NAME} href={LINKS.functionsTemplatesDocs}>
          function templates docs
        </a>{' '}
        or fetch{' '}
        <a className={INLINE_LINK_CLASS_NAME} href="/functions/registry/registry.json">
          registry.json
        </a>
        .
      </p>
    );
  }

  return (
    <div className="flex gap-16 lt:gap-12 lg:flex-col lg:gap-10">
      <div className="flex w-64 shrink-0 flex-col gap-8 lg:w-full lg:flex-row-reverse lg:items-center lg:gap-6 md:flex-col md:items-stretch md:gap-5">
        <div
          className="relative flex items-center gap-2 border border-gray-new-20 bg-black-new px-3 py-1.5 pr-2.5 lg:w-[280px] lg:shrink-0 md:w-full"
          role="search"
        >
          <label className="sr-only" htmlFor={searchId}>
            Search Function Registry templates
          </label>
          <SearchIcon className="size-[15px] shrink-0 text-gray-new-60" aria-hidden />
          <input
            ref={searchInputRef}
            id={searchId}
            className="min-w-0 flex-1 bg-transparent pr-7 text-[15px] leading-snug tracking-tighter text-white placeholder:text-gray-new-60 focus:outline-hidden md:text-base search-cancel:appearance-none"
            type="search"
            value={q}
            placeholder="Search templates..."
            autoComplete="off"
            onChange={(event) => setParams({ q: event.target.value, page: null })}
          />
          {q && <SearchClearButton onClick={() => setParams({ q: null, page: null })} />}
        </div>
        <CategoryFilter
          filters={filters}
          activeFilter={category}
          onChange={(id) => setParams({ category: id, page: null })}
        />
      </div>

      <div className="min-w-0 flex-1 scroll-mt-24" ref={resultsRef}>
        <h2 className="sr-only">Templates</h2>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {getStatusText({ total, shown: items.length, currentPage, pageCount })}
        </p>
        {items.length > 0 ? (
          <>
            <ul className="grid grid-cols-3 gap-5 lt:grid-cols-2 sm:grid-cols-1">
              {items.map((template, index) => (
                <FunctionRegistryTemplateCard
                  key={template.id}
                  template={template}
                  href={registryTemplatePageHref(template.id)}
                  eager={currentPage === 1 && index < 3}
                />
              ))}
            </ul>
            <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState onClear={clearFilters} />
        )}
        <p className="mt-8 text-sm leading-snug text-gray-new-60">
          New to templates? See{' '}
          <a className={INLINE_LINK_CLASS_NAME} href={LINKS.functionsTemplatesDocs}>
            how to use them
          </a>
          . If the one you need isn&apos;t here, ask on{' '}
          <a className={INLINE_LINK_CLASS_NAME} href="/discord">
            Discord
          </a>{' '}
          or{' '}
          <a className={INLINE_LINK_CLASS_NAME} href={LINKS.functionsRegistry}>
            contribute one
          </a>
          .
        </p>
      </div>
    </div>
  );
};

CatalogClient.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      provider: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
      logo: PropTypes.string,
      website: PropTypes.string,
    })
  ).isRequired,
};

export default CatalogClient;
