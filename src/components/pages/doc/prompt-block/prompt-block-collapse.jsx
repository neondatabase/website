'use client';

import PropTypes from 'prop-types';
import { useId, useState } from 'react';

import { cn } from 'utils/cn';

// Same chevron as the AgentPrompt card in components/shared/copy-prompt.
const ChevronIcon = (props) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 4.5 6 7.5 9 4.5" />
  </svg>
);

// Shows the first prompt group and the label of the second, under a short fade, with
// a button to show the rest. The collapsed state is CSS on data-collapsed, so
// the server renders it and the page doesn't shift on load.
const PromptBlockCollapse = ({ collapsible, children }) => {
  const contentId = useId();
  const [expanded, setExpanded] = useState(false);
  const isClamped = collapsible && !expanded;

  return (
    <>
      <div
        id={contentId}
        data-collapsed={isClamped || undefined}
        className={cn(
          'relative',
          '[&[data-collapsed]_[data-prompt-group]:nth-child(n+3)]:hidden',
          '[&[data-collapsed]_[data-prompt-group]:nth-child(2)_[data-prompt-box]]:hidden'
        )}
      >
        {children}
        {isClamped && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-gray-new-95 dark:to-gray-new-10"
          />
        )}
      </div>

      {collapsible && (
        <div className="flex justify-center pt-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={contentId}
            className={cn(
              'inline-flex min-h-7 items-center gap-1.5 rounded-full border bg-transparent px-3 text-sm leading-none font-medium transition-colors',
              'border-gray-new-80 text-gray-new-50 hover:border-green-44 hover:text-green-44',
              'dark:border-gray-new-20 dark:text-gray-new-60 dark:hover:border-green-52 dark:hover:text-green-52',
              'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-new-95 focus-visible:outline-none dark:focus-visible:ring-green-52 dark:focus-visible:ring-offset-gray-new-10'
            )}
          >
            {expanded ? 'Show less' : 'Show full prompt'}
            <ChevronIcon
              className={cn(
                'transition-transform duration-[160ms] ease-out',
                expanded && 'rotate-180'
              )}
            />
          </button>
        </div>
      )}
    </>
  );
};

PromptBlockCollapse.propTypes = {
  collapsible: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default PromptBlockCollapse;
