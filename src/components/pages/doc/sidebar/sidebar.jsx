import PropTypes from 'prop-types';
import React from 'react';

import Search from 'components/shared/search';

import Item from './item';

const Sidebar = ({ className, sidebar, currentSlug }) => {
  const activeItemIndex = sidebar.findIndex(
    ({ items }) =>
      items.find(
        ({ slug, items }) => slug === currentSlug || items?.find(({ slug }) => slug === currentSlug)
      ) !== undefined
  );

  return (
    <aside className={className}>
      <Search />
      <nav className="mt-5">
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
          slug: PropTypes.string,
          items: PropTypes.arrayOf(
            PropTypes.exact({
              title: PropTypes.string.isRequired,
              slug: PropTypes.string.isRequired,
            })
          ),
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
