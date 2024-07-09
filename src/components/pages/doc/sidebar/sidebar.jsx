import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';

import Item from './item';

const Sidebar = ({ className = null, sidebar, basePath }) => (
  <aside
    className={clsx(
      'relative left-0 z-50 border-r border-gray-new-94 bg-white dark:border-gray-new-10 dark:bg-black-pure',
      className
    )}
  >
    <div className="sticky top-0 px-14 pt-[18px] xl:px-8">
      <Link to="/">
        <span className="sr-only">Neon</span>
        <Logo className="h-7" width={102} height={28} priority />
      </Link>
      <nav className="no-scrollbars relative z-10 mt-16 h-full overflow-y-scroll pb-36">
        <ul>
          {sidebar.map((section, index) => (
            <li
              className="border-b border-gray-new-94 py-4 first:pt-0 last:border-0 last:pb-0 dark:border-gray-new-10"
              key={index}
            >
              {section.title && (
                <span className="mb-3 block text-[10px] font-medium uppercase leading-tight text-gray-new-50">
                  {section.title}
                </span>
              )}
              {section.items && (
                <ul className="flex flex-col gap-3">
                  {section.items.map((item, index) => (
                    <Item {...item} key={index} basePath={basePath} />
                  ))}
                </ul>
              )}
            </li>
          ))}
          <div className="border-t border-gray-new-94 pt-4 dark:border-gray-new-10">
            <Link
              className={clsx(
                'flex w-full items-start gap-2 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
                'text-gray-new-60 hover:text-black-new dark:hover:text-white'
              )}
              to="/"
            >
              <ArrowBackIcon className="size-4.5" />
              Back to site
            </Link>
          </div>
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
};

export default Sidebar;
