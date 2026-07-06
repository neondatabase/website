'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import { AnnotatedField } from 'components/pages/doc/annotated-field';
import DepthControl from 'components/pages/doc/depth-control';
import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import { INLINE_CODE_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

import { SectionHeader, JsonHighlightValue } from './operation-shared';

// Response section — handles Schema vs Example tabs for the read-only API page.

export function useRespState() {
  const [view, setView] = useState('schema');
  const [groups, setGroups] = useState({});
  const [depth, setDepth] = useState(0);

  const isOpen = useCallback(
    (path) => {
      if (groups[path] !== undefined) return groups[path];
      const parts = path.split('.');
      const d = parts.length - 1;
      return d < depth;
    },
    [groups, depth]
  );

  const toggleOpen = useCallback(
    (path) => {
      setGroups((p) => ({ ...p, [path]: !isOpen(path) }));
    },
    [isOpen]
  );

  const setDepthAndClear = useCallback((d) => {
    setDepth(d);
    setGroups({});
  }, []);

  return {
    view,
    depth,
    setView,
    isOpen,
    toggleOpen,
    setDepth: setDepthAndClear,
  };
}

// ── Section component ───────────────────────────────────────────────────────

export const ResponseSection = ({ operation, respTree, state, copy, copiedId }) => (
  <div className="mt-9">
    <SectionHeader
      id="response"
      title="Response"
      badge={operation.response?.status ? String(operation.response.status) : undefined}
    />

    {operation.response?.descriptionHtml && (
      <div
        className={cn(
          'mb-4 text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70 [&_p+p]:mt-3',
          INLINE_CODE_STYLES
        )}
        dangerouslySetInnerHTML={{ __html: operation.response.descriptionHtml }}
      />
    )}
    {respTree.length === 0 && operation.response?.example == null ? (
      <p className="text-sm text-gray-new-50 dark:text-gray-new-60">No example available.</p>
    ) : (
      <div className="max-w-full overflow-hidden border border-gray-new-80 bg-white dark:border-gray-new-20 dark:bg-black-pure">
        <div className="relative flex min-h-11 w-full items-stretch justify-between bg-gray-new-98 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-gray-new-80 dark:bg-gray-new-8 dark:after:bg-gray-new-20">
          <div className="relative z-10 no-scrollbars flex flex-nowrap gap-5 overflow-auto pl-5">
            {['schema', ...(operation.response?.example != null ? ['example'] : [])].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => state.setView(v)}
                className={cn(
                  'relative z-10 cursor-pointer border-b pt-2.5 pb-3.5 text-sm leading-none font-medium tracking-extra-tight whitespace-nowrap capitalize transition-colors duration-200 hover:text-black-pure dark:hover:text-white',
                  state.view === v
                    ? 'border-black-pure text-black-pure after:opacity-100 dark:border-white dark:text-white'
                    : 'border-transparent text-gray-new-40 dark:text-gray-new-60'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="relative z-10 flex items-center gap-2.5 px-3.5">
            {state.view === 'schema' && (
              <DepthControl value={state.depth} onChange={state.setDepth} />
            )}
            {operation.response?.example != null && (
              <>
                <span className="h-4 w-px bg-gray-new-90 dark:bg-gray-new-20" />
                <button
                  type="button"
                  onClick={() => copy('resp', JSON.stringify(operation.response.example, null, 2))}
                  className={cn(
                    'border border-gray-new-80 bg-white p-1.5 text-gray-new-40 transition-[background-color,color] duration-200 hover:bg-gray-new-90 hover:text-gray-new-30 dark:border-gray-new-20 dark:bg-black-pure dark:text-gray-new-60 dark:hover:bg-gray-new-8 dark:hover:text-gray-new-80',
                    copiedId === 'resp'
                      ? 'border-green-45/40 text-[#00B87B] dark:border-green-45/40 dark:text-green-45'
                      : ''
                  )}
                  aria-label={copiedId === 'resp' ? 'Copied JSON' : 'Copy JSON'}
                >
                  {copiedId === 'resp' ? (
                    <CheckIcon className="h-3.5 w-3.5 text-current" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5 text-current" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {state.view === 'schema' && (
          <div className="py-3">
            {respTree.length > 0 ? (
              respTree.map((node) => (
                <AnnotatedField
                  key={node.key}
                  node={node}
                  indent={0}
                  parentPath=""
                  isOpen={state.isOpen}
                  onToggle={state.toggleOpen}
                />
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-new-50 dark:text-gray-new-60">
                No schema available.
              </p>
            )}
          </div>
        )}

        {state.view === 'example' && operation.response?.example != null && (
          <pre className="max-h-[600px] overflow-auto bg-white p-4 font-mono text-sm leading-relaxed dark:bg-black-pure">
            <JsonHighlightValue value={operation.response.example} indent={0} />
          </pre>
        )}
      </div>
    )}
  </div>
);

ResponseSection.propTypes = {
  operation: PropTypes.object.isRequired,
  respTree: PropTypes.array.isRequired,
  state: PropTypes.shape({
    view: PropTypes.string.isRequired,
    depth: PropTypes.number.isRequired,
    setView: PropTypes.func.isRequired,
    isOpen: PropTypes.func.isRequired,
    toggleOpen: PropTypes.func.isRequired,
    setDepth: PropTypes.func.isRequired,
  }).isRequired,
  copy: PropTypes.func.isRequired,
  copiedId: PropTypes.string,
};
