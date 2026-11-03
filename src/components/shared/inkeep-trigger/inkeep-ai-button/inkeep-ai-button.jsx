import PropTypes from 'prop-types';

import DocsHeaderSparksIcon from 'icons/docs/header/sparks.inline.svg';
import SparksIcon from 'icons/sparks.inline.svg';
import { cn } from 'utils/cn';

const InkeepAIButton = ({ className, handleClick, isDocsHeader = false, collapsed = false }) => (
  <button
    className={cn(
      isDocsHeader
        ? // Single-bar docs header: outlined 36px button. The responsive header
          // collapses it to an icon-only trigger (via the `collapsed` prop, from
          // measurement) right after the search field, before any nav lane folds
          // into "More", and it stays reachable throughout.
          [
            'chat-widget flex h-9 items-center rounded-none border border-gray-new-85 bg-gray-new-98 text-sm text-gray-new-20',
            'transition-colors duration-200 hover:border-gray-new-70',
            'dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-80 dark:hover:border-gray-new-30 dark:hover:text-white',
            collapsed ? 'w-9 justify-center px-0' : 'gap-x-2 pr-3 pl-2.5',
          ]
        : [
            'chat-widget flex h-8 items-center justify-between gap-1.5 border border-gray-new-80 bg-gray-new-98 px-3 text-[13px] text-gray-new-30 lg:items-start lg:border-none lg:px-3 lg:py-0',
            'transition-colors duration-200 hover:border-gray-new-70',
            'dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-70 dark:hover:border-gray-new-30 dark:hover:text-white',
            'lg:hidden',
          ],
      className
    )}
    type="button"
    // Docs header can collapse to an icon-only button, so keep an accessible
    // name that matches the visible "Ask AI" label there.
    aria-label={isDocsHeader ? 'Ask AI' : 'Open Neon AI'}
    onClick={() => handleClick('AI_CHAT')}
  >
    {isDocsHeader ? (
      <DocsHeaderSparksIcon className="dark:[&_[stroke]]:stroke-gray-new-70 dark:[&_path[fill]]:fill-gray-new-70" />
    ) : (
      <SparksIcon />
    )}
    {!(isDocsHeader && collapsed) && (
      <span
        className={cn(
          'block leading-none',
          isDocsHeader ? 'text-sm leading-5 whitespace-nowrap' : 'text-[13px] tracking-extra-tight'
        )}
      >
        Ask AI
      </span>
    )}
  </button>
);

InkeepAIButton.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
  isDocsHeader: PropTypes.bool,
  collapsed: PropTypes.bool,
};

export default InkeepAIButton;
