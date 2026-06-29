'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import { DOCS_BASE_PATH } from 'constants/docs';
import { METHOD_TEXT_FALLBACK_STYLE, METHOD_TEXT_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

const NEVER_AUTO_EXPAND = new Set(['auth-legacy']);

function collectProps(props, names = []) {
  if (!props) return names;
  for (const [name, schema] of Object.entries(props)) {
    names.push(name);
    if (schema.properties) collectProps(schema.properties, names);
    if (schema.items?.properties) collectProps(schema.items.properties, names);
  }
  return names;
}

// Extract the word in a concatenated field that contains the Fuse match
function extractMatchedWord(match) {
  const { value, indices } = match;
  if (!value || !indices?.length) return null;
  const [start] = indices[0];
  let pos = 0;
  for (const word of value.split(' ')) {
    if (pos + word.length >= start) return word || null;
    pos += word.length + 1;
  }
  return null;
}

const MATCH_LABELS = {
  bodyFieldNames: 'body field',
  paramNames: 'parameter',
  cliInfo: 'CLI',
  mcpTool: 'MCP tool',
};

const TagSection = ({ tag, display, operations, open, onToggle }) => (
  <div className="overflow-hidden border border-gray-new-90 dark:border-gray-new-20">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-new-98 dark:hover:bg-gray-new-10"
    >
      <span
        className={cn('text-xs transition-transform duration-200', open ? 'rotate-90' : 'rotate-0')}
      >
        ▶
      </span>
      <span className="flex-1 text-sm font-semibold text-black-pure dark:text-white">
        {display}
      </span>
      <span className="font-mono text-xs text-gray-new-50 dark:text-gray-new-60">
        {operations.length}
      </span>
      <span className="text-xs text-gray-new-50 dark:text-gray-new-60">
        {open ? 'Hide' : 'Show'}
      </span>
    </button>

    <LazyMotion features={domAnimation}>
      <m.div
        initial={false}
        animate={open ? 'expanded' : 'collapsed'}
        variants={{
          collapsed: { opacity: 0, height: 0 },
          expanded: { opacity: 1, height: 'auto' },
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="border-t border-gray-new-90 dark:border-gray-new-20">
          {operations.map((op) => {
            const method = op.method?.toUpperCase();
            return (
              <a
                key={op.id}
                href={`${DOCS_BASE_PATH}reference/api/${tag}/${op.id}`}
                className="group flex items-center gap-3 px-4 py-2 transition-colors duration-100 hover:bg-gray-new-98 dark:hover:bg-gray-new-10"
              >
                <span
                  className={cn(
                    'w-12 shrink-0 font-mono text-xs font-semibold uppercase',
                    METHOD_TEXT_STYLES[method] ?? METHOD_TEXT_FALLBACK_STYLE
                  )}
                >
                  {method}
                </span>
                <code className="flex-1 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap text-gray-new-30 dark:text-gray-new-70">
                  {op.path}
                </code>
                <span className="shrink-0 text-right text-xs text-gray-new-50 group-hover:text-gray-new-40 dark:text-gray-new-60 dark:group-hover:text-gray-new-50 md:hidden">
                  {op.summary}
                </span>
              </a>
            );
          })}
        </div>
      </m.div>
    </LazyMotion>
  </div>
);

TagSection.propTypes = {
  tag: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
    })
  ).isRequired,
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const EndpointIndexPage = ({ tagGroups, total, breadcrumbs, navigationLinks, currentSlug }) => {
  const { previousLink, nextLink } = navigationLinks;
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Re-hydrate after browser back-forward cache restoration.
  // bfcache freezes the JS heap; React's synthetic event system needs a nudge.
  useEffect(() => {
    const handler = (e) => {
      if (e.persisted) router.refresh();
    };
    window.addEventListener('pageshow', handler);
    return () => window.removeEventListener('pageshow', handler);
  }, [router]);

  const allTags = useMemo(() => tagGroups.map((g) => g.tag), [tagGroups]);
  const expandableTags = useMemo(() => allTags.filter((t) => !NEVER_AUTO_EXPAND.has(t)), [allTags]);
  const [openSet, setOpenSet] = useState(() => new Set(expandableTags));

  const allExpanded = expandableTags.every((t) => openSet.has(t));

  const toggleSection = (tag) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setOpenSet(allExpanded ? new Set() : new Set(expandableTags));
  };

  const searchItems = useMemo(
    () =>
      tagGroups.flatMap(({ tag, display, operations }) =>
        operations.map((op) => ({
          id: op.id,
          tag,
          tagDisplay: display,
          method: op.method,
          path: op.path,
          summary: op.summary,
          paramNames: (op.parameters ?? []).map((p) => p.name).join(' '),
          bodyFieldNames: collectProps(op.requestBody?.properties).join(' '),
          cliInfo: [
            op.cli?.command ?? op.cli?.commands?.[0]?.command ?? '',
            ...(op.cli?.flags ?? op.cli?.commands?.[0]?.flags ?? []).map((f) => f.name),
          ]
            .filter(Boolean)
            .join(' '),
          mcpTool: op.mcp?.tool ?? '',
        }))
      ),
    [tagGroups]
  );

  // Fuse index is built at mount time (~145 ops, acceptable cost). If op count
  // grows past ~500, pre-build the index at generate time or move to a Web Worker.
  const fuse = useMemo(
    () =>
      new Fuse(searchItems, {
        keys: [
          { name: 'summary', weight: 3 },
          { name: 'path', weight: 2.5 },
          { name: 'cliInfo', weight: 2 },
          { name: 'mcpTool', weight: 2 },
          { name: 'paramNames', weight: 1.5 },
          { name: 'bodyFieldNames', weight: 1.5 },
          { name: 'method', weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [searchItems]
  );

  const trimmed = query.trim();
  const results = trimmed.length >= 2 ? fuse.search(trimmed) : null;

  return (
    <div className="max-w-208 min-w-0 flex-1 pb-32 lg:max-w-none lg:pb-24 md:pb-20">
      {breadcrumbs?.length > 0 && (
        <Breadcrumbs className="mb-7!" breadcrumbs={breadcrumbs} baseUrl={DOCS_BASE_PATH} />
      )}

      <h1 className="text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]">
        Endpoint index
      </h1>

      <div className="relative mt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search endpoints, fields, parameters..."
          className="w-full rounded-sm border border-gray-new-90 bg-white px-4 py-2.5 font-mono text-sm text-gray-new-20 placeholder-gray-new-50 transition-colors duration-200 outline-none focus:border-gray-new-50 dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-gray-new-80 dark:placeholder-gray-new-60 dark:focus:border-gray-new-50"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-lg leading-none text-gray-new-50 transition-colors duration-100 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-50"
          >
            ×
          </button>
        )}
      </div>

      {results !== null ? (
        <div className="mt-4">
          <p className="mb-3 font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
            {results.length === 0
              ? `No results for "${trimmed}"`
              : `${results.length} result${results.length === 1 ? '' : 's'} for "${trimmed}"`}
          </p>
          <div className="flex flex-col gap-1.5">
            {results.map(({ item, matches }) => {
              const method = item.method?.toUpperCase();
              const contextMatch = matches?.find((m) => m.key in MATCH_LABELS);
              const matchedWord = contextMatch ? extractMatchedWord(contextMatch) : null;
              return (
                <a
                  key={item.id}
                  href={`${DOCS_BASE_PATH}reference/api/${item.tag}/${item.id}`}
                  className="group flex flex-col gap-1 border border-gray-new-90 px-4 py-3 transition-colors duration-200 hover:bg-gray-new-98 dark:border-gray-new-20 dark:hover:bg-gray-new-10"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'w-12 shrink-0 font-mono text-xs font-semibold uppercase',
                        METHOD_TEXT_STYLES[method] ?? METHOD_TEXT_FALLBACK_STYLE
                      )}
                    >
                      {method}
                    </span>
                    <code className="flex-1 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap text-gray-new-30 dark:text-gray-new-70">
                      {item.path}
                    </code>
                    <span className="shrink-0 rounded-sm bg-gray-new-95 px-1.5 py-0.5 font-mono text-xs text-gray-new-50 dark:bg-gray-new-15 dark:text-gray-new-60">
                      {item.tagDisplay}
                    </span>
                  </div>
                  <p className="pl-14 text-sm text-gray-new-40 group-hover:text-gray-new-30 dark:text-gray-new-60 dark:group-hover:text-gray-new-50 sm:pl-0">
                    {item.summary}
                  </p>
                  {contextMatch && matchedWord && (
                    <p className="pl-14 text-xs text-gray-new-50 dark:text-gray-new-60 sm:pl-0">
                      Matched: {MATCH_LABELS[contextMatch.key]}{' '}
                      <code className="font-mono">{matchedWord}</code>
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
              All {total} Neon API endpoints
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs text-gray-new-50 transition-colors duration-200 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-50"
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {tagGroups.map(({ tag, display, operations }) => (
              <TagSection
                key={tag}
                tag={tag}
                display={display}
                operations={operations}
                open={openSet.has(tag)}
                onToggle={() => toggleSection(tag)}
              />
            ))}
          </div>
        </>
      )}

      <DocFooter slug={currentSlug} gitHubPath={null} />

      <NavigationLinks
        className="mt-6"
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={DOCS_BASE_PATH}
      />
    </div>
  );
};

EndpointIndexPage.propTypes = {
  tagGroups: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
      display: PropTypes.string.isRequired,
      operations: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  navigationLinks: PropTypes.shape({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default EndpointIndexPage;
