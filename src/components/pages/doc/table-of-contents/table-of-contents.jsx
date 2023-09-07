'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import TOCIcon from './images/toc.inline.svg';

const linkClassName =
  'py-1.5 block text-sm leading-tight transition-colors duration-200 text-gray-new-40 hover:text-black-new dark:text-gray-new-90 dark:hover:text-white [&_code]:rounded-sm [&_code]:leading-none [&_code]:py-px [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:font-mono [&_code]:font-normal dark:[&_code]:bg-gray-new-15';

const TableOfContents = ({ items }) => {
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
    <>
      <h3 className="flex items-center space-x-2 py-2 text-sm font-semibold leading-tight">
        <TOCIcon className="h-3.5 w-3.5 text-black dark:text-white" />
        <span>On this page</span>
      </h3>
      <ul className="mt-2.5">
        {items.map((item, index) => {
          const linkHref = `#${item.id}`;

          return (
            <li key={index}>
              {item.level === 2 && (
                <a
                  className={linkClassName}
                  href={linkHref}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                  onClick={(e) => handleAnchorClick(e, linkHref)}
                />
              )}
              {item.level === 3 && (
                <a
                  className={clsx(linkClassName, 'ml-3')}
                  href={linkHref}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                  onClick={(e) => handleAnchorClick(e, linkHref)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

TableOfContents.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TableOfContents;
