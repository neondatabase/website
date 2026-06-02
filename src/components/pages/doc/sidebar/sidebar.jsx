'use client';

import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import SDKTableOfContents from 'components/shared/sdk-table-of-contents';
import { cn } from 'utils/cn';

import Menu from '../menu';

const containsActiveSlug = (menu, slug) => {
  if (menu.slug === slug) return true;

  return menu?.items?.some((item) => containsActiveSlug(item, slug));
};

const getActiveMenu = (navigation, slug) => {
  const flatMenus = navigation?.flatMap((menu) => {
    // If menu has subnav, find the matching subnav item
    if (menu.subnav) {
      if (menu.subnav.some((subnavItem) => subnavItem.section)) {
        return menu.subnav.flatMap((subnavItem) => subnavItem.items);
      }

      return menu.subnav;
    }
    // Otherwise, find the matching nav menu
    return [menu];
  });

  // First, try to find a menu where the slug is a direct match on the menu itself
  // This prioritizes dedicated sections (e.g., Neon Auth) over cross-references
  const directMatch = flatMenus?.find((item) => item.slug === slug);
  if (directMatch) return directMatch;

  // Fall back to finding a menu that contains the slug in its items
  return flatMenus?.find((item) => containsActiveSlug(item, slug));
};

const Sidebar = ({ className = null, navigation, basePath, customType, sdkNavigation }) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const menu = getActiveMenu(navigation, currentSlug);
  const navRef = useRef(null);

  // Get SDK TOC for current page from pre-loaded data
  const sdkTOC = sdkNavigation?.[currentSlug] || null;

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = 0;
    }
  }, [menu]);

  const isChangelogIndex = !!currentSlug.match('changelog')?.length;
  const routePath = `/${currentSlug.replace(/^\/+/, '')}`;
  const isGuidesRoute = /^\/guides(?:\/|$)/.test(routePath);
  const hasBorder = !isGuidesRoute;

  if (isChangelogIndex) {
    return null;
  }

  const renderContent = sdkTOC ? (
    <SDKTableOfContents
      title={sdkTOC.title}
      url={`${basePath}${currentSlug}`}
      sections={sdkTOC.sections}
    />
  ) : menu ? (
    <Menu basePath={basePath} {...menu} customType={customType} />
  ) : null;

  return (
    <aside className={cn('relative -mt-12', isGuidesRoute && 'xl:hidden', className)}>
      <div className="sticky top-28">
        <div
          className={cn(
            'relative',
            'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-10',
            'after:bg-linear-to-b after:from-white after:to-transparent dark:after:from-black-pure dark:after:to-transparent'
          )}
        >
          <nav
            className={cn(
              'z-10 -mx-1 no-scrollbars h-[calc(100vh-7rem)] overflow-y-scroll pt-11 pr-8 pb-16 pl-1',
              hasBorder && 'border-r border-gray-new-90 dark:border-gray-new-20'
            )}
            ref={navRef}
          >
            {renderContent}
          </nav>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  navigation: PropTypes.array.isRequired,
  basePath: PropTypes.string.isRequired,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  sdkNavigation: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string,
      sections: PropTypes.array,
    })
  ),
};

export default Sidebar;
