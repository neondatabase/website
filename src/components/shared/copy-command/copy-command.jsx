'use client';

import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopiedIcon from 'icons/home/copied.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const CopyCommand = ({ command, className = '', trackingLabel = null }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(1500);

  const handleCopyWithTracking = () => {
    handleCopy(command);
    if (trackingLabel) {
      sendGtagEvent('Button Clicked', { text: trackingLabel });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopyWithTracking}
      className={cn(
        'flex h-11 w-full min-w-0 cursor-pointer items-center gap-1.5 px-4 text-left font-mono text-base leading-none transition-colors duration-150',
        'bg-[#24282A] text-white hover:bg-[#1A1D1F]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00CC88]',
        'dark:bg-[#E4F1EB] dark:text-black-pure dark:hover:bg-white',
        'dark:focus-visible:outline-[#00E599]',
        className
      )}
      aria-label={`Copy command: ${command}`}
    >
      <span className="text-gray-new-60" aria-hidden>
        $
      </span>
      <span className="flex-1 truncate">{command}</span>
      <span
        className={cn(
          'flex shrink-0 items-center text-gray-new-60 transition-colors duration-150',
          isCopied && 'text-white dark:text-gray-new-20'
        )}
        aria-live="polite"
      >
        {isCopied ? (
          <CopiedIcon className="size-4" aria-hidden />
        ) : (
          <CopyIcon className="size-3.5" aria-hidden />
        )}
        <span className="sr-only">{isCopied ? 'Copied' : 'Copy command'}</span>
      </span>
    </button>
  );
};

CopyCommand.propTypes = {
  command: PropTypes.string.isRequired,
  className: PropTypes.string,
  trackingLabel: PropTypes.string,
};

export default CopyCommand;
