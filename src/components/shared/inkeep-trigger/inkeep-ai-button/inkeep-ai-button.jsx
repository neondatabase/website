import PropTypes from 'prop-types';

import DocsHeaderSparksIcon from 'components/pages/doc/docs-header/images/sparks.inline.svg';
import SparksIcon from 'icons/sparks.inline.svg';
import { cn } from 'utils/cn';

const InkeepAIButton = ({ className, handleClick, isDocsHeader = false }) => (
  <button
    className={cn(
      isDocsHeader
        ? // Single-bar docs header: outlined 36px button, hidden below 1100px
          // (Ask AI stays reachable from the ⌘K search modal).
          [
            'chat-widget flex h-9 items-center gap-x-2 rounded-none border border-gray-new-85 bg-gray-new-98 pr-3 pl-2.5 text-sm text-gray-new-20',
            'transition-colors duration-200 hover:border-gray-new-70',
            'dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-80 dark:hover:border-gray-new-30 dark:hover:text-white',
            'max-[1100px]:hidden',
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
    aria-label="Open Neon AI"
    onClick={() => handleClick('AI_CHAT')}
  >
    {isDocsHeader ? (
      <DocsHeaderSparksIcon className="dark:[&_[stroke]]:stroke-gray-new-70 dark:[&_path[fill]]:fill-gray-new-70" />
    ) : (
      <SparksIcon />
    )}
    <span
      className={cn(
        'block leading-none',
        isDocsHeader ? 'text-sm leading-5 whitespace-nowrap' : 'text-[13px] tracking-extra-tight'
      )}
    >
      Ask AI
    </span>
  </button>
);

InkeepAIButton.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
  isDocsHeader: PropTypes.bool,
};

export default InkeepAIButton;
