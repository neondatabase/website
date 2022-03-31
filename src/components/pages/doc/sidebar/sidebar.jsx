/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { Link } from 'gatsby';
import React, { useState } from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const Sidebar = ({ className, sidebar, currentSlug }) => {
  const initialState = {};
  sidebar.forEach(({ title }) => (initialState[title] = false));
  const sectionIndex = sidebar.findIndex(
    (item) => item.items.find((child) => child.slug === currentSlug) !== undefined
  );

  initialState[sidebar[sectionIndex].title] = true;

  const [sidebarState, setSidebarState] = useState(initialState);

  const handleItemClick = (title) => {
    const newState = { ...sidebarState };
    newState[title] = !newState[title];
    setSidebarState(newState);
  };

  return (
    <div className={clsx(className, 'flex w-full flex-col pr-10')}>
      {sidebar.map(({ title, items }, index) => (
        <div key={index}>
          <div
            className="flex items-center pt-3 pb-3"
            role="button"
            tabIndex="0"
            onClick={() => handleItemClick(title)}
            onKeyDown={() => handleItemClick(title)}
          >
            <ChevronRight
              className={clsx('mr-2 transition-transform duration-500', {
                'rotate-90 transform': sidebarState[title],
              })}
            />
            <span className="text-lg font-semibold leading-none">{title}</span>
          </div>
          {sidebarState[title] && (
            <div className="flex flex-col space-y-1 py-2 pl-4">
              {items.map(({ title, slug }, index) => (
                <Link
                  className={clsx(
                    'py-2 text-base leading-none first:pt-0 last:pb-0 hover:text-primary-2',
                    {
                      'font-semibold text-primary-2': currentSlug === slug,
                    }
                  )}
                  to={`${DOCS_BASE_PATH}${slug}/`}
                  key={index}
                >
                  {title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
