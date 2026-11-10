'use client';

import PropTypes from 'prop-types';

import ProviderMarks from 'components/shared/provider-marks';
import useCopyPrompt from 'hooks/use-copy-prompt';
import sendGtagEvent from 'utils/send-gtag-event';

const PromptBlockCopyButton = ({ text }) => {
  const { isCopied, copy } = useCopyPrompt();
  return (
    <button
      type="button"
      aria-label={isCopied ? 'Prompt copied' : 'Copy prompt'}
      aria-live="polite"
      className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-gray-new-80 bg-white px-3.5 text-sm leading-none font-medium text-black-pure transition-colors hover:border-gray-new-60 hover:bg-gray-new-98 focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:outline-none dark:border-gray-new-30 dark:bg-gray-new-8 dark:text-white dark:hover:border-gray-new-50 dark:hover:bg-gray-new-15"
      onClick={() => copy(text, () => sendGtagEvent('Button Clicked', { text: 'Copy prompt' }))}
    >
      <ProviderMarks className="text-black-pure dark:text-white" />
      {isCopied ? 'Prompt copied!' : 'Copy prompt'}
    </button>
  );
};

PromptBlockCopyButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default PromptBlockCopyButton;
