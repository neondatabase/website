'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import { cn } from 'utils/cn';

// Height of the collapsed teaser, in pixels. Small on purpose: just enough for
// the fade to have something to dissolve, so the collapsed content below the
// skill boxes reads as "there's more here" rather than a readable section.
const DEFAULT_COLLAPSED_HEIGHT = 44;

// Same chevron-in-a-circle glyph the agent-prompt fade uses in
// components/shared/copy-prompt/copy-prompt.jsx.
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

// Clamp arbitrary child MDX behind the same fade + expand-chevron the agent
// prompt box uses (see copy-prompt.jsx, variant="agent"). The only difference
// from that box is what gets clamped: here it is whatever children you pass,
// not a single prompt paragraph.
//
// The gradient's end color is the surface the fade sits on, exactly as
// copy-prompt fades to its own white / black-fog box background. This wrapper
// lives inside the tinted "Build with your agent" band, so it fades to the
// band's gray-new-95 / gray-new-10 surface; override `fadeToClassName` when
// placing it on a different surface.
const CollapseFade = ({
  children,
  collapsedHeight = DEFAULT_COLLAPSED_HEIGHT,
  fadeToClassName = 'to-gray-new-95 dark:to-gray-new-10',
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="not-prose">
      {/* -ml-11 pl-11 widens the clip box left into the step-number gutter so
          overflow-hidden never clips the h3 counter circles (which sit at
          -left-11), while keeping the content at its original position. */}
      <div
        className={cn('relative -ml-11 pl-11', !expanded && 'overflow-hidden')}
        style={expanded ? undefined : { maxHeight: `${collapsedHeight}px` }}
      >
        <div className={cn(!expanded && '[&>*:first-child]:!mt-0')}>{children}</div>
        {!expanded && (
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent',
              fadeToClassName
            )}
          />
        )}
      </div>

      <div className="flex justify-center pt-2 pb-1">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Show less' : 'Show more'}
          className={cn(
            'flex size-7 items-center justify-center rounded-full border bg-transparent transition-colors',
            'border-gray-new-80 text-gray-new-50 hover:border-green-44 hover:text-green-44',
            'dark:border-gray-new-20 dark:text-gray-new-60 dark:hover:border-green-52 dark:hover:text-green-52',
            'focus-visible:ring-2 focus-visible:ring-green-44 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-new-95 focus-visible:outline-none dark:focus-visible:ring-green-52 dark:focus-visible:ring-offset-gray-new-10'
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
    </div>
  );
};

CollapseFade.propTypes = {
  children: PropTypes.node,
  collapsedHeight: PropTypes.number,
  fadeToClassName: PropTypes.string,
};

export default CollapseFade;
