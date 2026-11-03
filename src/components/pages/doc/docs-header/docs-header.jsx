'use client';

import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import { cn } from 'utils/cn';
import { getDocsHeaderLanes } from 'utils/get-docs-nav-href';

import DocsNavigation from '../docs-navigation';

import DocsHeaderMenu from './docs-header-menu';
import LogoDivider from './images/logo-divider.inline.svg';
import LogoLightIcon from './images/neon-logo.inline.svg';

// Lane overflow priority, highest priority first (kept inline longest). The
// lowest-priority lanes drop into the "More" menu first. This is intentionally
// a plain list so the order can be tuned without touching the measuring logic.
// Lanes not named here are treated as lowest priority and, among themselves,
// the right-most one drops first.
const LANE_OVERFLOW_PRIORITY = [
  'Get started',
  'Reference',
  'Concepts',
  'Products',
  'Platform',
  'Resources',
];

const UNRANKED_PRIORITY = LANE_OVERFLOW_PRIORITY.length + 1;

const laneRank = (lane) => {
  const index = LANE_OVERFLOW_PRIORITY.indexOf(lane?.nav);
  return index === -1 ? UNRANKED_PRIORITY : index;
};

// Priority-plus overflow: measure each lane's intrinsic width once (re-measured
// after web fonts load), then on every container resize work out how many lanes
// fit in the nav's available width and push the rest into the "More" menu, one
// at a time, lowest priority first. The "More" trigger lives outside this
// container, so its width is already excluded from the available space.
const useLaneOverflow = (navRef, lanes) => {
  const widthsRef = useRef([]);
  const gapRef = useRef(0);
  const [state, setState] = useState({ isMeasured: false, hiddenIndexes: [] });

  // Which lanes overflow, computed purely from the cached intrinsic widths and
  // the live available width (no layout writes, so resize never thrashes).
  const computeHidden = useCallback(() => {
    const nav = navRef.current;
    const widths = widthsRef.current;
    if (!nav || widths.length === 0) return [];

    const available = nav.clientWidth;
    const gap = gapRef.current;
    const fits = (indexes) => {
      if (indexes.length === 0) return true;
      const total =
        indexes.reduce((sum, index) => sum + widths[index], 0) + gap * (indexes.length - 1);
      return total <= available + 0.5;
    };

    const visible = widths.map((_, index) => index);
    if (fits(visible)) return [];

    // Drop lowest priority first; break ties by dropping the right-most lane.
    const dropOrder = [...visible].sort((a, b) => {
      const rankDelta = laneRank(lanes[b]) - laneRank(lanes[a]);
      return rankDelta !== 0 ? rankDelta : b - a;
    });

    const hidden = new Set();
    for (const index of dropOrder) {
      hidden.add(index);
      if (fits(visible.filter((i) => !hidden.has(i)))) break;
    }

    return visible.filter((index) => hidden.has(index));
  }, [navRef, lanes]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    // Cache each lane's own width. Hidden lanes report 0 (display: none), so we
    // keep their last known width rather than overwriting it with a stale zero.
    const measure = () => {
      const children = Array.from(nav.children);
      // Drop any cached widths from a longer previous lane set.
      widthsRef.current.length = children.length;
      children.forEach((child, index) => {
        const width = child.getBoundingClientRect().width;
        if (width > 0) widthsRef.current[index] = width;
      });
      const styles = getComputedStyle(nav);
      gapRef.current = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    };

    measure();
    setState({ isMeasured: true, hiddenIndexes: computeHidden() });

    let cancelled = false;
    // Fonts can change intrinsic widths; re-measure once they are ready.
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      measure();
      setState({ isMeasured: true, hiddenIndexes: computeHidden() });
    });

    // Recompute (not re-measure) on resize, coalesced to one frame.
    let frame = null;
    const resizeObserver = new ResizeObserver(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setState({ isMeasured: true, hiddenIndexes: computeHidden() });
      });
    });
    resizeObserver.observe(nav);

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [navRef, lanes, computeHidden]);

  return state;
};

const DocsHeader = ({ customType = null, docPageType = null, basePath, navigation }) => {
  const lanes = useMemo(() => getDocsHeaderLanes(navigation), [navigation]);
  const navRef = useRef(null);
  const { isMeasured, hiddenIndexes } = useLaneOverflow(navRef, lanes);
  const overflowLanes = useMemo(
    () => hiddenIndexes.map((index) => lanes[index]).filter(Boolean),
    [hiddenIndexes, lanes]
  );

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center bg-white dark:bg-black-pure',
        'after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-gray-new-90 dark:after:bg-gray-new-20 lg:after:hidden'
      )}
    >
      {/* Below lg the shared mobile menu overlays its search + burger on the right. */}
      <div className="relative z-10 flex h-full w-full items-stretch gap-x-7 px-8 lg:pr-28 md:pl-5 sm:pr-24">
        {/* The 189px lockup and 28px gap align the first lane with the Figma header. */}
        <Link
          className="flex w-[189px] shrink-0 items-center gap-x-3.5 lg:w-auto lg:min-w-0 lg:shrink"
          to={customType?.link || LINKS.docs}
        >
          <LogoLightIcon
            className="shrink-0 dark:[&_path:first-child]:fill-green-52 dark:[&_path:last-child]:fill-white"
            aria-label="Neon"
          />
          <LogoDivider className="shrink-0 dark:[&_[stroke]]:stroke-gray-new-20" aria-hidden />
          <span
            className={cn(
              'mt-px min-w-0 truncate text-[15px] leading-none font-semibold tracking-normal text-[#157A55] uppercase dark:text-green-52',
              // Long section labels (PostgreSQL Tutorial) step down on phones.
              customType?.title && 'md:text-[13px] md:tracking-[0.01em]'
            )}
          >
            {customType?.title || 'Docs'}
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 lg:hidden" aria-label="Docs sections">
          <DocsNavigation
            className={cn('min-w-0 flex-1 overflow-hidden', !isMeasured && 'invisible')}
            navigation={lanes}
            basePath={basePath}
            ref={navRef}
            hiddenIndexes={hiddenIndexes}
          />
        </nav>
        <div className="flex shrink-0 items-center gap-x-2 lg:hidden">
          <InkeepTrigger docPageType={docPageType} isDocsHeader />
          <span className="mx-1 h-5 w-px bg-gray-new-85 dark:bg-gray-new-20" aria-hidden="true" />
          <Link
            className="flex h-9 items-center px-2 text-[15px] leading-none whitespace-nowrap text-gray-new-20 transition-colors duration-200 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white"
            data-test="header-login"
            to={LINKS.login}
            tagName="Header"
          >
            Log in
          </Link>
          <Link
            className="flex h-9 items-center rounded-full bg-black-new px-4 text-[15px] leading-none font-medium whitespace-nowrap text-white transition-colors duration-200 hover:bg-gray-new-20 dark:bg-white dark:text-black-new dark:hover:bg-gray-new-90"
            data-test="header-signup"
            to={LINKS.signup}
            tagName="Header"
          >
            Sign up
          </Link>
          <span className="mx-1 h-5 w-px bg-gray-new-85 dark:bg-gray-new-20" aria-hidden="true" />
          <DocsHeaderMenu overflowLanes={overflowLanes} basePath={basePath} />
        </div>
      </div>
    </div>
  );
};

DocsHeader.propTypes = {
  docPageType: PropTypes.string,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  basePath: PropTypes.string.isRequired,
  navigation: PropTypes.array.isRequired,
};

export default DocsHeader;
