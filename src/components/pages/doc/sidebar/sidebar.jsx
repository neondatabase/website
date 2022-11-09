import PropTypes from 'prop-types';
import React from 'react';

import Search from 'components/shared/search';

import Item from './item';

const Sidebar = ({ className, sidebar, currentSlug }) => (
  <aside className={className}>
    <Search />
    <nav className="mt-5">
      <ul>
        {sidebar.map((item, index) => (
          <Item {...item} currentSlug={currentSlug} key={index} />
        ))}
      </ul>
    </nav>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.exact({
          title: PropTypes.string.isRequired,
          slug: PropTypes.string,
          items: PropTypes.arrayOf(
            PropTypes.exact({
              title: PropTypes.string.isRequired,
              slug: PropTypes.string,
              items: PropTypes.arrayOf(
                PropTypes.exact({
                  title: PropTypes.string,
                  slug: PropTypes.string,
                })
              ),
            })
          ),
        })
      ),
    })
  ).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

Sidebar.defaultProps = {
  className: null,
};

export default Sidebar;
