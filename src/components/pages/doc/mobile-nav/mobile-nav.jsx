/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { navigate } from 'gatsby';
import React, { useState, useLayoutEffect } from 'react';

import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

const MobileNav = ({ className, sidebar, currentSlug }) => {
  const [value, setValue] = useState(null);
  useLayoutEffect(() => {
    const sectionIndex = sidebar.findIndex(
      (item) => item.items.findIndex((child) => child.slug === currentSlug) !== -1
    );
    const itemIndex = sidebar[sectionIndex].items.findIndex((child) => child.slug === currentSlug);
    setValue({
      label: sidebar[sectionIndex].items[itemIndex].sidebarLabel,
      value: sidebar[sectionIndex].items[itemIndex].slug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  return (
    <div className={clsx(className)}>
      <select
        className="select w-full"
        // value={value}
        onChange={({ target }) => {
          const val = target.value;
          if (!val) return;
          navigate(`${DOCS_BASE_PATH}${val}`);
        }}
      >
        <option value={false} disabled>
          Choose section
        </option>
        {sidebar &&
          sidebar.map(({ title, items }, index) => (
            <optgroup label={title} key={index}>
              {items.map(({ title, slug }, index) => (
                <option
                  label={title}
                  value={slug}
                  key={index}
                  selected={value && slug === value.value}
                >
                  {title}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90" />
    </div>
  );
};

export default MobileNav;
