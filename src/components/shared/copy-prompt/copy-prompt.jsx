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
  const { src, description = DEFAULT_DISPLAY_TEXT, buttonText = DEFAULT_BUTTON_TEXT } = props;
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
      <Button
        className="inline-flex w-[140px] items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium xs:w-full"
        theme="primary"
        aria-label={copied ? 'Copied!' : buttonText}
        onClick={handleCopy}
      >
        <CopyIcon className="h-4 w-4" />
        {copied ? 'Copied!' : buttonText}
      </Button>
    </figure>
  );
};

CopyPrompt.propTypes = {
  src: PropTypes.string.isRequired,
  description: PropTypes.node,
  buttonText: PropTypes.string,
};

export default CopyPrompt;
