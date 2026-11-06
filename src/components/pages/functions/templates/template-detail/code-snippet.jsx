'use client';

import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopiedIcon from 'icons/home/copied.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

import CopyIcon from './images/copy.inline.svg';

// Shell command snippet in the docs code colors: `$` prompt, program as keyword,
// `--flags` as constants and each flag's value as a function token.
const renderArgs = (args) =>
  args.map((arg, index) => {
    let color = null;
    if (arg.startsWith('-')) color = 'text-[#94b5f7]';
    else if (index > 0 && args[index - 1].startsWith('-')) color = 'text-[#f7b983]';

    return <span key={index}> {color ? <span className={color}>{arg}</span> : arg}</span>;
  });

const CodeSnippet = ({ command, className, trackingLabel = null }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(1500);
  const [program, ...args] = command.split(' ');

  const copy = () => {
    handleCopy(command);
    if (trackingLabel) sendGtagEvent('Button Clicked', { text: trackingLabel });
  };

  return (
    <div
      className={cn(
        'flex min-w-0 items-center justify-between gap-4 border border-gray-new-20 bg-gray-new-8 p-4',
        className
      )}
    >
      <code className="min-w-0 flex-1 font-mono text-sm leading-normal tracking-[-0.02em] break-words text-[#f9fafa]">
        <span className="whitespace-pre text-gray-new-50 select-none" aria-hidden>
          ${'  '}
        </span>
        <span className="text-[#34d59a]">{program}</span>
        {renderArgs(args)}
      </code>
      <button
        type="button"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center border border-[#303236] bg-[#09090b] text-[#94979e] transition-colors duration-200 hover:border-gray-new-40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
        aria-label={`Copy command: ${command}`}
        onClick={copy}
      >
        {isCopied ? (
          <CopiedIcon className="size-3.5 text-white" aria-hidden />
        ) : (
          <CopyIcon className="size-3.5" aria-hidden />
        )}
        <span className="sr-only" aria-live="polite">
          {isCopied ? 'Copied' : ''}
        </span>
      </button>
    </div>
  );
};

CodeSnippet.propTypes = {
  command: PropTypes.string.isRequired,
  className: PropTypes.string,
  trackingLabel: PropTypes.string,
};

export default CodeSnippet;
