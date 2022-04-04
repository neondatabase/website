/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { Link } from 'gatsby';
import React, { useState } from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const SubMenu = ({ title, items, isOpenByDefault, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  return (
    <>
      <button className="flex items-center pt-3 pb-3" type="button" onClick={handleClick}>
        <ChevronRight
          className={clsx('mr-2 transition-transform duration-500', {
            'rotate-90 transform': isOpen,
          })}
        />
        <span className="text-lg font-semibold leading-none">{title}</span>
      </button>
      <ul className={clsx('flex flex-col space-y-1 py-2 pl-4', !isOpen && 'sr-only')}>
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
              tabIndex={!isOpen ? '-1' : undefined}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const Sidebar = ({ className, sidebar, currentSlug }) => {
  const activeItemIndex = sidebar.findIndex(
    ({ items }) => items.find(({ slug }) => slug === currentSlug) !== undefined
  );

  return (
    <aside className={clsx(className, 'flex w-full flex-col pr-10')}>
      <nav>
        {sidebar.map((item, index) => (
          <SubMenu
            {...item}
            isOpenByDefault={index === activeItemIndex}
            currentSlug={currentSlug}
            key={index}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
