'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';

import Menu from '../menu';

const getActiveMenu = (navigation, slug) => {
  const containsActiveSlug = (menuList) =>
    menuList?.some((menu) => menu.slug === slug || (menu.items && containsActiveSlug(menu.items)));

  const subnavMenu = navigation?.find((menu) => {
    if (menu.subnav) {
      return menu.subnav.some(
        (item) => item.slug === slug || (item.items && containsActiveSlug(item.items))
      );
    }
    return false;
  });

  if (subnavMenu && subnavMenu.subnav) {
    const activeItem = subnavMenu.subnav.find(
      (item) => item.slug === slug || (item.items && containsActiveSlug(item.items))
    );

    if (activeItem) {
      return activeItem.slug === slug
        ? activeItem
        : activeItem.items?.find(
            (item) => item.slug === slug || (item.items && containsActiveSlug(item.items))
          );
    }
  }

  return navigation?.find((menu) => menu.slug === slug || containsActiveSlug(menu.items));
};

const Sidebar = ({ className = null, navigation, basePath, customType }) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const menu = getActiveMenu(navigation, currentSlug);

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
