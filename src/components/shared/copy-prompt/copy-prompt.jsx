'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useId, useRef, useState } from 'react';

import Button from 'components/shared/button';
import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import patternSvg from 'images/pages/docs/copy-prompt/pattern.svg';
import { cn } from 'utils/cn';
import getNodeText from 'utils/get-node-text';
import sendGtagEvent from 'utils/send-gtag-event';

const DEFAULT_DISPLAY_TEXT = 'Use this pre-built prompt to get started faster.';
const DEFAULT_BUTTON_TEXT = 'Copy prompt';

// Collapse threshold from the design handoff: about 4 lines of the 14px/1.7
// prompt text (14 * 1.7 * 4 ≈ 95px), measured against the prompt's rendered
// height after fonts load.
const COLLAPSED_MAX_HEIGHT = 95;

const ChevronIcon = (props) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 4.5 6 7.5 9 4.5" />
  </svg>
);

// navigator.clipboard first, with a hidden-textarea + execCommand fallback for
// contexts where the async clipboard API is unavailable (e.g. some iframes).
function copyWithFallback(text) {
  if (typeof document === 'undefined') return;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch {
    // Clipboard not available; nothing more we can do.
  }
  document.body.removeChild(textarea);
}

const CopyPrompt = (props) => {
  const {
    src,
    description = DEFAULT_DISPLAY_TEXT,
    buttonText = DEFAULT_BUTTON_TEXT,
    title = null,
    children = null,
  } = props;
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const promptRef = useRef(null);
  const copyTimeoutRef = useRef(null);
  const promptId = useId();
  const [collapsible, setCollapsible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!src) return;
    fetch(src)
      .then((res) => res.text())
      .then(setMarkdown);
  }, [src]);

  useEffect(() => () => clearTimeout(copyTimeoutRef.current), []);

  // The exact text shown and copied in the agent-prompt layout: inline children
  // when provided, otherwise the markdown fetched from `src`.
  const childrenText = getNodeText(children).trim();
  const promptText = childrenText || markdown.trim();

  // Measure the prompt after fonts load and on resize to decide whether it needs
  // to collapse (taller than ~4 lines). scrollHeight reports the full content
  // height even while the element is clamped, so re-measuring stays accurate.
  useEffect(() => {
    if (!title) return undefined;
    const el = promptRef.current;
    if (!el) return undefined;

    let cancelled = false;
    const measure = () => {
      if (!cancelled) setCollapsible(el.scrollHeight > COLLAPSED_MAX_HEIGHT + 1);
    };
    measure();

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(el);
    }
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    window.addEventListener('resize', measure);

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [title, promptText]);

  // ---- Legacy layout: no `title`. Unchanged, so existing callers render as before. ----
  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    sendGtagEvent('Button Clicked', { text: 'Copy prompt' });
  };

  if (!title) {
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
  }

  // ---- Agent-prompt layout: `title` present (header strip + collapsible body). ----
  const handleAgentCopy = async () => {
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(promptText);
      } else {
        copyWithFallback(promptText);
      }
    } catch {
      copyWithFallback(promptText);
    }
    setCopied(true);
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1600);
    sendGtagEvent('Button Clicked', { text: 'Copy prompt' });
  };

  const isClamped = collapsible && !expanded;

  return (
    <div
      className={cn(
        'not-prose my-5 w-full rounded-[2px] border',
        'border-gray-new-85 bg-white',
        'dark:border-gray-new-20 dark:bg-black-fog'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-new-90 bg-gray-new-98 py-2.5 pr-3 pl-5 dark:border-gray-new-15 dark:bg-gray-new-8">
        <div className="font-mono text-sm font-medium tracking-snug text-black dark:text-gray-new-94">
          {title}
        </div>
        <button
          type="button"
          onClick={handleAgentCopy}
          className={cn(
            'inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[2px] px-3.5 font-sans text-sm leading-none font-medium transition-colors',
            'bg-green-44 text-white hover:bg-code-green-1',
            'dark:bg-green-52 dark:text-black-pure dark:hover:bg-code-green-2',
            'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-new-98 focus-visible:outline-none dark:focus-visible:ring-green-52 dark:focus-visible:ring-offset-gray-new-8'
          )}
        >
          {copied ? 'Copied' : buttonText}
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>

      <div className={cn('relative px-5 pt-[18px]', collapsible ? 'pb-0' : 'pb-5')}>
        <p
          ref={promptRef}
          id={promptId}
          className={cn(
            'm-0 font-mono text-[14px] leading-[1.7] tracking-snug [text-wrap:pretty] whitespace-pre-wrap text-black dark:text-gray-new-94',
            isClamped && 'max-h-[95px] overflow-hidden'
          )}
        >
          {promptText}
        </p>
        {isClamped && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-white dark:to-black-fog" />
        )}
      </div>

      {collapsible && (
        <div className="flex justify-center pt-2 pb-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={promptId}
            aria-label={expanded ? 'Collapse prompt' : 'Expand prompt'}
            className={cn(
              'flex size-7 items-center justify-center rounded-full border bg-transparent transition-colors',
              'border-gray-new-80 text-gray-new-50 hover:border-green-44 hover:text-green-44',
              'dark:border-gray-new-20 dark:text-gray-new-60 dark:hover:border-green-52 dark:hover:text-green-52',
              'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-green-52 dark:focus-visible:ring-offset-black-fog'
            )}
          >
            <ChevronIcon
              className={cn(
                'transition-transform duration-[160ms] ease-out',
                expanded && 'rotate-180'
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
};

CopyPrompt.propTypes = {
  src: PropTypes.string,
  description: PropTypes.node,
  buttonText: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default CopyPrompt;
