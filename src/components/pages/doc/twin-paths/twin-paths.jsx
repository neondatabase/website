'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import LabelArrowGreen from 'icons/arrow-label-green.inline.svg';
import LabelArrow from 'icons/arrow-label.inline.svg';
import CheckIcon from 'icons/check.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// Twin entry-path cards: a 2-card hero pattern.
// Left card ("Quick"): copy-command interaction with a dark command strip.
// Right card ("Guided"): link with a secondary CTA button.
// Children are <QuickPath> and <GuidedPath> (any order; QuickPath rendered first).
//
// TourCallout is a separate, full-width banner meant to sit below <TwinPaths>
// (not inside its 2-col grid) pointing to a broader guided tour of the stack.

const TwinPaths = ({ children }) => (
  <div className="twin-paths not-prose my-7 grid w-full grid-cols-2 gap-6 md:grid-cols-1 md:gap-4">
    {children}
  </div>
);

TwinPaths.propTypes = {
  children: PropTypes.node.isRequired,
};

const PathLabel = ({ label, eta }) => (
  <p className="flex items-center gap-2 font-mono text-sm leading-none font-medium tracking-normal uppercase">
    <LabelArrow
      className="block h-3.5 w-3 flex-none text-[#FF3621] md:size-2.5"
      aria-hidden="true"
      focusable="false"
    />
    <span className="text-black-pure dark:text-white">{label}</span>
    <span className="text-black-pure/40 dark:text-white/40">{eta}</span>
  </p>
);

PathLabel.propTypes = {
  label: PropTypes.string.isRequired,
  eta: PropTypes.string.isRequired,
};

const QuickPath = ({ title, command, description, eta = '~5 min' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
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
    <article
      className={cn(
        'flex min-h-[282px] w-full flex-col border border-green-44/70 bg-[#E4F1EB]/40 p-5 text-left md:min-h-[260px]',
        'dark:border-green-44/38 dark:bg-[#101815]'
      )}
    >
      <PathLabel label="Quick" eta={eta} />
      <div className="mt-auto w-full">
        <h3 className="text-xl leading-snug font-medium text-black-pure dark:text-white">
          {title}
        </h3>
        <p className="mt-1.5 text-base leading-snug text-gray-new-40 dark:text-gray-new-60">
          {description}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'mt-5 flex h-11 w-full cursor-pointer items-center gap-1.5 px-4 text-left font-mono text-base leading-none transition-colors duration-150',
            'bg-[#24282A] text-white hover:bg-[#1A1D1F]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00CC88]',
            'dark:bg-[#E4F1EB] dark:text-black-pure dark:hover:bg-white',
            'dark:focus-visible:outline-[#00E599]'
          )}
          aria-label={`Copy command: ${command}`}
        >
          <span className="text-gray-new-60">$</span>
          <span className="flex-1 truncate">{command}</span>
          <span
            className={cn(
              'flex shrink-0 items-center text-gray-new-60 transition-colors duration-150',
              isCopied && 'text-[#00CC88] dark:text-[#00A86B]'
            )}
            aria-live="polite"
          >
            {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-3.5" />}
            <span className="sr-only">{isCopied ? 'Copied' : 'Copy command'}</span>
          </span>
        </button>
      </div>
    </article>
  );
};

QuickPath.propTypes = {
  title: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  eta: PropTypes.string,
};

const GuidedPath = ({ title, description, href, cta = 'Open quickstart', eta = '~10 min' }) => (
  <article
    className={cn(
      'flex min-h-[282px] w-full flex-col border border-gray-new-80 bg-gray-new-98 p-5 md:min-h-[260px]',
      'dark:border-gray-new-20 dark:bg-gray-new-8'
    )}
  >
    <PathLabel label="Guided" eta={eta} />
    <div className="mt-auto w-full">
      <h3 className="text-xl leading-snug font-medium text-black-pure dark:text-white">{title}</h3>
      <p className="mt-1.5 text-base leading-snug text-gray-new-40 dark:text-gray-new-60">
        {description}
      </p>
      <Link
        href={href}
        className={cn(
          'mt-5 inline-flex h-11 w-fit items-center rounded-full border border-gray-new-60 bg-black-pure/2 px-7 text-base leading-none font-medium text-black-pure transition-colors duration-150',
          'hover:border-black-pure dark:hover:border-gray-new-50',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F]',
          'dark:border-gray-new-40 dark:bg-white/2 dark:text-white'
        )}
        onClick={() => sendGtagEvent('Card Clicked', { text: `Twin path link - ${title}` })}
      >
        {cta}
      </Link>
    </div>
  </article>
);

GuidedPath.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  cta: PropTypes.string,
  eta: PropTypes.string,
};

const TourCallout = ({ title, description, href, cta = 'Start the tour', eta = '~15 min' }) => (
  <div
    className={cn(
      'tour-callout not-prose my-5 flex items-center justify-between gap-7 border p-6 sm:flex-col sm:items-start sm:gap-5',
      'border-green-52/30 bg-[#EAF7F1]',
      'dark:border-green-52/30 dark:bg-[#0D1611]'
    )}
  >
    <div>
      <p className="flex items-center gap-2 font-mono text-sm leading-none font-medium tracking-normal uppercase">
        <LabelArrowGreen
          className="block h-3.5 w-3 flex-none md:size-2.5"
          aria-hidden="true"
          focusable="false"
        />
        <span className="text-green-52">Tutorial</span>
        <span className="text-black-pure/40 dark:text-white/40">{eta}</span>
      </p>
      <h3 className="mt-2.5 text-xl leading-snug font-medium text-black-pure dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 max-w-[620px] text-base leading-snug text-gray-new-40 dark:text-gray-new-60">
        {description}
      </p>
    </div>
    <Button
      className="w-fit shrink-0 border border-gray-new-60 bg-black-pure/2 px-7 py-3.5 text-base leading-none font-medium text-black-pure hover:border-black-pure dark:border-gray-new-40 dark:bg-white/2 dark:text-white dark:hover:border-gray-new-50"
      to={href}
      theme="transparent"
      withArrow
      tagName="TourCallout"
    >
      {cta}
    </Button>
  </div>
);

TourCallout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  cta: PropTypes.string,
  eta: PropTypes.string,
};

TwinPaths.QuickPath = QuickPath;
TwinPaths.GuidedPath = GuidedPath;
TwinPaths.TourCallout = TourCallout;

export { QuickPath, GuidedPath, TourCallout };
export default TwinPaths;
