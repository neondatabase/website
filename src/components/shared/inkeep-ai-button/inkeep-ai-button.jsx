'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import SparksIcon from './images/sparks.inline.svg';

const InkeepAIButton = ({ className, topOffset, handleClick }) => (
  <button
    className={clsx(
      'chat-widget group flex h-8 items-center justify-center gap-1 rounded border border-gray-new-90 bg-gradient-to-b from-white to-gray-new-98 p-2.5 transition-all duration-200 hover:border-gray-new-70 focus:outline-none',
      'dark:border-[#272727] dark:from-[#1A1C1E] dark:to-[#0F1010] dark:hover:border-gray-new-20',
      'lg:hidden',
      className
    )}
    style={{ top: topOffset - 56 || 0 }}
    type="button"
    aria-label="Open Neon AI"
    onClick={() => handleClick('AI_CHAT')}
  >
    <SparksIcon className="relative z-10 h-3 w-3" />
    <span className={clsx('block text-[13px] font-medium leading-none')}>
      <span className="block">Ask Neon AI</span>
      <span className="hidden text-gray-new-20 dark:text-gray-new-90" aria-hidden>
        Ask Neon AI instead
      </span>
    </span>
  </button>
);

InkeepAIButton.propTypes = {
  className: PropTypes.string,
  topOffset: PropTypes.number,
  handleClick: PropTypes.func,
};

export default InkeepAIButton;
