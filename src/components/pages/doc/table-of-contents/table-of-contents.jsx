import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const TableOfContents = ({ contentRef }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (contentRef.current) {
      setItems([...contentRef.current.querySelectorAll('h2, h3')]);
    }
  }, [contentRef]);

  if (items.length === 0) return null;

  return (
    <div className="absolute top-0 bottom-10 col-start-11 col-end-13 h-full xl:hidden">
      <nav className="sticky top-10 bottom-10 max-h-[calc(100vh-40px-40px)] max-w-[260px] space-y-2 overflow-y-auto overflow-x-hidden pt-2">
        <span className="py-2.5 text-lg font-semibold leading-none">Table of contents</span>
        <ul className="">
          {items.map((item, index) => {
            const linkClassName =
              'py-2.5 block text-base leading-none transition-colors duration-200 hover:text-primary-2';

            const linkHref = `#${item.id}`;

            return (
              <li key={index}>
                {item.localName === 'h2' && (
                  <a className={clsx(linkClassName, 'font-semibold')} href={linkHref}>
                    {item.textContent}
                  </a>
                )}
                {item.localName === 'h3' && (
                  <a className={clsx(linkClassName, 'ml-3')} href={linkHref}>
                    {item.textContent}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

TableOfContents.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  contentRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};

TableOfContents.defaultProps = {
  contentRef: null,
};

export default TableOfContents;
