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

const LIBRARY_CLASS_NAME =
  'bg-black-pure pt-20 pb-[4.5rem] font-normal text-pretty text-white md:pt-12 md:pb-14';
const CONTAINER_CLASS_NAME =
  'mx-auto w-[calc(100%-6rem)] max-w-[84rem] max-[1001px]:w-[calc(100%-4rem)] md:w-[calc(100%-2.5rem)]';

const INLINE_LINK_CLASS_NAME =
  'text-white underline underline-offset-2 transition-colors hover:text-green-45';

const FilterButton = ({ filter, isActive, onChange }) => (
  <button
    type="button"
    aria-pressed={isActive}
    className={cn(
      'relative flex items-center justify-between gap-2.5 py-[7px] text-left font-mono text-sm leading-snug tracking-tight uppercase transition-colors hover:text-white lg:shrink-0 lg:border-b-2 lg:py-[3px] lg:whitespace-nowrap',
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
      className="sticky top-24 flex min-w-0 flex-col gap-2 lg:static lg:no-scrollbars lg:flex-1 lg:flex-row lg:gap-x-5 lg:overflow-x-auto md:-mx-5 md:flex-none md:px-5"
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
      <section className={LIBRARY_CLASS_NAME} aria-label="Function templates">
        <div className={CONTAINER_CLASS_NAME}>
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
        </div>
      </section>
    );
  }

  return (
    <section className={LIBRARY_CLASS_NAME} aria-labelledby="registry-library-title">
      <div className={CONTAINER_CLASS_NAME}>
        <div className="grid grid-cols-[13rem_minmax(0,1fr)] gap-x-10 max-[1251px]:grid-cols-[11.5rem_minmax(0,1fr)] max-[1251px]:gap-x-[1.875rem] lg:grid-cols-1">
          <header className="col-span-2 col-start-1 row-start-1 mb-14 min-w-0 lg:col-span-1 md:mb-6">
            <h2
              id="registry-library-title"
              className="m-0 max-w-[60rem] text-5xl leading-dense font-normal tracking-tighter text-pretty text-gray-new-50 2xl:text-[2.75rem] xl:text-[2.25rem] md:text-[1.75rem]"
            >
              <span className="text-white">Start from a template.</span> Functions built by Neon and
              partners, from AI agents and MCP servers to bots, auth, and REST APIs.
            </h2>
          </header>
          <aside className="col-start-1 row-start-2 flex min-w-0 flex-col gap-8 lg:mb-10 lg:flex-row-reverse lg:items-center lg:gap-6 md:mb-6 md:flex-col md:items-stretch md:gap-5">
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
              {q && (
                <SearchClearButton
                  onClick={() => {
                    setParams({ q: null, page: null });
                    searchInputRef.current?.focus();
                  }}
                />
              )}
            </div>
            <CategoryFilter
              filters={filters}
              activeFilter={category}
              onChange={(id) => setParams({ category: id, page: null })}
            />
          </aside>
          <div
            className="col-start-2 row-start-2 min-w-0 scroll-mt-24 lg:col-start-1 lg:row-start-3"
            ref={resultsRef}
          >
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {getStatusText({ total, shown: items.length, currentPage, pageCount })}
            </p>
            {items.length > 0 ? (
              <>
                <ul className="grid grid-cols-3 gap-5 max-[1251px]:grid-cols-2 max-[1251px]:gap-6 lg:grid-cols-3 lg:gap-4 md:grid-cols-1">
                  {items.map((template, index) => (
                    <FunctionRegistryTemplateCard
                      variant="catalog"
                      key={template.id}
                      template={template}
                      href={registryTemplatePageHref(template.id)}
                      eager={currentPage === 1 && index < 3}
                    />
                  ))}
                </ul>
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState onClear={clearFilters} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

CatalogClient.propTypes = {
  templates: PropTypes.arrayOf(FunctionRegistryTemplateCard.propTypes.template).isRequired,
};

export default CatalogClient;
