'use client';

import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import { cn } from 'utils/cn';
import { getDocsHeaderLanes } from 'utils/get-docs-nav-href';

import DocsNavigation from '../docs-navigation';

import DocsHeaderMenu from './docs-header-menu';
import LogoDivider from './images/logo-divider.inline.svg';
import LogoLightIcon from './images/neon-logo.inline.svg';

// Lanes collapse into the overflow menu whenever they don't fit between the
// lockup and the right cluster (the spec's "< 1000px" case, and long lane sets
// such as /postgresql at narrow desktop widths). The list stays mounted but
// invisible while collapsed so it can be re-measured as the bar widens.
const useIsNavCollapsed = (navRef, lanes) => {
  const [state, setState] = useState({ isMeasured: false, isCollapsed: false });

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    // Compare the last lane's edge, not scrollWidth: the lanes' hidden dropdown
    // panels overflow the list and would count as width.
    const update = () => {
      const lastLane = nav.lastElementChild;
      const isCollapsed =
        !!lastLane &&
        lastLane.getBoundingClientRect().right > nav.getBoundingClientRect().right + 1;

      setState({ isMeasured: true, isCollapsed });
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(nav);
    document.fonts?.ready.then(update);

    return () => resizeObserver.disconnect();
  }, [navRef, lanes]);

  return state;
};

const DocsHeader = ({ customType = null, docPageType = null, basePath, navigation }) => {
  const lanes = useMemo(() => getDocsHeaderLanes(navigation), [navigation]);
  const navRef = useRef(null);
  const { isMeasured, isCollapsed } = useIsNavCollapsed(navRef, lanes);

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
            className={cn(
              'min-w-0 flex-1',
              (!isMeasured || isCollapsed) && 'overflow-hidden',
              isCollapsed && 'invisible'
            )}
            navigation={lanes}
            basePath={basePath}
            ref={navRef}
            aria-hidden={isCollapsed || undefined}
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
          <DocsHeaderMenu lanes={lanes} basePath={basePath} isNavCollapsed={isCollapsed} />
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
