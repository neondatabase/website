/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { Link } from 'gatsby';
import React, { Fragment, useState } from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const Sidebar = ({ className, sidebar, currentSlug }) => {
  const initialState = {};
  sidebar.forEach(({ title }) => (initialState[title] = false));
  const sectionIndex = sidebar.findIndex(
    ({ items }) => items.find(({ slug }) => slug === currentSlug) !== undefined
  );

  initialState[sidebar[sectionIndex].title] = true;

  const [sidebarState, setSidebarState] = useState(initialState);

  const handleItemClick = (title) => {
    const newState = { ...sidebarState };
    newState[title] = !newState[title];
    setSidebarState(newState);
  };

  return (
    <aside className={clsx(className, 'flex w-full flex-col pr-10')}>
      <nav>
        {sidebar.map(({ title, items }, index) => (
          <Fragment key={index}>
            <button
              className="flex items-center pt-3 pb-3"
              type="button"
              onClick={() => handleItemClick(title)}
            >
              <ChevronRight
                className={clsx('mr-2 transition-transform duration-500', {
                  'rotate-90 transform': sidebarState[title],
                })}
              />
              <span className="text-lg font-semibold leading-none">{title}</span>
            </button>
            <ul
              className={clsx(
                'flex flex-col space-y-1 py-2 pl-4',
                !sidebarState[title] && 'sr-only'
              )}
            >
              {items.map(({ title, slug }, index) => (
                <li key={index}>
                  <Link
                    className={clsx(
                      'py-2 text-base leading-none first:pt-0 last:pb-0 hover:text-primary-2',
                      {
                        'font-semibold text-primary-2': currentSlug === slug,
                      }
                    )}
                    to={`${DOCS_BASE_PATH}${slug}/`}
                    tabIndex={!sidebarState[title] ? '-1' : undefined}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
