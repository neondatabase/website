'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import TOCIcon from './images/toc.inline.svg';

const linkClassName =
  'py-1.5 block text-sm leading-tight transition-colors duration-200 text-gray-new-40 hover:text-black-new dark:text-gray-new-90 dark:hover:text-white [&_code]:rounded-sm [&_code]:leading-none [&_code]:py-px [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:font-mono [&_code]:font-normal dark:[&_code]:bg-gray-new-15';

const CURRENT_ANCHOR_GAP_PX = 16;

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
const TableOfContents = ({ items }) => {
  const titles = useRef([]);
  const [currentAnchor, setCurrentAnchor] = useState(null);

  useEffect(() => {
    titles.current = items
      .map(({ id }) => document.getElementById(id))
      .filter((anchor) => anchor !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCurrentAnchor = useCallback(() => {
    const currentTitleIdx = titles.current.findIndex(
      (anchor) => anchor.getBoundingClientRect().top - CURRENT_ANCHOR_GAP_PX >= 0
    );

    const idx =
      currentTitleIdx === -1 ? titles.current.length - 1 : Math.max(currentTitleIdx - 1, 0);

    const currentTitle = titles.current[idx];

    setCurrentAnchor(currentTitle.id);
  }, []);

  const onScroll = useThrottleCallback(updateCurrentAnchor, 5);

  useEffect(() => {
    updateCurrentAnchor();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          const { level } = item;
          return (
            <li key={index}>
              <a
                className={clsx(linkClassName, {
                  'text-black-new dark:text-white font-medium': currentAnchor === item.id,
                })}
                style={{
                  marginLeft: level === 2 ? '' : `${(level - 2) * 0.5}rem`,
                }}
                href={linkHref}
                dangerouslySetInnerHTML={{ __html: item.title }}
                onClick={(e) => handleAnchorClick(e, linkHref)}
              />
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
