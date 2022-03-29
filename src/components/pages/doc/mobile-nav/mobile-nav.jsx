/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { navigate } from 'gatsby';
import React, { useState, useLayoutEffect } from 'react';

import ChevronRight from 'icons/chevron-right.inline.svg';

const MobileNav = ({ className, sidebar, currentSlug }) => {
  const [value, setValue] = useState(null);
  useLayoutEffect(() => {
    const sectionIndex = sidebar.findIndex(
      (item) => item.children.findIndex((child) => child.slug === currentSlug) !== -1
    );
    const itemIndex = sidebar[sectionIndex].children.findIndex(
      (child) => child.slug === currentSlug
    );
    setValue({
      label: sidebar[sectionIndex].children[itemIndex].sidebarLabel,
      value: sidebar[sectionIndex].children[itemIndex].slug,
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
          navigate(`/docs/${val}`);
        }}
      >
        <option value={false} disabled>
          Choose section
        </option>
        {sidebar &&
          sidebar.map(({ sidebarLabel, children }) => (
            <optgroup label={sidebarLabel} key={sidebarLabel}>
              {children.map(({ slug, sidebarLabel: childSidebarLabel }) => (
                <option
                  label={childSidebarLabel}
                  value={slug}
                  key={childSidebarLabel}
                  selected={value && slug === value.value}
                >
                  {childSidebarLabel}
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
