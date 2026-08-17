'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import { METHOD_TEXT_FALLBACK_STYLE, METHOD_TEXT_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

const ApiEndpointsTable = ({ operations, tagDisplay }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-7 overflow-hidden border border-gray-new-90 dark:border-gray-new-20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-new-98 dark:hover:bg-gray-new-10"
      >
        <span
          className={cn(
            'text-xs transition-transform duration-200',
            open ? 'rotate-90' : 'rotate-0'
          )}
        >
          ▶
        </span>
        <span className="flex-1 text-sm font-semibold text-black-pure dark:text-white">
          All {tagDisplay} endpoints
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
                  href={`${DOCS_BASE_PATH}reference/api/${op.tag}/${op.id}`}
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
};

ApiEndpointsTable.propTypes = {
  tagDisplay: PropTypes.string.isRequired,
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ApiEndpointsTable;
