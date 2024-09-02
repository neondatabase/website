import clsx from 'clsx';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import MENUS from 'constants/menus';

import Item from './item';

const Search = dynamic(() => import('components/shared/search/search'));

const NavWithIcon = ({ className, items }) => (
  <ul className={className}>
    {items.map(({ icon: Icon, title, slug }, index) => (
      <li className="py-[7px] first:pt-0 last:pb-0" key={index}>
        <Link className="group flex items-center space-x-3" to={slug}>
          <span className="relative flex h-6 w-6 items-center justify-center rounded bg-[linear-gradient(180deg,#EFEFF0_100%,#E4E5E7_100%)] before:absolute before:inset-px before:rounded-[3px] before:bg-[linear-gradient(180deg,#FFF_100%,#FAFAFA_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_31.25%,rgba(255,255,255,0.05)_100%)] dark:before:bg-[linear-gradient(180deg,#242628_31.25%,#1D1E20_100%)]">
            <Icon className="relative z-10 h-3 w-3 text-gray-new-30 dark:text-gray-new-80" />
          </span>
          <span className="text-sm font-medium leading-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45">
            {title}
          </span>
        </Link>
      </li>
    ))}
  </ul>
);

NavWithIcon.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      icon: PropTypes.elementType.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const Sidebar = ({ className = null, sidebar, basePath, indexName, isPostgres = false }) => (
  <aside
    className={clsx(
      'relative col-start-1 col-end-4 max-w-[254px] pt-0.5 before:absolute before:-bottom-20 before:-right-5 before:-top-[104px] before:z-10 before:w-screen before:bg-gray-new-98 dark:before:bg-black-new lg:hidden',
      className
    )}
  >
    <div className="sticky top-[104px] z-30 max-h-[calc(100vh-108px)] after:pointer-events-none after:absolute after:-bottom-16 after:z-20 after:h-28 after:w-full after:bg-gradient-to-b after:from-transparent after:to-gray-new-98 dark:before:to-black-new dark:after:to-black-new">
      <Search className="z-30" indexName={indexName} />
      <nav className="no-scrollbars relative z-10 max-h-[calc(100vh-146px)] overflow-y-scroll pb-36 pt-9">
        {isPostgres ? (
          <NavWithIcon className="mb-8" items={MENUS.postgresSidebar} />
        ) : (
          <NavWithIcon className="mb-11" items={MENUS.docSidebar} />
        )}
        <ul className={clsx({ 'mt-14': !isPostgres })}>
          {sidebar.map((item, index) => (
            <Item {...item} key={index} basePath={basePath} isChildren={false} />
          ))}
        </ul>
      </nav>
    </div>
  </aside>
);

export const sidebarPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    ariaLabel: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.exact({
        title: PropTypes.string.isRequired,
        slug: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.any),
        ariaLabel: PropTypes.string,
      })
    ),
  })
).isRequired;

Sidebar.propTypes = {
  className: PropTypes.string,
  sidebar: sidebarPropTypes,
  basePath: PropTypes.string.isRequired,
  indexName: PropTypes.string.isRequired,
  isPostgres: PropTypes.bool,
};

export default Sidebar;
