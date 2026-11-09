'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import PropTypes from 'prop-types';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { LuListFilter } from 'react-icons/lu';

import FunctionRegistryTemplateCard from 'components/pages/functions/templates/registry/template-card';
import Button from 'components/shared/button';
import Field from 'components/shared/field';
import SearchClearButton from 'components/shared/search-clear-button';
import LINKS from 'constants/links';
import CloseIcon from 'icons/close-small.inline.svg';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';
import {
  REGISTRY_ALL_FILTER,
  REGISTRY_SOURCE_CATEGORIES,
  filterRegistryTemplates,
  registryCategoryIds,
  registryCategoryLabel,
  registryTemplatePageHref,
} from 'utils/function-registry';

const EMPTY_SELECTION = [];
const catalogParams = {
  q: parseAsString.withDefault(''),
  category: parseAsArrayOf(parseAsString).withDefault(EMPTY_SELECTION),
};

const INITIAL_VISIBLE_TEMPLATES = 18;
const COLLAPSED_CATEGORY_COUNT = 6;

const LIBRARY_CLASS_NAME =
  'bg-black-pure pt-20 pb-[4.5rem] font-normal text-pretty text-white md:pt-12 md:pb-14';
const CONTAINER_CLASS_NAME =
  'mx-auto w-[calc(100%-6rem)] max-w-[84rem] max-[1001px]:w-[calc(100%-4rem)] md:w-[calc(100%-2.5rem)]';

const INLINE_LINK_CLASS_NAME =
  'text-white underline underline-offset-2 transition-colors hover:text-green-45';

const FilterGroup = ({
  title,
  categories,
  selected,
  onToggle,
  collapsedCount = categories.length,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const optionsId = useId();
  const firstExtraInputRef = useRef(null);
  const extraCategories = categories.slice(collapsedCount);
  const hasExtraSelection = extraCategories.some((id) => selected.includes(id));
  const visibleCategories =
    isExpanded || hasExtraSelection ? categories : categories.slice(0, collapsedCount);

  useEffect(() => {
    if (isExpanded) firstExtraInputRef.current?.focus();
  }, [isExpanded]);

  return (
    categories.length > 0 && (
      <fieldset className="min-w-0">
        <legend className="mb-2 font-mono text-xs leading-snug tracking-tight text-gray-new-60 uppercase">
          {title}
        </legend>
        <div id={optionsId} className="lg:flex lg:flex-wrap lg:gap-x-5 md:block">
          {visibleCategories.map((id, index) => (
            <Field
              key={id}
              ref={index === collapsedCount ? firstExtraInputRef : null}
              className="max-w-full min-w-0"
              labelClassName="flex min-h-9 w-full items-center py-1 text-sm leading-snug transition-colors [overflow-wrap:anywhere] hover:text-white"
              inputClassName="pointer-events-auto cursor-pointer rounded-none before:translate-y-px before:bg-[url('/images/templates/check-dark-mode.svg')] checked:border-green-45! checked:bg-green-45 checked:hover:border-green-45! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45 forced-colors:appearance-auto"
              name="category"
              value={`${optionsId}-${id}`}
              label={registryCategoryLabel(id)}
              type="checkbox"
              theme="checkbox"
              checked={selected.includes(id)}
              onChange={() => onToggle(id)}
            />
          ))}
        </div>
        {visibleCategories.length < categories.length && (
          <button
            className="mt-1 min-h-9 py-1 text-left text-sm leading-snug text-gray-new-60 transition-colors hover:text-white"
            type="button"
            aria-controls={optionsId}
            aria-expanded={false}
            aria-label="Show more categories"
            onClick={() => setIsExpanded(true)}
          >
            Show more
          </button>
        )}
      </fieldset>
    )
  );
};

FilterGroup.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  collapsedCount: PropTypes.number,
};

const FilterPanel = ({ selectedCount, onClear, children, isMobile = false }) => {
  const panelRef = useRef(null);

  const clearSelection = () => {
    onClear();
    panelRef.current?.querySelector('input[type="checkbox"]')?.focus();
  };

  const selectionBar = selectedCount > 0 && (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-2 border-gray-new-20 text-[0.6875rem] leading-snug font-medium tracking-tight uppercase',
        isMobile ? 'shrink-0 border-t px-5 py-2' : 'border-b pb-2'
      )}
    >
      <p>
        {selectedCount} {selectedCount === 1 ? 'filter' : 'filters'} selected
      </p>
      <button
        className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-gray-new-60 uppercase transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45"
        type="button"
        onClick={clearSelection}
      >
        Clear all <CloseIcon className="size-3 shrink-0" aria-hidden />
      </button>
    </div>
  );

  return (
    <div
      ref={panelRef}
      className={cn('flex min-w-0 flex-col', isMobile ? 'min-h-0 flex-1' : 'gap-5')}
    >
      {!isMobile && selectionBar}
      <div
        className={cn(
          'flex flex-col gap-6',
          isMobile && 'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8'
        )}
      >
        {children}
      </div>
      {isMobile && selectionBar}
    </div>
  );
};

FilterPanel.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onClear: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isMobile: PropTypes.bool,
};

const MobileFilters = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const closeFilters = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="hidden w-9 shrink-0 items-center justify-center border border-gray-new-20 bg-black-new text-gray-new-60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45 md:flex"
        type="button"
        aria-label="Open filters"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <LuListFilter className="size-4" aria-hidden />
      </button>
      <Dialog open={isOpen} onClose={closeFilters} unmount={false} className="relative z-[100]">
        <DialogPanel className="fixed inset-0 flex h-dvh flex-col bg-black-pure text-white">
          <header className="flex shrink-0 items-center justify-between gap-4 px-5 py-4">
            <DialogTitle className="text-xl font-medium tracking-tight">Choose filters</DialogTitle>
            <button
              className="flex size-10 shrink-0 items-center justify-center text-gray-new-60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45"
              type="button"
              aria-label="Close filters"
              data-autofocus
              onClick={closeFilters}
            >
              <CloseIcon className="size-4" aria-hidden />
            </button>
          </header>
          {children}
        </DialogPanel>
      </Dialog>
    </>
  );
};

MobileFilters.propTypes = {
  children: PropTypes.node.isRequired,
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

const getStatusText = (total) => {
  if (total === 0) return 'No templates match those filters.';
  return `${total} matching template${total === 1 ? '' : 's'}.`;
};

const CatalogResults = ({ templates, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const listId = useId();
  const listRef = useRef(null);
  const total = templates.length;
  const shown = isExpanded ? total : Math.min(total, INITIAL_VISIBLE_TEMPLATES);

  useEffect(() => {
    if (isExpanded) {
      listRef.current?.children[INITIAL_VISIBLE_TEMPLATES]?.querySelector('a[href]')?.focus();
    }
  }, [isExpanded]);

  if (total === 0) return <EmptyState onClear={onClear} />;

  return (
    <>
      <ul
        id={listId}
        ref={listRef}
        className="grid grid-cols-3 gap-5 max-[1251px]:grid-cols-2 max-[1251px]:gap-6 lg:grid-cols-3 lg:gap-4 md:grid-cols-1"
      >
        {templates.map((template, index) => (
          <FunctionRegistryTemplateCard
            key={template.id}
            variant="catalog"
            template={template}
            href={registryTemplatePageHref(template.id)}
            eager={index < 3}
            className={index >= shown ? 'hidden' : null}
          />
        ))}
      </ul>
      {shown < total && (
        <Button
          className="mx-auto mt-10 flex w-fit md:mt-6"
          type="button"
          theme="outlined"
          size="sm-new"
          aria-controls={listId}
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </Button>
      )}
    </>
  );
};

CatalogResults.propTypes = {
  templates: PropTypes.arrayOf(FunctionRegistryTemplateCard.propTypes.template).isRequired,
  onClear: PropTypes.func.isRequired,
};

export const CatalogView = ({
  templates,
  q = '',
  category = EMPTY_SELECTION,
  setParams = null,
}) => {
  const searchId = useId();
  const searchInputRef = useRef(null);

  const { sourceIds, topicIds } = useMemo(() => {
    const ids = registryCategoryIds(templates);
    return {
      sourceIds: REGISTRY_SOURCE_CATEGORIES.filter((id) => ids.includes(id)),
      topicIds: ids.filter(
        (id) => id !== REGISTRY_ALL_FILTER && !REGISTRY_SOURCE_CATEGORIES.includes(id)
      ),
    };
  }, [templates]);
  const matchingTemplates = useMemo(
    () => filterRegistryTemplates(templates, { query: q, categories: category }),
    [templates, q, category]
  );

  const toggleCategory = (id) => {
    setParams?.(({ category: selected }) => ({
      category: selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    }));
  };

  const clearFilters = () => {
    setParams?.({ q: null, category: null });
    searchInputRef.current?.focus();
  };

  const clearCategories = () => setParams?.({ category: null });

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

  const hasFilters = sourceIds.length > 0 || topicIds.length > 0;
  const selectedCount = [...sourceIds, ...topicIds].filter((id) => category.includes(id)).length;
  const filters = (
    <>
      <FilterGroup
        title="Source"
        categories={sourceIds}
        selected={category}
        onToggle={toggleCategory}
      />
      <FilterGroup
        title="Categories"
        categories={topicIds}
        selected={category}
        onToggle={toggleCategory}
        collapsedCount={COLLAPSED_CATEGORY_COUNT}
      />
    </>
  );

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
          <aside
            className={cn(
              'col-start-1 row-start-2 flex min-w-0 flex-col lg:mb-10 md:mb-6',
              selectedCount > 0 ? 'gap-4' : 'gap-7 lg:gap-6'
            )}
          >
            <div className="flex gap-3">
              <div
                className="relative flex min-w-0 flex-1 items-center gap-2 border border-gray-new-20 bg-black-new px-3 py-1.5 pr-2.5 lg:max-w-[280px] md:max-w-none"
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
                  onChange={(event) => setParams?.({ q: event.target.value })}
                />
                {q && (
                  <SearchClearButton
                    onClick={() => {
                      setParams?.({ q: null });
                      searchInputRef.current?.focus();
                    }}
                  />
                )}
              </div>
              {hasFilters && (
                <MobileFilters>
                  <FilterPanel isMobile selectedCount={selectedCount} onClear={clearCategories}>
                    {filters}
                  </FilterPanel>
                </MobileFilters>
              )}
            </div>
            {hasFilters && (
              <div className="sticky top-24 min-w-0 lg:static md:hidden">
                <FilterPanel selectedCount={selectedCount} onClear={clearCategories}>
                  {filters}
                </FilterPanel>
              </div>
            )}
          </aside>
          <div className="col-start-2 row-start-2 min-w-0 lg:col-start-1 lg:row-start-3">
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {getStatusText(matchingTemplates.length)}
            </p>
            <CatalogResults
              key={JSON.stringify([q, category])}
              templates={matchingTemplates}
              onClear={clearFilters}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

CatalogView.propTypes = {
  templates: PropTypes.arrayOf(FunctionRegistryTemplateCard.propTypes.template).isRequired,
  q: PropTypes.string,
  category: PropTypes.arrayOf(PropTypes.string),
  setParams: PropTypes.func,
};

const CatalogClient = ({ templates }) => {
  const [{ q, category }, setParams] = useQueryStates(catalogParams);

  return <CatalogView templates={templates} q={q} category={category} setParams={setParams} />;
};

CatalogClient.propTypes = {
  templates: PropTypes.arrayOf(FunctionRegistryTemplateCard.propTypes.template).isRequired,
};

export default CatalogClient;
