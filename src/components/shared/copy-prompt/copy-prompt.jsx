'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Button from 'components/shared/button';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const DEFAULT_DISPLAY_TEXT = 'Use this pre-built prompt to get started faster.';
const DEFAULT_BUTTON_TEXT = 'Copy prompt';

const CopyPrompt = (props) => {
  const {
    src,
    description = DEFAULT_DISPLAY_TEXT,
    buttonText = DEFAULT_BUTTON_TEXT,
    showOpenInCursor = true,
  } = props;
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then(setMarkdown);
  }, [src]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    sendGtagEvent('Button Clicked', { text: 'Copy prompt' });
  };

  return (
    <figure
      className={clsx(
        'not-prose my-5 flex items-center gap-x-6 rounded-[10px] px-7 py-4 sm:flex-col sm:items-start sm:gap-y-4 sm:px-5',
        'border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA_0%,rgba(250,250,250,0)100%)]',
        'dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_28.86%,#131415_74.18%)]'
      )}
    >
      <div className="text-gray-900 flex-1 whitespace-pre-line break-words text-base font-medium dark:text-gray-new-80">
        {description}
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:w-full">
        {showOpenInCursor && (
          <Button
            className="inline-flex items-center gap-2 rounded-md border border-gray-new-80 px-4 py-1.5 text-sm font-medium hover:border-gray-new-60 dark:border-gray-new-20 dark:hover:border-gray-new-40"
            theme="gray-dark-outline-black"
            aria-label="Open in Cursor"
            onClick={() => {
              window.open(
                `https://cursor.com/link/prompt?text=${encodeURIComponent(markdown)}`,
                '_blank'
              );
              sendGtagEvent('Opened in Cursor', { location: 'Copy Prompt' });
            }}
          >
            <svg viewBox="0 0 466.73 532.09" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                fill="currentColor"
                d="M457.43 125.94 244.42 2.96a22.127 22.127 0 0 0-22.12 0L9.3 125.94C3.55 129.26 0 135.4 0 142.05v247.99c0 6.65 3.55 12.79 9.3 16.11l213.01 122.98a22.127 22.127 0 0 0 22.12 0l213.01-122.98c5.75-3.32 9.3-9.46 9.3-16.11V142.05c0-6.65-3.55-12.79-9.3-16.11h-.01Zm-13.38 26.05L238.42 508.15c-1.39 2.4-5.06 1.42-5.06-1.36V273.58c0-4.66-2.49-8.97-6.53-11.31L24.87 145.67c-2.4-1.39-1.42-5.06 1.36-5.06h411.26c5.84 0 9.49 6.33 6.57 11.39h-.01Z"
              />
            </svg>
            Open in Cursor
          </Button>
        )}
        <Button
          className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium"
          theme="primary"
          aria-label={copied ? 'Copied!' : buttonText}
          onClick={handleCopy}
        >
          <CopyIcon className="h-4 w-4" />
          {copied ? 'Copied!' : buttonText}
        </Button>
      </div>
    </figure>
  );
};

CopyPrompt.propTypes = {
  src: PropTypes.string.isRequired,
  description: PropTypes.node,
  buttonText: PropTypes.string,
  showOpenInCursor: PropTypes.bool,
};

export default CopyPrompt;
