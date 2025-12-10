'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import SDKTableOfContents from 'components/shared/sdk-table-of-contents';

import Menu from '../menu';

const containsActiveSlug = (menu, slug) => {
  if (menu.slug === slug) return true;

  return menu?.items?.some((item) => containsActiveSlug(item, slug));
};

const getActiveMenu = (navigation, slug) =>
  navigation
    ?.flatMap((menu) => {
      // If menu has subnav, find the matching subnav item
      if (menu.subnav) {
        if (menu.subnav.some((subnavItem) => subnavItem.section)) {
          return menu.subnav.flatMap((subnavItem) => subnavItem.items);
        }

        return menu.subnav;
      }
      // Otherwise, find the matching nav menu
      return [menu];
    })
    .find((item) => containsActiveSlug(item, slug));

const Sidebar = ({ className = null, navigation, basePath, customType }) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const menu = getActiveMenu(navigation, currentSlug);
  const navRef = useRef(null);
  const [sdkTOC, setSDKTOC] = useState(null);

  // Pages that use custom SDK table of contents with sectioned navigation
  const SDK_REFERENCE_PAGES = [
    'reference/javascript-sdk',
    // Add future SDK reference pages here (e.g., 'reference/python-sdk')
  ];
  const isSDKPage = SDK_REFERENCE_PAGES.includes(currentSlug);

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = 0;
    }
  }, [menu]);

  // Load SDK navigation JSON for SDK pages
  useEffect(() => {
    if (isSDKPage) {
      // Extract SDK name from slug (e.g., 'reference/javascript-sdk' -> 'javascript-sdk')
      const sdkName = currentSlug.split('/').pop();

      fetch(`/docs/reference/${sdkName}-nav.json`)
        .then((res) => res.json())
        .then((sdkNav) => {
          // Pass sections directly from YAML structure
          setSDKTOC({
            title: sdkNav.title || 'SDK Reference',
            sections: sdkNav.sections || [],
          });
        })
        .catch((err) => console.error('Failed to load SDK nav:', err));
    }
  }, [isSDKPage, currentSlug]);

  // Render SDK TOC for SDK reference page
  if (isSDKPage && sdkTOC) {
    return (
      <aside className={clsx('relative -mt-10', className)}>
        <div className="sticky top-28">
          <div
            className={clsx(
              'relative',
              'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-10',
              'after:bg-gradient-to-b after:from-white after:to-transparent after:dark:from-black-pure after:dark:to-transparent'
            )}
          >
            <nav className="no-scrollbars z-10 h-[calc(100vh-7rem)] overflow-y-scroll pb-16 pt-11">
              <SDKTableOfContents sections={sdkTOC.sections} title={sdkTOC.title} />
            </nav>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={clsx('relative -mt-10', className)}>
      <div className="sticky top-28">
        <div
          className={clsx(
            'relative',
            'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-10',
            'after:bg-gradient-to-b after:from-white after:to-transparent after:dark:from-black-pure after:dark:to-transparent'
          )}
        >
          <nav
            className="no-scrollbars z-10 h-[calc(100vh-7rem)] overflow-y-scroll pb-16 pt-11"
            ref={navRef}
          >
            <Menu basePath={basePath} {...menu} customType={customType} />
          </nav>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  navigation: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default Sidebar;
