'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useId, useMemo, useRef, useState } from 'react';

import Link from 'components/shared/link/link';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';
import { registryTemplateDocsHref } from 'utils/function-registry';

import patternSvg from '../detail-icon-cards/images/pattern.svg';

import FunctionRegistryTemplateLogo from './function-registry-template-logo';
import FunctionRegistryWebsiteLink from './function-registry-website-link';

const GRID_CAP = 6;
const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38A57D]';

const matchesQuery = (template, query) => {
  if (!query) return true;
  const haystack = [template.id, template.title, template.description, template.provider]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
};

const FunctionRegistryCardsClient = ({ templates, searchable = false }) => {
  const searchId = useId();
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const query = searchable ? search.trim().toLowerCase() : '';

  const filtered = useMemo(
    () => templates.filter((template) => matchesQuery(template, query)),
    [templates, query]
  );
  const isSearching = Boolean(query);
  const visible = isSearching ? filtered : filtered.slice(0, GRID_CAP);
  const hiddenCount = isSearching ? 0 : Math.max(0, filtered.length - visible.length);
  const statusText =
    filtered.length === 0
      ? 'No templates match that search.'
      : hiddenCount > 0
        ? `Showing ${visible.length} of ${filtered.length}. Search to find more.`
        : '';

  if (templates.length === 0) {
    return (
      <p className="text-gray-new-50 dark:text-gray-new-60">
        The catalog is temporarily unavailable. See the{' '}
        <a href="/docs/compute/functions/registry">Function Registry</a> or fetch{' '}
        <a href="https://neon.com/functions/registry/registry.json">registry.json</a>.
      </p>
    );
  }

  return (
    <div className="not-prose my-10">
      {searchable && (
        <div className="relative mb-5 max-w-md">
          <label className="sr-only" htmlFor={searchId}>
            Search Function Registry templates
          </label>
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-gray-new-30 dark:text-gray-new-70"
            aria-hidden
            focusable="false"
          />
          <input
            ref={searchInputRef}
            id={searchId}
            className={cn(
              'h-9 w-full border border-gray-new-80 bg-gray-new-98 pr-10 pl-9 text-[.8125rem] text-black-pure transition-colors placeholder:text-gray-new-40 hover:border-gray-new-70 dark:border-gray-new-20 dark:bg-black-new dark:text-white dark:placeholder:text-gray-new-60 dark:hover:border-gray-new-30 md:text-base search-cancel:appearance-none',
              FOCUS_RING
            )}
            type="search"
            value={search}
            placeholder="Search by name, id, or provider"
            autoComplete="off"
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className={cn(
                'absolute top-1/2 right-3 flex size-5 -translate-y-1/2 items-center justify-center text-gray-new-60 transition-colors hover:text-gray-new-40 dark:text-gray-new-70 dark:hover:text-gray-new-80',
                FOCUS_RING
              )}
              aria-label="Clear search"
              onClick={() => {
                setSearch('');
                searchInputRef.current?.focus();
              }}
            >
              <span aria-hidden>×</span>
            </button>
          )}
        </div>
      )}
      {filtered.length === 0 ? null : (
        <ul className="detail-icon-cards m-0! grid grid-cols-3 gap-5 p-0! md:grid-cols-2 sm:grid-cols-1">
          {visible.map((template, index) => (
            <li className="m-0! flex min-h-[169px] pl-0! before:hidden" key={template.id}>
              <div
                className={cn(
                  'relative flex w-full flex-col border border-gray-new-80 bg-[#E4F1EB]/40 text-black-pure transition-colors duration-200 hover:border-gray-new-70 hover:bg-[#E4F1EB] dark:border-gray-new-30 dark:bg-gray-new-8 dark:text-white dark:hover:border-gray-new-40 dark:hover:bg-gray-new-10'
                )}
              >
                <Link
                  className={cn('relative flex w-full flex-col p-4 md:p-5', FOCUS_RING)}
                  to={registryTemplateDocsHref(template.id)}
                  tagName="DocsNavCard"
                  tagText={template.title}
                >
                  <Image
                    src={patternSvg}
                    alt=""
                    aria-hidden
                    width={342}
                    height={172}
                    className="absolute top-0 right-0 z-0"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <FunctionRegistryTemplateLogo template={template} eager={index < 3} />
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-lg leading-snug font-medium tracking-extra-tight dark:text-white">
                        {template.title}
                      </h3>
                      <p
                        className="line-clamp-2 text-[0.9375rem] leading-snug tracking-extra-tight text-gray-new-50 dark:text-gray-new-60 md:text-base/snug"
                        title={template.description}
                      >
                        {template.description}
                      </p>
                    </div>
                  </div>
                </Link>
                <FunctionRegistryWebsiteLink
                  className="relative z-10 px-4 pb-4 text-[13px] md:px-5"
                  template={template}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p
        className={cn(
          'text-gray-new-50 dark:text-gray-new-60',
          statusText && filtered.length === 0 && 'mt-0',
          statusText && filtered.length > 0 && 'mt-4 text-[0.9375rem]',
          !statusText && 'sr-only'
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusText}
      </p>
    </div>
  );
};

FunctionRegistryCardsClient.propTypes = {
  searchable: PropTypes.bool,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      provider: PropTypes.string,
      path: PropTypes.string,
      logo: PropTypes.string,
      website: PropTypes.string,
    })
  ).isRequired,
};

export default FunctionRegistryCardsClient;
