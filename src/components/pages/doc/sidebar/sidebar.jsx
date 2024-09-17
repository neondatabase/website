'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import { HOME_MENU_ITEM } from 'constants/docs';

import Menu from '../menu';

// NOTE: checkSlugInActiveMenu checks if we have current page in last activeMenu item
const checkSlugInActiveMenu = (currentSlug, activeMenuList, items) => {
  const activeMenu = activeMenuList[activeMenuList.length - 1];
  const isSlugActiveMenu = activeMenu.slug === currentSlug;

  // NOTE: check if current page is in active menu
  const isSlugInActiveMenu = (items) =>
    items.some(
      (item) =>
        (item.title === activeMenu.title &&
          item.items?.some((subItem) => subItem.slug === currentSlug)) ||
        (item.items && isSlugInActiveMenu(item.items))
    );

  return isSlugActiveMenu || isSlugInActiveMenu(items);
};

// NOTE: getActiveItems builds activeMenuList
// supports duplicates section in sidebar,
// but only the first one will be active
export const getActiveItems = (items, currentSlug, result = [], parents = []) => {
  const activeItem = items.find((item) => item.slug === currentSlug);
  if (activeItem) {
    if (activeItem.items && !activeItem.section) {
      result.push(activeItem);
    }
    result.push(...parents.filter((parent) => !parent.section));
    return result;
  }

  return items.reduce((acc, item) => {
    if (acc.length) return acc;
    if (item.items) {
      return getActiveItems(item.items, currentSlug, result, [...parents, item]);
    }
    return acc;
  }, result);
};

const Sidebar = ({ className = null, sidebar, slug, basePath }) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  // NOTE: build initial activeMenuList on page load
  // getActiveItems returns active menu items tree for active submenus
  const [activeMenuList, setActiveMenuList] = useState([
    HOME_MENU_ITEM,
    ...getActiveItems(sidebar, currentSlug),
  ]);

  // NOTE: useEffect for updating activeMenuList on slug change with broswer back/forth button
  // supports duplicates section in sidebar,
  // if we surf through menu with clicks on items, it will not update activeMenuList
  // we check it with checkSlugInActiveMenu function
  useEffect(() => {
    if (!checkSlugInActiveMenu(currentSlug, activeMenuList, sidebar)) {
      setActiveMenuList([HOME_MENU_ITEM, ...getActiveItems(sidebar, currentSlug)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  const [menuHeight, setMenuHeight] = useState(1000);
  const menuWrapperRef = useRef(null);

  return (
    <aside
      className={clsx(
        'relative left-0 z-40 border-r border-gray-new-94 bg-white dark:border-gray-new-10 dark:bg-black-pure',
        className
      )}
    >
      <div
        className={clsx(
          'sticky top-0 px-[52px] pt-[18px] xl:px-8',
          'after:pointer-events-none after:absolute after:inset-x-0 after:top-14 after:h-10 after:bg-gradient-to-b after:from-white after:to-transparent after:dark:from-black-pure after:dark:to-transparent'
        )}
      >
        <Link to="/">
          <span className="sr-only">Neon</span>
          <Logo className="h-7" width={102} height={28} priority />
        </Link>
        <nav
          className="no-scrollbars z-10 mt-5 h-[calc(100vh-70px)] overflow-x-hidden overflow-y-scroll pt-[46px]"
          ref={menuWrapperRef}
        >
          <div className="relative w-full overflow-hidden" style={{ height: menuHeight }}>
            <Menu
              depth={0}
              title="Home"
              basePath={basePath}
              slug={slug}
              items={sidebar}
              setMenuHeight={setMenuHeight}
              menuWrapperRef={menuWrapperRef}
              activeMenuList={activeMenuList}
              setActiveMenuList={setActiveMenuList}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(PropTypes.shape()),
  slug: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
};

export default Sidebar;
