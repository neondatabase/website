import clsx from 'clsx';
import PropTypes from 'prop-types';

import SparksIcon from 'icons/sparks.inline.svg';

const InkeepAIButton = ({ className, handleClick }) => (
  <button
    className={clsx(
      'chat-widget flex h-8 items-center justify-between gap-1.5 border border-gray-new-80 bg-gray-new-98 px-3 text-[13px] text-gray-new-30 lg:items-start lg:border-none lg:px-3 lg:py-0',
      'transition-colors duration-200 hover:border-gray-new-70',
      'dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-70 dark:hover:border-gray-new-30 dark:hover:text-white',
      'lg:hidden',
      className
    )}
    type="button"
    aria-label="Open Neon AI"
    onClick={() => handleClick('AI_CHAT')}
  >
    <SparksIcon />
    <span className="block text-[13px] leading-none tracking-extra-tight">Ask AI</span>
  </button>
);

InkeepAIButton.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
};

export default InkeepAIButton;
