'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CheckIcon from 'icons/check.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// Twin entry-path cards: a 2-card hero pattern.
// Left card ("Quick"): copy-command interaction with a dark command strip.
// Right card ("Guided"): link with a secondary CTA button.
// Children are <QuickPath> and <GuidedPath> (any order; QuickPath rendered first).

const TwinPaths = ({ children }) => (
  <div className="twin-paths not-prose my-7 grid max-w-[800px] grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
    {children}
  </div>
);

TwinPaths.propTypes = {
  children: PropTypes.node.isRequired,
};

const Pill = ({ variant, children }) => (
  <span
    className={cn(
      'inline-flex h-5 items-center rounded-full px-2.5 text-[11px] leading-none font-semibold tracking-wide whitespace-nowrap',
      variant === 'quick'
        ? 'bg-[#00E599] text-[#063D2A]'
        : 'border border-gray-new-90 bg-gray-new-94 text-gray-new-30 dark:border-gray-new-30 dark:bg-gray-new-20 dark:text-gray-new-80'
    )}
  >
    {children}
  </span>
);

Pill.propTypes = {
  variant: PropTypes.oneOf(['quick', 'guided']).isRequired,
  children: PropTypes.node.isRequired,
};

const QuickPath = ({ title, command, description, eta = '~5 min' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(command);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
      sendGtagEvent('Button Clicked', { text: `Twin path copy - ${title}` });
    } catch (err) {
       
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'group flex w-full cursor-copy flex-col gap-3.5 border border-[#B5EAD3] bg-[#ECFBF4] p-5 text-left transition-all duration-150',
        'hover:border-[#00E599] hover:shadow-[0_0_0_1px_#00E599]',
        'focus-visible:ring-2 focus-visible:ring-[#00E599] focus-visible:ring-offset-2 focus-visible:outline-none',
        'dark:border-[#00E599]/30 dark:bg-[#00E599]/[0.06]',
        'dark:hover:border-[#00E599] dark:hover:shadow-[0_0_0_1px_#00E599]',
        'dark:focus-visible:ring-offset-gray-new-8'
      )}
      aria-label={`Copy command: ${command}`}
    >
      <div className="flex items-center gap-2.5">
        <Pill variant="quick">Quick</Pill>
        <span className="text-xs leading-none font-medium text-gray-new-50 dark:text-gray-new-70">
          {eta}
        </span>
      </div>
      <h3 className="m-0! text-lg leading-tight font-semibold tracking-tight text-gray-new-15 dark:text-white">
        {title}
      </h3>
      <div
        className={cn(
          'flex items-center gap-2 px-3.5 py-3 font-mono text-[13px] leading-tight transition-all duration-150',
          'bg-[#0E0E0E] group-hover:bg-[#1A1A1A]',
          'dark:bg-[#050505] dark:ring-1 dark:ring-[#1F1F1F]'
        )}
      >
        <span className="text-[#9CA3AF]">$</span>
        <span className="flex-1 truncate text-[#00E599]">{command}</span>
        <span
          className={cn(
            'flex items-center gap-1 transition-colors duration-150',
            isCopied ? 'text-[#00E599]' : 'text-[#9CA3AF]'
          )}
        >
          {isCopied ? (
            <>
              <CheckIcon className="size-3.5" />
              <span className="text-[11px] font-medium">Copied</span>
            </>
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </span>
      </div>
      <p className="m-0! text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-80">
        {description}
      </p>
    </button>
  );
};

QuickPath.propTypes = {
  title: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  eta: PropTypes.string,
};

const GuidedPath = ({ title, description, href, cta = 'Open tutorial', eta = '~15 min' }) => (
  <Link
    href={href}
    className={cn(
      'group flex w-full flex-col gap-3.5 border border-gray-new-90 bg-white p-5 transition-all duration-150',
      'hover:border-[#00CC88] hover:shadow-[0_0_0_1px_#00CC88]',
      'focus-visible:ring-2 focus-visible:ring-[#00E599] focus-visible:ring-offset-2 focus-visible:outline-none',
      'dark:border-gray-new-20 dark:bg-[#141414]',
      'dark:hover:border-[#00E599] dark:hover:shadow-[0_0_0_1px_#00E599]',
      'dark:focus-visible:ring-offset-gray-new-8'
    )}
    onClick={() => sendGtagEvent('Card Clicked', { text: `Twin path link - ${title}` })}
  >
    <div className="flex items-center gap-2.5">
      <Pill variant="guided">Guided</Pill>
      <span className="text-xs leading-none font-medium text-gray-new-50 dark:text-gray-new-70">
        {eta}
      </span>
    </div>
    <h3 className="m-0! text-lg leading-tight font-semibold tracking-tight text-gray-new-15 dark:text-white">
      {title}
    </h3>
    <p className="m-0! text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-80">
      {description}
    </p>
    <span
      className={cn(
        'mt-auto inline-flex w-fit items-center gap-1.5 border border-gray-new-80 bg-white px-3.5 py-2 text-sm font-medium text-gray-new-15 transition-colors duration-150',
        'group-hover:border-[#00CC88] group-hover:text-[#00CC88]',
        'dark:border-gray-new-30 dark:bg-transparent dark:text-white',
        'dark:group-hover:border-[#00E599] dark:group-hover:text-[#00E599]'
      )}
    >
      {cta}{' '}
      <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">
        →
      </span>
    </span>
  </Link>
);

GuidedPath.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  cta: PropTypes.string,
  eta: PropTypes.string,
};

TwinPaths.QuickPath = QuickPath;
TwinPaths.GuidedPath = GuidedPath;

export { QuickPath, GuidedPath };
export default TwinPaths;
