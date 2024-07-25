'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';

import Link from 'components/shared/link';
import Logo from 'components/shared/logo';

import Menu from '../menu';

const hasActiveItem = (items, currentSlug) =>
  items?.some(
    ({ slug, items }) => slug === currentSlug || (items && hasActiveItem(items, currentSlug))
  );

const parseItems = (items, currentSlug) =>
  items.reduce((titles, { title, items }) => {
    if (items) {
      titles.push(...parseItems(items, currentSlug));
      if (title && hasActiveItem(items, currentSlug)) {
        titles.push(title);
      }
    }
    return titles;
  }, []);

const Sidebar = ({ className = null, sidebar, slug, basePath }) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const initialMenuList = new Set(['Home', ...parseItems(sidebar, currentSlug)]);

  const [activeMenuList, setActiveMenuList] = useState(initialMenuList);
  const [menuHeight, setMenuHeight] = useState(1000);
  const menuWrapperRef = useRef(null);

  return (
    <aside
      className={clsx(
        'relative left-0 z-40 border-r border-gray-new-94 bg-white dark:border-gray-new-10 dark:bg-black-pure',
        className
      )}
    >
      <div className="sticky top-0 px-[52px] pt-[18px] xl:px-8">
        <Link to="/">
          <span className="sr-only">Neon</span>
          <Logo className="h-7" width={102} height={28} priority />
        </Link>
        <nav
          className="no-scrollbars z-10 mt-16 h-[calc(100vh-120px)] overflow-x-hidden overflow-y-scroll"
          ref={menuWrapperRef}
        >
          <div
            className="relative w-full overflow-hidden transition-[height] duration-300"
            style={{ height: menuHeight }}
          >
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
