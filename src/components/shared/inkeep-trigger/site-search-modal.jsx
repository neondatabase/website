'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useId, useState } from 'react';

import Link from 'components/shared/link';
import SearchIcon from 'icons/search.inline.svg';
import SparksIcon from 'icons/sparks.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';
import { siteSearchHighlightRanges } from 'utils/site-search-highlight';
import {
  parseSiteSearchHits,
  hrefFromSearchHit,
  SEARCH_QUERY_MAX_CHARS,
} from 'utils/site-search-request';

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

const SiteSearchModal = ({ isOpen, onClose, onAskAi = null }) => {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHits([]);
      setStatus('idle');
      setError('');
      setActiveIndex(0);
    }
  }, [isOpen]);

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
      sendGtagEvent('Search Query Submitted', { text: trimmed });
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: trimmed }),
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
  }, [isOpen, query]);

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

  const goToHit = (hit) => {
    onClose();
    router.push(hrefFromSearchHit(hit.url));
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
              placeholder="Search docs, guides, changelog, and blog…"
              value={query}
              data-test="docs-search-input"
              data-autofocus
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
            />
            <kbd className="hidden shrink-0 border border-gray-new-80 px-1.5 py-0.5 font-sans text-xs tracking-extra-tight text-gray-new-40 dark:border-gray-new-20 dark:text-gray-new-60 sm:inline">
              esc
            </kbd>
          </div>
          <div className="max-h-[min(60vh,28rem)] overflow-y-auto">
            {trimmedQuery === '' && (
              <p className="px-4 py-6 text-sm tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                Search official docs, community guides, the changelog, and the blog.
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
                  {`No results for "${trimmedQuery}".`}
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
                      onClick={onClose}
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
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

SiteSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAskAi: PropTypes.func,
};

export default SiteSearchModal;
