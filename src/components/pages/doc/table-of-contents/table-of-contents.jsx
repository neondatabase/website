import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import TOCIcon from './images/toc.inline.svg';

const linkClassName =
  'py-1.5 block text-sm leading-tight transition-colors duration-200 text-gray-new-40 hover:text-black-new dark:text-gray-new-90 dark:hover:text-white';

const TableOfContents = ({ className = null, contentRef }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (contentRef.current) {
      setItems([...contentRef.current.querySelectorAll('h2, h3')]);
    }
  }, [contentRef]);

  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    document.querySelector(anchor).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // changing hash without default jumps to anchor
    // eslint-disable-next-line no-restricted-globals
    if (history.pushState) {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(false, false, anchor);
    } else {
      // old browser support
      window.location.hash = anchor;
    }
  };

  if (items.length === 0) return null;

  return (
    <div className={clsx('h-full xl:hidden', className)}>
      <nav className="sticky bottom-10 top-10 max-h-[calc(100vh-40px-40px)] overflow-y-auto overflow-x-hidden">
        <h3 className="flex items-center space-x-2 py-2 text-sm font-semibold leading-tight">
          <TOCIcon className="h-3.5 w-3.5 text-black-new dark:text-white" />
          <span>On this page</span>
        </h3>
        <ul className="mt-2.5">
          {items.map((item, index) => {
            const linkHref = `#${item.id}`;

            return (
              <li key={index}>
                {item.localName === 'h2' && (
                  <a
                    className={linkClassName}
                    href={linkHref}
                    onClick={(e) => handleAnchorClick(e, linkHref)}
                  >
                    {item.textContent}
                  </a>
                )}
                {item.localName === 'h3' && (
                  <a
                    className={clsx(linkClassName, 'ml-3')}
                    href={linkHref}
                    onClick={(e) => handleAnchorClick(e, linkHref)}
                  >
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
  className: PropTypes.string,
  contentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(typeof Element === 'undefined' ? () => {} : Element),
    }),
  ]).isRequired,
};

export default TableOfContents;
