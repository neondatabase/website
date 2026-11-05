'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import useCopyPrompt from 'hooks/use-copy-prompt';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const CopyGlyph = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
  </svg>
);

const CheckGlyph = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3.5 8.5l3 3 6-6" />
  </svg>
);

// Resolve the text that gets copied: the full prompt fetched from `src`
// (a file under public/prompts/), falling back to the visible text when no
// src is given or the fetch fails. Mirrors how CopyPrompt loads its src.
const usePromptText = (src, fallback) => {
  const [text, setText] = useState(fallback || '');
  useEffect(() => {
    if (!src) {
      setText(fallback || '');
      return undefined;
    }
    let cancelled = false;
    fetch(src)
      .then((res) => res.text())
      .then((value) => {
        if (!cancelled) setText(value.trim());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src, fallback]);
  return text;
};

const iconButtonClassName = cn(
  'flex size-6 shrink-0 items-center justify-center rounded-[4px] border-0 bg-transparent p-0 transition-colors',
  'text-gray-new-50 hover:bg-gray-new-90 hover:text-black-pure',
  'dark:text-gray-new-60 dark:hover:bg-gray-new-20 dark:hover:text-white',
  'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:outline-none dark:focus-visible:ring-green-52'
);

const IconCopyButton = ({ getText, label }) => {
  const { isCopied, copy } = useCopyPrompt();
  return (
    <button
      type="button"
      title={label}
      aria-label={isCopied ? 'Copied' : label}
      aria-live="polite"
      className={iconButtonClassName}
      onClick={() =>
        copy(getText(), () => sendGtagEvent('Button Clicked', { text: 'Copy prompt' }))
      }
    >
      {isCopied ? <CheckGlyph /> : <CopyGlyph />}
    </button>
  );
};

IconCopyButton.propTypes = {
  getText: PropTypes.func.isRequired,
  label: PropTypes.string,
};

// A single command or prompt box: visible text on the left, icon-only copy on
// the right. `src` copies the full prompt file; otherwise the visible text is
// copied verbatim (used for the one-line setup command).
const CopyLine = ({ text, src = null, multiline = false }) => {
  const copyText = usePromptText(src, text);
  return (
    <div
      className={cn(
        'not-prose my-3 flex gap-3 rounded-md border px-3 py-2.5',
        'border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8',
        multiline ? 'items-start' : 'items-center'
      )}
    >
      <span
        className={cn(
          'min-w-0 flex-1 font-mono text-[13px] text-black-pure dark:text-gray-new-94',
          multiline ? 'leading-[1.55] whitespace-pre-wrap' : 'truncate'
        )}
      >
        {text}
      </span>
      <IconCopyButton getText={() => copyText} label="Copy" />
    </div>
  );
};

CopyLine.propTypes = {
  text: PropTypes.string.isRequired,
  src: PropTypes.string,
  multiline: PropTypes.bool,
};

const PromptRow = ({ title, text, src = null }) => {
  const copyText = usePromptText(src, text);
  return (
    <div
      className={cn(
        'grid grid-cols-[150px_1fr_24px] items-center gap-3.5 border-b px-1 py-2.5 last:border-b-0 sm:grid-cols-[1fr_24px] sm:gap-y-1',
        'border-gray-new-90 hover:bg-gray-new-98 dark:border-gray-new-15 dark:hover:bg-gray-new-8'
      )}
    >
      <span className="text-sm font-medium text-black dark:text-gray-new-94">{title}</span>
      <span
        className="truncate font-mono text-[12.5px] text-gray-new-40 dark:text-gray-new-70 sm:col-start-1"
        title={text}
      >
        {text}
      </span>
      <IconCopyButton getText={() => copyText} label={`Copy prompt: ${title}`} />
    </div>
  );
};

PromptRow.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  src: PropTypes.string,
};

// Single-column list of copyable prompts. Each row shows a title and a
// one-line prompt, with an icon-only button that copies the full prompt.
const AgentPromptList = ({ items = [] }) => (
  <div className="not-prose my-5 flex flex-col">
    {items.map((item) => (
      <PromptRow key={item.title} title={item.title} text={item.text} src={item.src} />
    ))}
  </div>
);

AgentPromptList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      src: PropTypes.string,
    })
  ),
};

export { AgentPromptList, CopyLine };
export default AgentPromptList;
