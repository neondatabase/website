'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

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

// NOTE: getActiveMenuList builds activeMenuList
export const getActiveMenuList = (items, currentSlug, result = [], parents = []) => {
  const activeItem = items.find((item) => item.slug === currentSlug);
  if (activeItem) {
    // NOTE: save items expect sections or collapsible items
    result.push(...parents.filter((parent) => !parent.section && !parent.collapsible));
    if (activeItem.items && !activeItem.section && !activeItem.collapsible) {
      result.push(activeItem);
    }
    return result;
  }

  return items.reduce((acc, item) => {
    if (acc.length) return acc;
    if (item.items) {
      return getActiveMenuList(item.items, currentSlug, result, [...parents, item]);
    }
    return acc;
  }, result);
};

const Sidebar = ({
  className = null,
  navigation,
  slug,
  basePath,
  customType,
  docPageType = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  // NOTE: build initial activeMenuList on page load
  // getActiveMenuList returns active menu items tree for active submenus
  const [activeMenuList, setActiveMenuList] = useState([
    HOME_MENU_ITEM,
    ...getActiveMenuList(navigation, currentSlug),
  ]);

  // NOTE: useEffect for updating activeMenuList on slug change with broswer back/forth button
  // supports duplicates section in sidebar,
  // if we surf through menu with clicks on items, it will not update activeMenuList
  // we check it with checkSlugInActiveMenu function
  useEffect(() => {
    if (!checkSlugInActiveMenu(currentSlug, activeMenuList, navigation)) {
      setActiveMenuList([HOME_MENU_ITEM, ...getActiveMenuList(navigation, currentSlug)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  const [menuHeight, setMenuHeight] = useState(2000);
  const menuWrapperRef = useRef(null);

  return (
    <aside className={clsx('relative -mt-10', className)}>
      <div className="sticky top-28">
        {docPageType}
        <div
          className={clsx(
            'relative',
            'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-10',
            'after:bg-gradient-to-b after:from-white after:to-transparent after:dark:from-black-pure after:dark:to-transparent'
          )}
        >
          <nav
            className="no-scrollbars z-10 h-[calc(100vh-7rem)] overflow-y-scroll pb-5 pt-11"
            ref={menuWrapperRef}
          >
            <div className="relative w-full overflow-hidden" style={{ height: menuHeight }}>
              <Menu
                depth={0}
                basePath={basePath}
                slug={slug}
                items={navigation}
                setMenuHeight={setMenuHeight}
                menuWrapperRef={menuWrapperRef}
                activeMenuList={activeMenuList}
                setActiveMenuList={setActiveMenuList}
                customType={customType}
              />
            </div>
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
  docPageType: PropTypes.string,
};

export default Sidebar;
