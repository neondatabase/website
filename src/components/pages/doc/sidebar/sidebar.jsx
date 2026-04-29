'use client';

import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import SDKTableOfContents from 'components/shared/sdk-table-of-contents';
import { cn } from 'utils/cn';
import {
  getDocsVersionFromPathname,
  getVersionedDocsBasePath,
  resolveLatestDocsVersionId,
  stripDocsVersionFromPathname,
} from 'utils/docs-versioning';

import Menu from '../menu';
import VersionSwitcher from '../version-switcher';

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

const Sidebar = ({
  className = null,
  navigation,
  navigationByVersion = null,
  basePath,
  customType,
  sdkNavigation,
  dualVersionSlugs = [],
  showVersionSwitcher = false,
}) => {
  const pathname = usePathname();
  const normalizedPathname = stripDocsVersionFromPathname(pathname);
  const currentSlug = normalizedPathname.replace(basePath, '');
  const pathnameVersion = getDocsVersionFromPathname(pathname);
  const supportsVersioningForSlug = dualVersionSlugs.includes(currentSlug);
  const effectiveVersionId = pathnameVersion || resolveLatestDocsVersionId();
  const activeNavigation = navigationByVersion?.[effectiveVersionId] || navigation;
  const docsBasePath = pathnameVersion ? getVersionedDocsBasePath(pathnameVersion) : basePath;
  const menu = getActiveMenu(activeNavigation, currentSlug);
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

  let renderContent = null;
  if (sdkTOC) {
    renderContent = (
      <SDKTableOfContents
        title={sdkTOC.title}
        url={`${docsBasePath}${currentSlug}`}
        sections={sdkTOC.sections}
      />
    );
  } else if (menu) {
    renderContent = <Menu basePath={docsBasePath} {...menu} customType={customType} />;
  }

  return (
    <aside className={cn('relative -mt-12', isGuidesRoute && 'xl:hidden', className)}>
      <div className="sticky top-28">
        <nav
          className={cn(
            'z-10 -mx-1 no-scrollbars h-[calc(100vh-7rem)] overflow-y-scroll pt-11 pr-8 pb-16 pl-2.5',
            hasBorder && 'border-r border-gray-new-90 dark:border-gray-new-20'
          )}
          ref={navRef}
        >
          {showVersionSwitcher && (
            <>
              <VersionSwitcher className="mb-3.5" supportsVersioning={supportsVersioningForSlug} />
              <div className="mb-6 h-px w-full bg-gray-new-90 dark:bg-gray-new-20" />
            </>
          )}
          {renderContent}
        </nav>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  navigation: PropTypes.array.isRequired,
  navigationByVersion: PropTypes.objectOf(PropTypes.array),
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
  dualVersionSlugs: PropTypes.arrayOf(PropTypes.string),
  showVersionSwitcher: PropTypes.bool,
};

export default Sidebar;
