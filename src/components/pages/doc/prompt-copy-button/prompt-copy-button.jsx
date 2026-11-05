'use client';

import PropTypes from 'prop-types';

import CopyIcon from 'components/pages/doc/docs-home/images/index-copy.inline.svg';
import useCopyPrompt from 'hooks/use-copy-prompt';
import CopiedIcon from 'icons/home/copied.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// Prompt files are fetched once per page view and shared across buttons.
const promptCache = new Map();

export const loadPrompt = (src) => {
  if (!promptCache.has(src)) {
    const request = fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch prompt: ${src}`);
        return res.text();
      })
      .then((text) => text.trim())
      .catch((err) => {
        promptCache.delete(src);
        throw err;
      });
    promptCache.set(src, request);
  }
  return promptCache.get(src);
};

// Robot glyph for "copy an agent prompt", drawn on a 16px grid.
const RobotIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 2.5v2.5" />
    <circle cx="8" cy="2.25" r="0.6" fill="currentColor" stroke="none" />
    <rect x="2.5" y="5" width="11" height="8.5" rx="1.75" />
    <path d="M1 8.5v2M15 8.5v2" />
    <circle cx="5.75" cy="8.75" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="10.25" cy="8.75" r="0.75" fill="currentColor" stroke="none" />
    <path d="M6.25 11.25h3.5" />
  </svg>
);

// Small copy button with a "Copy agent prompt" tooltip. Copies `text` as is,
// or the prompt file at `src` (fetched on hover or focus so the click can copy
// right away).
const PromptCopyButton = ({ src = null, text = null, label, className = null }) => {
  const { isCopied, copy } = useCopyPrompt();

  const prefetch = () => {
    if (src && !text) loadPrompt(src).catch(() => {});
  };

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let prompt = text;
    if (!prompt && src) {
      try {
        prompt = await loadPrompt(src);
      } catch (err) {
        console.error(err);
        return;
      }
    }
    if (!prompt) return;
    copy(prompt, () =>
      sendGtagEvent('Button Clicked', {
        text: `Copy prompt - ${label}`,
        tag_name: 'DocsHomeCopyPrompt',
      })
    );
  };

  const tooltip = isCopied ? 'Copied' : 'Copy agent prompt';

  return (
    <button
      type="button"
      className={cn(
        'group/prompt-copy relative z-20 flex h-8 shrink-0 items-center justify-center gap-2 rounded-[5px] border bg-white px-2 transition-[color,border-color,opacity] duration-200',
        'border-gray-new-80 text-gray-new-40 hover:border-gray-new-60 hover:text-black-pure',
        'dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-gray-new-70 dark:hover:border-gray-new-40 dark:hover:text-white',
        'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:outline-none',
        className
      )}
      aria-label={isCopied ? `Prompt copied for ${label}` : `Copy prompt for ${label}`}
      onClick={handleClick}
      onPointerEnter={prefetch}
      onFocus={prefetch}
    >
      <RobotIcon className="size-4 shrink-0 text-green-44 dark:text-green-52" aria-hidden />
      {isCopied ? (
        <CopiedIcon className="size-3.5 shrink-0 text-green-44 dark:text-green-52" aria-hidden />
      ) : (
        <CopyIcon className="shrink-0 [&_[stroke]]:stroke-current" aria-hidden />
      )}
      <span
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 px-2 py-1 font-sans text-xs leading-4 font-medium tracking-normal whitespace-nowrap',
          'bg-black-pure text-white dark:bg-white dark:text-black-pure',
          'opacity-0 transition-opacity duration-150 group-hover/prompt-copy:opacity-100 group-focus-visible/prompt-copy:opacity-100',
          isCopied && 'opacity-100'
        )}
        aria-hidden
      >
        {tooltip}
      </span>
    </button>
  );
};

PromptCopyButton.propTypes = {
  src: PropTypes.string,
  text: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default PromptCopyButton;
