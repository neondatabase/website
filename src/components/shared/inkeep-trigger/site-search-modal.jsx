'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useId, useRef, useState } from 'react';

import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import SearchIcon from 'icons/search.inline.svg';
import SparksIcon from 'icons/sparks.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';
import { siteSearchHighlightRanges } from 'utils/site-search-highlight';
import {
  parseSiteSearchHits,
  hrefFromSearchHit,
  SEARCH_QUERY_MAX_CHARS,
  SITE_SEARCH_CATEGORIES,
} from 'utils/site-search-request';
import { hitSections } from 'utils/site-search-section';

import { scrollToSection, scrollToSectionAfterNavigation } from './section-scroll';

const SEARCH_DEBOUNCE_MS = 250;

function HighlightedText({ text, query }) {
  const ranges = siteSearchHighlightRanges(text, query);
  if (ranges.length === 0) {
    return text;
  }
  const nodes = [];
  let lastIndex = 0;
  for (const { start, end } of ranges) {
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }
    nodes.push(
      <mark
        key={start}
        className="rounded-[2px] bg-green-45/20 text-black-new dark:bg-green-45/15 dark:text-white"
      >
        {text.slice(start, end)}
      </mark>
    );
    lastIndex = end;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

// The heading path starts with the page H1, which usually repeats the title.
function sectionPath(heading, title) {
  const parts = heading.split(' > ');
  const rest = parts[0] === title ? parts.slice(1) : parts;
  return rest.join(' › ');
}

const Breadcrumb = ({ labels }) => (
  <span className="truncate text-[11px] leading-tight tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
    {labels.join(' › ')}
  </span>
);

Breadcrumb.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

HighlightedText.propTypes = {
  text: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
};

function categoryLabels(categories) {
  return SITE_SEARCH_CATEGORIES.filter((category) => categories.includes(category.id))
    .map((category) => category.label)
    .join(', ');
}

const CategoryFilter = ({ options, selected, onChange }) => {
  const toggle = (id) =>
    onChange(
      options
        .map((category) => category.id)
        .filter((candidate) =>
          candidate === id ? !selected.includes(id) : selected.includes(candidate)
        )
    );
  const chip = (pressed) =>
    cn(
      'shrink-0 rounded-full border px-2.5 py-1 text-[12px] leading-none tracking-extra-tight transition-colors',
      pressed
        ? 'border-green-45/60 bg-green-45/15 text-black-new dark:text-white'
        : 'border-gray-new-80 text-gray-new-30 hover:border-gray-new-60 dark:border-gray-new-20 dark:text-gray-new-70 dark:hover:border-gray-new-40'
    );
  return (
    <div className="border-b border-gray-new-90 px-4 py-2 dark:border-gray-new-15">
      <div className="flex flex-wrap gap-1.5 sm:hidden" role="group" aria-label="Search in">
        <button
          className={chip(selected.length === 0)}
          type="button"
          aria-pressed={selected.length === 0}
          onClick={() => onChange([])}
        >
          All
        </button>
        {options.map((category) => (
          <button
            key={category.id}
            className={chip(selected.includes(category.id))}
            type="button"
            aria-pressed={selected.includes(category.id)}
            data-test={`search-category-${category.id}`}
            onClick={() => toggle(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <CategoryMenu options={options} selected={selected} onChange={onChange} />
    </div>
  );
};

const ALL = 'all';

// Phones get one menu instead of a row of chips that would wrap or scroll.
const CategoryMenu = ({ options: categoryOptions, selected, onChange }) => {
  const value = selected.length === 0 ? [ALL] : selected;
  const change = (next) => {
    const pickedAll = next.includes(ALL) && !value.includes(ALL);
    onChange(pickedAll ? [] : next.filter((id) => id !== ALL));
  };
  const options = [{ id: ALL, label: 'All' }, ...categoryOptions];
  return (
    <Listbox value={value} onChange={change} multiple>
      <ListboxButton
        className="group hidden w-full items-center justify-between gap-2 text-left text-[13px] tracking-extra-tight text-gray-new-30 dark:text-gray-new-70 sm:flex"
        data-test="search-category-menu"
      >
        <span className="truncate">
          Search in:{' '}
          <span className="text-black-new dark:text-white">
            {selected.length === 0 ? 'All' : categoryLabels(selected)}
          </span>
        </span>
        <ChevronIcon className="size-3.5 shrink-0 transition-transform duration-200 group-data-open:rotate-180" />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom start"
        className="z-[110] w-(--button-width) border border-gray-new-80 bg-white p-1 text-[13px] text-gray-new-20 shadow-lg [--anchor-gap:var(--spacing-2)] focus:outline-none dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-90"
      >
        {options.map((option) => (
          <ListboxOption
            key={option.id}
            value={option.id}
            className="group flex min-h-9 cursor-pointer items-center gap-3 px-2.5 py-1.5 select-none data-focus:bg-gray-new-94 dark:data-focus:bg-gray-new-15"
          >
            <span>{option.label}</span>
            <svg
              viewBox="0 0 10 10"
              className="ml-auto size-2.5 shrink-0 text-secondary-8 opacity-0 group-data-selected:opacity-100 dark:text-primary-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M1.5 5 L4 7.5 L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

const categoryOptionsPropType = PropTypes.arrayOf(
  PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
);

CategoryMenu.propTypes = {
  options: categoryOptionsPropType.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

CategoryFilter.propTypes = {
  options: categoryOptionsPropType.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

const SiteSearchModal = ({
  isOpen,
  onClose,
  onAskAi = null,
  defaultCategories = [],
  categoryOptions = SITE_SEARCH_CATEGORIES,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState(defaultCategories);
  const trimmedQuery = query.trim();
  const categoriesKey = categories.join(',');
  const defaultCategoriesKey = defaultCategories.join(',');
  const searchScope = categories.length === 0 ? 'all of neon.com' : categoryLabels(categories);

  useEffect(() => {
    if (isOpen) {
      setCategories(defaultCategoriesKey === '' ? [] : defaultCategoriesKey.split(','));
      setQuery('');
      setHits([]);
      setStatus('idle');
      setError('');
      setActiveIndex(0);
    }
  }, [isOpen, defaultCategoriesKey]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!isOpen || trimmed === '') {
      setHits([]);
      setStatus('idle');
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setActiveIndex(0);
      setStatus('loading');
      setError('');
      sendGtagEvent('Search Query Submitted', { text: trimmed, categories: categoriesKey });
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            query: trimmed,
            ...(categoriesKey === '' ? {} : { categories: categoriesKey.split(',') }),
          }),
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          if (response.status === 502 || response.status === 503) {
            throw new Error('Search is temporarily unavailable.');
          }
          const message =
            payload && typeof payload.error === 'string' && response.status === 400
              ? payload.error
              : 'Search failed.';
          throw new Error(message);
        }
        const nextHits = parseSiteSearchHits(payload);
        setHits(nextHits);
        setActiveIndex(0);
        setStatus('ok');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setHits([]);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Search failed.');
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, query, categoriesKey]);

  const activeHit = hits[activeIndex];
  const showAskAi =
    typeof onAskAi === 'function' &&
    trimmedQuery !== '' &&
    status !== 'idle' &&
    !(status === 'loading' && hits.length === 0);

  useEffect(() => {
    if (!activeHit) return;
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeHit, activeIndex, listId]);

  const samePageHit = useRef(null);

  // Waits for the dialog to close so its scroll lock can't restore the old position.
  useEffect(() => {
    if (isOpen || !samePageHit.current) return undefined;
    const frame = requestAnimationFrame(() => {
      const hit = samePageHit.current;
      samePageHit.current = null;
      if (hit && !scrollToSection(hit.sections)) router.push(hit.href);
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, router]);

  const goToHit = (hit) => {
    const href = hrefFromSearchHit(hit.url);
    const sections = hitSections(hit.heading, hit.title);
    const target = new URL(href, window.location.origin);
    onClose();
    if (sections.length === 0 || target.hash !== '' || target.search !== '') {
      router.push(href);
    } else if (target.pathname === pathname) {
      samePageHit.current = { sections, href };
    } else {
      scrollToSectionAfterNavigation(target.pathname, sections);
      router.push(href);
    }
  };

  const onHitClick = (event, hit) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    goToHit(hit);
  };

  const askAi = () => {
    onAskAi(trimmedQuery);
  };

  const onInputKeyDown = (event) => {
    // Enter and arrow keys confirm or move an IME candidate while composing.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (hits.length === 0) return;
      setActiveIndex((index) => (index + 1) % hits.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (hits.length === 0) return;
      setActiveIndex((index) => (index - 1 + hits.length) % hits.length);
      return;
    }
    if (event.key === 'Enter' && activeHit) {
      event.preventDefault();
      goToHit(activeHit);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop className="fixed inset-0 bg-black-new/30 dark:bg-black/80" />
      <div className="fixed inset-0 overflow-y-auto p-4 pt-[12vh] sm:pt-10">
        <DialogPanel className="mx-auto w-full max-w-[640px] overflow-hidden rounded-lg border border-gray-new-80 bg-gray-new-98 shadow-[4px_4px_10px_0_rgba(0,0,0,0.06)] dark:border-gray-new-20 dark:bg-black-new dark:shadow-[4px_4px_10px_0_rgba(0,0,0,0.5)]">
          <DialogTitle className="sr-only">Search Neon</DialogTitle>
          <div className="flex items-center gap-2.5 border-b border-gray-new-90 px-4 py-3 dark:border-gray-new-15">
            <SearchIcon className="size-4 shrink-0 text-gray-new-40 dark:text-gray-new-60" />
            <input
              id={inputId}
              className="h-8 w-full bg-transparent text-[15px] leading-none tracking-extra-tight text-black-new outline-hidden placeholder:text-gray-new-40 dark:text-white dark:placeholder:text-gray-new-50"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls={listId}
              aria-expanded={hits.length > 0}
              aria-activedescendant={activeHit ? `${listId}-${activeIndex}` : undefined}
              autoComplete="off"
              spellCheck="false"
              maxLength={SEARCH_QUERY_MAX_CHARS}
              placeholder={`Search ${searchScope}…`}
              value={query}
              data-test="docs-search-input"
              data-autofocus
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
            />
            <kbd className="shrink-0 border border-gray-new-80 px-1.5 py-0.5 font-sans text-xs tracking-extra-tight text-gray-new-40 dark:border-gray-new-20 dark:text-gray-new-60 sm:hidden">
              esc
            </kbd>
          </div>
          <CategoryFilter
            options={categoryOptions}
            selected={categories}
            onChange={setCategories}
          />
          <div className="max-h-[min(60vh,28rem)] overflow-y-auto">
            {trimmedQuery === '' && (
              <p className="px-4 py-6 text-sm tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                {`Searching ${searchScope}. Pick categories above to widen or narrow the search.`}
              </p>
            )}
            <div aria-live="polite" aria-atomic="true" role="status">
              {status === 'loading' && hits.length === 0 && (
                <p className="px-4 py-6 text-sm tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                  Searching…
                </p>
              )}
              {status === 'error' && (
                <p className="px-4 py-6 text-sm tracking-extra-tight text-secondary-1">{error}</p>
              )}
              {status === 'ok' && hits.length === 0 && (
                <p className="px-4 py-6 text-sm tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                  {`No results for "${trimmedQuery}" in ${searchScope}.`}
                </p>
              )}
            </div>
            <ul
              id={listId}
              role="listbox"
              className={cn(
                'py-2',
                hits.length === 0 && 'hidden',
                status === 'loading' && hits.length > 0 && 'opacity-60'
              )}
            >
              {hits.map((hit, index) => {
                const href = hrefFromSearchHit(hit.url);
                const section = sectionPath(hit.heading, hit.title);
                return (
                  <li key={`${hit.url}-${hit.heading}`} role="presentation">
                    <Link
                      id={`${listId}-${index}`}
                      to={href}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={cn(
                        'flex flex-col gap-1 px-4 py-2.5 no-underline',
                        index === activeIndex
                          ? 'bg-gray-new-94 dark:bg-white/5'
                          : 'hover:bg-gray-new-94 dark:hover:bg-white/5'
                      )}
                      data-test="docs-search-hit"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={(event) => onHitClick(event, hit)}
                    >
                      {hit.breadcrumb.length > 0 && <Breadcrumb labels={hit.breadcrumb} />}
                      <span className="text-[13px] font-medium tracking-extra-tight text-black-new dark:text-white">
                        <HighlightedText text={hit.title} query={trimmedQuery} />
                      </span>
                      {section && (
                        <span className="text-[12px] tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                          <HighlightedText text={section} query={trimmedQuery} />
                        </span>
                      )}
                      {hit.excerpt && (
                        <span className="line-clamp-2 text-[13px] leading-snug tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                          <HighlightedText text={hit.excerpt} query={trimmedQuery} />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {showAskAi && (
            <button
              className="flex w-full items-center gap-2 border-t border-gray-new-90 px-4 py-3 text-left text-[13px] tracking-extra-tight text-gray-new-30 hover:bg-gray-new-94 dark:border-gray-new-15 dark:text-gray-new-70 dark:hover:bg-white/5"
              type="button"
              onClick={askAi}
            >
              <SparksIcon className="size-3.5 shrink-0" />
              <span>
                {`Ask Neon AI about "${
                  trimmedQuery.length > 80 ? `${trimmedQuery.slice(0, 77)}…` : trimmedQuery
                }"`}
              </span>
            </button>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

SiteSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAskAi: PropTypes.func,
  defaultCategories: PropTypes.arrayOf(PropTypes.string),
  categoryOptions: categoryOptionsPropType,
};

export default SiteSearchModal;
