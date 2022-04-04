/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { navigate } from 'gatsby';
import React from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const MobileNav = ({ className, sidebar, currentSlug }) => {
  const handleChange = ({ target: { value } }) => {
    if (value) navigate(`${DOCS_BASE_PATH}${value}`);
  };

  return (
    <nav className={clsx('relative', className)}>
      <select
        className="w-full appearance-none border-2 border-black bg-white px-5 py-3"
        value={currentSlug}
        onChange={handleChange}
      >
        <option value={false} disabled>
          Choose section
        </option>
        {sidebar &&
          sidebar.map(({ title, items }, index) => (
            <optgroup label={title} key={index}>
              {items.map(({ title, slug }, index) => (
                <option label={title} value={slug} key={index}>
                  {title}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90" aria-hidden />
    </nav>
  );
};

export default MobileNav;
