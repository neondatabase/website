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

// Design-fixed control widths: the search field is w-60 (240px) and both the
// search and Ask AI collapse to a w-9 (36px) icon.
const SEARCH_WIDTH_FULL = 240;
const CONTROL_WIDTH_ICON = 36;
const SEARCH_COLLAPSE_SAVING = SEARCH_WIDTH_FULL - CONTROL_WIDTH_ICON; // exact
// The Ask AI label width is content-driven; this estimate only shifts the exact
// width at which that button collapses, never the monotonic ordering below.
const ASK_COLLAPSE_SAVING = 52;

// One monotonic degradation chain driven by a SINGLE stable measurement: the
// header row's content width. That width depends only on the viewport, never on
// whether the search box, Ask AI, or any lane has collapsed, so there is no
// feedback loop. Every decision below is a step function of that one shrinking
// input, which makes degradation strictly monotonic: the search field collapses
// first, then Ask AI, then lanes move into the "More" menu lowest priority
// first. Nothing ever pops back inline or oscillates at a boundary.
//
// The lane space at each stage is reconstructed from an invariant base (the
// lane space when the whole right cluster is collapsed) plus the known savings,
// so the lane calculation always reflects the right cluster's FINAL collapsed
// width while it is deciding overflow.
const useResponsiveDocsHeader = (rowRef, navRef, lanes) => {
  const metricsRef = useRef({ laneWidths: [], lanesTotal: 0, laneGap: 0, baseCollapsed: 0 });
  const appliedRef = useRef({ searchCollapsed: false, askCollapsed: false });
  // Before the first (synchronous, pre-paint) measurement, render the right
  // cluster in its COLLAPSED state. Collapsed is the safe default because it
  // never overflows, so the search field and Ask AI can only ever grow once we
  // know they fit, never flash their wider expanded state and snap narrower.
  // The nav lanes stay gated invisible-until-measured separately.
  const [state, setState] = useState({
    isMeasured: false,
    searchCollapsed: true,
    askCollapsed: true,
    hiddenIndexes: [],
  });

  // Mirror the applied collapse state for the (rare) re-measure path so the
  // invariant base stays consistent regardless of the live layout.
  appliedRef.current = {
    searchCollapsed: state.searchCollapsed,
    askCollapsed: state.askCollapsed,
  };

  const getRowContent = useCallback(() => {
    const row = rowRef.current;
    if (!row) return 0;
    const styles = getComputedStyle(row);
    return (
      row.clientWidth -
      parseFloat(styles.paddingLeft || '0') -
      parseFloat(styles.paddingRight || '0')
    );
  }, [rowRef]);

  const compute = useCallback(() => {
    const { laneWidths, lanesTotal, laneGap, baseCollapsed } = metricsRef.current;
    if (laneWidths.length === 0) {
      return { searchCollapsed: false, askCollapsed: false, hiddenIndexes: [] };
    }
    const rowContent = getRowContent();

    // Lane space available at each collapse stage. The "More" trigger sits in
    // the measured right cluster, so it is already excluded from these figures
    // (no separate reserve is needed and overflow settles in one pass).
    const spaceBothCollapsed = rowContent + baseCollapsed;
    const spaceSearchCollapsed = spaceBothCollapsed - ASK_COLLAPSE_SAVING;
    const spaceNoneCollapsed = spaceSearchCollapsed - SEARCH_COLLAPSE_SAVING;

    if (lanesTotal <= spaceNoneCollapsed + 0.5) {
      return { searchCollapsed: false, askCollapsed: false, hiddenIndexes: [] };
    }
    if (lanesTotal <= spaceSearchCollapsed + 0.5) {
      return { searchCollapsed: true, askCollapsed: false, hiddenIndexes: [] };
    }
    if (lanesTotal <= spaceBothCollapsed + 0.5) {
      return { searchCollapsed: true, askCollapsed: true, hiddenIndexes: [] };
    }

    // Overflow regime: both controls are icons; drop lowest priority first,
    // breaking ties by dropping the right-most lane.
    const widthOf = (indexes) =>
      indexes.length === 0
        ? 0
        : indexes.reduce((sum, i) => sum + laneWidths[i], 0) + laneGap * (indexes.length - 1);
    const visible = laneWidths.map((_, i) => i);
    const dropOrder = [...visible].sort((a, b) => {
      const rankDelta = laneRank(lanes[b]) - laneRank(lanes[a]);
      return rankDelta !== 0 ? rankDelta : b - a;
    });
    const hidden = new Set();
    for (const i of dropOrder) {
      hidden.add(i);
      if (widthOf(visible.filter((x) => !hidden.has(x))) <= spaceBothCollapsed + 0.5) break;
    }
    return {
      searchCollapsed: true,
      askCollapsed: true,
      hiddenIndexes: visible.filter((i) => hidden.has(i)),
    };
  }, [getRowContent, lanes]);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const nav = navRef.current;
    if (!row || !nav) return undefined;

    // Cache each lane's intrinsic width (hidden lanes report 0, so keep their
    // last known width) and the invariant collapsed-cluster lane space. The
    // base adds back the savings for whatever is currently expanded, so it is
    // the same value no matter which controls happen to be collapsed when it
    // runs.
    const measure = () => {
      const children = Array.from(nav.children);
      const widths = metricsRef.current.laneWidths;
      widths.length = children.length;
      children.forEach((child, i) => {
        const width = child.getBoundingClientRect().width;
        if (width > 0) widths[i] = width;
      });
      const styles = getComputedStyle(nav);
      const laneGap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      metricsRef.current.laneGap = laneGap;
      metricsRef.current.lanesTotal =
        widths.reduce((sum, width) => sum + (width || 0), 0) +
        laneGap * Math.max(0, widths.length - 1);

      const savingNow =
        (appliedRef.current.searchCollapsed ? 0 : SEARCH_COLLAPSE_SAVING) +
        (appliedRef.current.askCollapsed ? 0 : ASK_COLLAPSE_SAVING);
      metricsRef.current.baseCollapsed = nav.clientWidth + savingNow - getRowContent();
    };

    measure();
    setState({ isMeasured: true, ...compute() });

    let cancelled = false;
    // Fonts can change intrinsic widths; re-measure once they are ready.
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      measure();
      setState({ isMeasured: true, ...compute() });
    });

    // Recompute (not re-measure) on resize of the STABLE row, coalesced to one
    // animation frame. Observing the row, not the nav, keeps the input free of
    // feedback from the collapses it drives.
    let frame = null;
    const resizeObserver = new ResizeObserver(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setState({ isMeasured: true, ...compute() }));
    });
    resizeObserver.observe(row);

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [rowRef, navRef, lanes, compute, getRowContent]);

  return state;
};

const DocsHeader = ({ customType = null, docPageType = null, basePath, navigation }) => {
  const lanes = useMemo(() => getDocsHeaderLanes(navigation), [navigation]);
  const rowRef = useRef(null);
  const navRef = useRef(null);
  const { isMeasured, searchCollapsed, askCollapsed, hiddenIndexes } = useResponsiveDocsHeader(
    rowRef,
    navRef,
    lanes
  );
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
      <div
        className="relative z-10 flex h-full w-full items-stretch gap-x-7 px-8 lg:pr-28 md:pl-5 sm:pr-24"
        ref={rowRef}
      >
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
          <InkeepTrigger
            docPageType={docPageType}
            isDocsHeader
            isSearchCollapsed={searchCollapsed}
            isAiCollapsed={askCollapsed}
          />
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
