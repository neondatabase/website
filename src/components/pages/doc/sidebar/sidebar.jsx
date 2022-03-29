/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { Link } from 'gatsby';
import React, { useState } from 'react';

import ChevronRight from 'icons/chevron-right.inline.svg';

const Sidebar = ({ className, sidebar, currentSlug }) => {
  const initialState = {};
  sidebar.forEach(({ title }) => (initialState[title] = false));
  const sectionIndex = sidebar.findIndex(
    (item) => item.children.find((child) => child.slug === currentSlug) !== undefined
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
      {sidebar.map(({ title, sidebarLabel, children }, index) => (
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
            <span className="text-lg font-semibold leading-none">{sidebarLabel}</span>
          </div>
          {sidebarState[title] && (
            <div className="flex flex-col space-y-1 py-2 pl-4">
              {children.map((child, childIndex) => (
                <Link
                  key={`${index}-${childIndex}`}
                  to={`/docs/${child.slug}`}
                  className={clsx(
                    'py-2 text-base leading-none first:pt-0 last:pb-0 hover:text-primary-2',
                    {
                      'font-semibold text-primary-2': currentSlug === child.slug,
                    }
                  )}
                >
                  {child.sidebarLabel}
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
