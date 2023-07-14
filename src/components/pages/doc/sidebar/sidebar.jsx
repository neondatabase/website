import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import Search from 'components/shared/search';
import MENUS from 'constants/menus';

import { ChatWidgetTrigger } from '../chat-widget';

import Item from './item';

const Sidebar = ({ className = null, sidebar }) => (
  <aside
    className={clsx(
      'relative col-start-1 col-end-4 max-w-[254px] before:absolute before:-bottom-20 before:-right-5 before:-top-[110px] before:z-10 before:w-screen before:bg-gray-new-98 dark:before:bg-gray-new-10 lg:hidden',
      className
    )}
  >
    <div className="sticky top-10 z-30 h-[calc(100vh-108px)] before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-20 before:h-28 before:w-full before:bg-gradient-to-t before:from-transparent before:to-gray-new-10 after:pointer-events-none after:absolute after:bottom-0 after:z-20 after:h-28 after:w-full after:bg-gradient-to-b after:from-transparent after:to-gray-new-10">
      <Search className="z-30" indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME} />
      <nav className="no-scrollbars relative z-10 max-h-[calc(100vh-146px)] overflow-y-scroll pb-28 pt-8">
        <ChatWidgetTrigger className="mb-3.5 flex" isSidebar />
        <ul>
          {MENUS.docSidebar.map(({ icon: Icon, title, slug }, index) => (
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
        <ul className="mt-9">
          {sidebar.map((item, index) => (
            <Item {...item} key={index} />
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
};

export default Sidebar;
