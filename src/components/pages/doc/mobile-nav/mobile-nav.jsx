import clsx from 'clsx';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Container from 'components/shared/container';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const MobileNav = ({ className, sidebar, currentSlug }) => {
  const handleChange = (e) => {
    const { value, selectedOptions } = e.target;

    const slug = selectedOptions[0].dataset.standalone ? `/${value}` : `${DOCS_BASE_PATH}${value}/`;
    if (value) navigate(slug);
  };
  return (
    <nav className={clsx('safe-paddings relative border-b border-gray-7 bg-gray-9', className)}>
      <Container size="lg">
        <select
          className="relative z-10 w-full cursor-pointer appearance-none text-ellipsis bg-transparent py-[10px] outline-none"
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
                    {slug && (
                      <option value={slug} data-standalone={sidebarItem.isStandalone}>
                        {title}
                      </option>
                    )}
                    {items?.map(({ title: title2, slug: slug2 }, index) => (
                      <option value={slug2} data-standalone={sidebarItem.isStandalone} key={index}>
                        {!slug && `${title}: `}
                        {title2}
                      </option>
                    ))}
                  </Fragment>
                ))}
              </optgroup>
            ))}
        </select>
        <ChevronRight
          className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 md:right-5"
          aria-hidden
        />
      </Container>
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

MobileNav.defaultProps = {
  className: null,
};

export default MobileNav;
