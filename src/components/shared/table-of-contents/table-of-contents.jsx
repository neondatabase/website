'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import TOCIcon from './images/toc.inline.svg';
import Item from './item';

const CURRENT_ANCHOR_GAP_PX = 100;

const TableOfContents = ({ items, isUseCase }) => {
  const titles = useRef([]);
  const [currentAnchor, setCurrentAnchor] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(true);

  const flatItems = useMemo(
    () =>
      items.reduce((acc, item) => {
        if (item.items) {
          return [...acc, item, ...item.items];
        }
        return [...acc, item];
      }, []),
    [items]
  );

  useEffect(() => {
    titles.current = flatItems
      .map(({ id }) => document.getElementById(id))
      .filter((anchor) => anchor !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCurrentAnchor = useCallback(() => {
    const currentTitleIdx = titles.current.findIndex((anchor) => {
      const { top } = anchor.getBoundingClientRect();

      return top - CURRENT_ANCHOR_GAP_PX >= 0;
    });

    const idx =
      currentTitleIdx === -1 ? titles.current.length - 1 : Math.max(currentTitleIdx - 1, 0);

    const currentTitle = titles.current[idx];

    setCurrentAnchor(currentTitle?.id);

    if (isUserScrolling) {
      // Open sub-items only if it's user-initiated scrolling
      setCurrentAnchor(currentTitle?.id);
    }
  }, [isUserScrolling]);

  const onScroll = useThrottleCallback(updateCurrentAnchor, 100);

  useEffect(() => {
    updateCurrentAnchor();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, updateCurrentAnchor]);

  if (items.length === 0) return null;

  return (
    <>
      <h3 className="flex items-center space-x-2 py-2 text-sm font-semibold leading-tight">
        <TOCIcon className="h-3.5 w-3.5 text-black dark:text-white" />
        <span>On this page</span>
      </h3>
      <ul className="no-scrollbars overflow-y-auto">
        {items.map((item, index) => (
          <li key={index}>
            <Item
              currentAnchor={currentAnchor}
              isUserScrolling={isUserScrolling}
              setIsUserScrolling={setIsUserScrolling}
              isUseCase={isUseCase}
              {...item}
            />
          </li>
        ))}
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
  isUseCase: PropTypes.bool,
};

export default TableOfContents;
