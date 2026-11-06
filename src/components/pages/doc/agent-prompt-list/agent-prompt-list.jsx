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
// (a file under public/prompts/). Mirrors how CopyPrompt loads its src.
//
// Returns `{ copyText, ready }`. With no `src`, the visible text IS the full
// text, so it is ready immediately. With a `src`, `ready` stays false until
// the fetch resolves, so the copy control can block until the full prompt is
// loaded and never copy the truncated display string by racing the fetch.
const usePromptText = (src, fallback) => {
  const [fetched, setFetched] = useState(null);
  useEffect(() => {
    if (!src) return undefined;
    let cancelled = false;
    setFetched(null);
    fetch(src)
      .then((res) => res.text())
      .then((value) => {
        if (!cancelled) setFetched(value.trim());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src) return { copyText: fallback, ready: true };
  return { copyText: fetched ?? fallback, ready: fetched !== null };
};

const iconButtonClassName = cn(
  'flex size-6 shrink-0 items-center justify-center rounded-[4px] border-0 bg-transparent p-0 transition-colors',
  'text-gray-new-50 hover:bg-gray-new-90 hover:text-black-pure',
  'dark:text-gray-new-60 dark:hover:bg-gray-new-20 dark:hover:text-white',
  'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:outline-none dark:focus-visible:ring-green-52'
);

const IconCopyButton = ({ getText, label, ready = true }) => {
  const { isCopied, copy } = useCopyPrompt();
  return (
    <button
      type="button"
      title={ready ? label : 'Loading prompt…'}
      aria-label={isCopied ? 'Copied' : label}
      aria-live="polite"
      disabled={!ready}
      className={cn(
        iconButtonClassName,
        !ready && 'cursor-progress opacity-40 hover:bg-transparent'
      )}
      onClick={() => {
        if (!ready) return;
        copy(getText(), () => sendGtagEvent('Button Clicked', { text: 'Copy prompt' }));
      }}
    >
      {isCopied ? <CheckGlyph /> : <CopyGlyph />}
    </button>
  );
};

IconCopyButton.propTypes = {
  getText: PropTypes.func.isRequired,
  label: PropTypes.string,
  ready: PropTypes.bool,
};

// A copyable prompt box: an optional one-line header (owner / skill / scope),
// the prompt text, and an icon-only copy button. `src` copies the full prompt
// file; otherwise the visible text is copied verbatim.
const CopyLine = ({ text, src = null, header = null }) => {
  const { copyText, ready } = usePromptText(src, text);
  return (
    <div
      className={cn(
        'not-prose my-3 flex items-start gap-3 rounded-md border px-3 py-2.5',
        'border-gray-new-85 bg-white dark:border-gray-new-20 dark:bg-gray-new-8'
      )}
    >
      <div className="min-w-0 flex-1">
        {header && (
          <div className="mb-1.5 text-[12px] leading-snug text-gray-new-50 dark:text-gray-new-60">
            {header}
          </div>
        )}
        <span className="block font-mono text-[13px] leading-[1.55] break-words whitespace-pre-wrap text-black-pure dark:text-gray-new-94">
          {text}
        </span>
      </div>
      <IconCopyButton getText={() => copyText} ready={ready} label="Copy" />
    </div>
  );
};

CopyLine.propTypes = {
  text: PropTypes.string.isRequired,
  src: PropTypes.string,
  header: PropTypes.node,
};

const PromptRow = ({ text, src = null }) => {
  const { copyText, ready } = usePromptText(src, text);
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0',
        'border-gray-new-90 hover:bg-gray-new-98 dark:border-gray-new-15 dark:hover:bg-gray-new-10'
      )}
    >
      <span className="min-w-0 flex-1 text-sm text-black dark:text-gray-new-94">{text}</span>
      <IconCopyButton getText={() => copyText} ready={ready} label={`Copy: ${text}`} />
    </div>
  );
};

PromptRow.propTypes = {
  text: PropTypes.string.isRequired,
  src: PropTypes.string,
};

// Single-column awareness list of copyable one-liner prompts, all visible (no
// collapse). Each row shows one imperative line with an icon-only copy button.
// With a `src`, the row copies the full prompt file instead of the visible line.
const AgentPromptList = ({ items = [] }) => (
  <div className="not-prose my-4 flex flex-col overflow-hidden rounded-md border border-gray-new-85 bg-white dark:border-gray-new-20 dark:bg-gray-new-8">
    {items.map((item) => (
      <PromptRow key={item.text} text={item.text} src={item.src} />
    ))}
  </div>
);

AgentPromptList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      src: PropTypes.string,
    })
  ),
};

export { AgentPromptList, CopyLine };
export default AgentPromptList;
