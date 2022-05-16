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
    <div className="col-start-11 col-end-13 h-full xl:hidden">
      <nav className="sticky top-10 bottom-10 max-h-[calc(100vh-40px-40px)] overflow-y-auto overflow-x-hidden">
        <h3 className="py-2.5 text-lg font-semibold leading-snug">Table of contents</h3>
        <ul>
          {items.map((item, index) => {
            const linkClassName =
              'py-2.5 block text-base leading-snug transition-colors duration-200 hover:text-primary-2';
            const linkHref = `#${item.id}`;

            return (
              <li key={index}>
                {item.localName === 'h2' && (
                  <a
                    className={clsx(linkClassName, 'font-semibold')}
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
  contentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(typeof Element === 'undefined' ? () => {} : Element),
    }),
  ]).isRequired,
};

export default TableOfContents;
