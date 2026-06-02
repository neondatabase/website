'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Button from 'components/shared/button';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import patternSvg from 'images/pages/docs/copy-prompt/pattern.svg';
import { cn } from 'utils/cn';
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
      className={cn(
        'not-prose relative my-5 flex items-center justify-between gap-x-6 p-5 pr-6 sm:flex-col sm:items-start sm:gap-y-4',
        'border border-gray-new-80 bg-[rgba(228,241,235,0.4)]',
        'dark:border-gray-new-30 dark:bg-gray-new-10'
      )}
    >
      <Image
        className="absolute top-0 right-0 h-full w-auto object-cover sm:hidden"
        src={patternSvg}
        alt=""
        width={188}
        height={90}
      />
      <div className="relative z-10 max-w-[440px] flex-1 text-xl leading-tight font-medium tracking-extra-tight wrap-break-word whitespace-pre-line text-black-pure dark:text-white">
        {description}
      </div>
      <Button
        className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 text-base leading-none font-normal tracking-tight dark:font-medium"
        theme="white-filled-multi"
        aria-label={copied ? 'Copied!' : buttonText}
        onClick={handleCopy}
      >
        <CopyIcon className="size-3.5" />
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
