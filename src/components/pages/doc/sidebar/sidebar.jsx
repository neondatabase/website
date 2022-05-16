import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const Item = ({ title, items, isOpenByDefault, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  return (
    <li>
      <button className="flex items-center py-2.5" type="button" onClick={handleClick}>
        <ChevronRight className={clsx('mr-2', { 'rotate-90 transform': isOpen })} />
        <span className="text-lg font-semibold leading-snug">{title}</span>
      </button>
      <ul className={clsx('pl-4', !isOpen && 'sr-only')}>
        {items.map(({ title, slug }, index) => (
          <li key={index}>
            <Link
              className={clsx('!block py-2.5 !leading-snug', {
                'font-semibold text-primary-2': currentSlug === slug,
              })}
              to={`${DOCS_BASE_PATH}${slug}/`}
              size="sm"
              theme="black"
              tabIndex={!isOpen ? '-1' : undefined}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  isOpenByDefault: PropTypes.bool,
  currentSlug: PropTypes.string.isRequired,
};

Item.defaultProps = {
  isOpenByDefault: false,
};

const Sidebar = ({ className, sidebar, currentSlug }) => {
  const activeItemIndex = sidebar.findIndex(
    ({ items }) => items.find(({ slug }) => slug === currentSlug) !== undefined
  );

  return (
    <aside className={className}>
      <nav>
        <ul className="space-y-2">
          {sidebar.map((item, index) => (
            <Item
              {...item}
              isOpenByDefault={index === activeItemIndex}
              currentSlug={currentSlug}
              key={index}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.exact({
          title: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

Sidebar.defaultProps = {
  className: null,
};

export default Sidebar;
