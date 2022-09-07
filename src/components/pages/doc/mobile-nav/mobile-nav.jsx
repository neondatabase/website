import clsx from 'clsx';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const MobileNav = ({ className, sidebar, currentSlug }) => {
  const handleChange = (e) => {
    const { value, selectedOptions } = e.target;

    const slug = selectedOptions[0].dataset.standalone ? `/${value}` : `${DOCS_BASE_PATH}${value}/`;
    if (value) navigate(slug);
  };
  return (
    <nav className={clsx('relative', className)}>
      <select
        className="w-full appearance-none text-ellipsis border-2 border-black bg-white py-3 pl-5 pr-8 outline-none"
        value={currentSlug}
        onChange={handleChange}
      >
        {sidebar &&
          sidebar.map((sidebarItem, index) => (
            <optgroup label={sidebarItem.title} key={index}>
              {sidebarItem.slug && (
                <option value={sidebarItem.slug} data-standalone={sidebarItem.isStandalone}>
                  {sidebarItem.title}
                </option>
              )}
              {sidebarItem?.items?.map(({ title, slug, items }, index) => (
                <Fragment key={index}>
                  {items?.length > 0 ? (
                    items.map(({ title: title2, slug }, index) => (
                      <option value={slug} key={index}>
                        {title}: {title2}
                      </option>
                    ))
                  ) : (
                    <option value={slug}>{title}</option>
                  )}
                </Fragment>
              ))}
            </optgroup>
          ))}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90" aria-hidden />
    </nav>
  );
};

MobileNav.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      isStandalone: PropTypes.bool,
      slug: PropTypes.string,
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
      ),
    })
  ).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

MobileNav.defaultProps = {
  className: null,
};

export default MobileNav;
