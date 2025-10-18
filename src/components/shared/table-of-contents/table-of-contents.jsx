'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Item from './item';

const ANCHOR_SCROLL_MARGIN = 130;

const TableOfContents = ({ items, isTemplate }) => {
  const titles = useRef([]);
  const [currentAnchor, setCurrentAnchor] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
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

      // Check if the anchor is inside a collapsed details element
      if (anchor.closest('details:not([open])')) {
        return false;
      }

      return top - ANCHOR_SCROLL_MARGIN >= 0;
    });

    const idx =
      currentTitleIdx === -1 ? titles.current.length - 1 : Math.max(currentTitleIdx - 1, 0);

    const currentTitle = titles.current[idx];

    setCurrentAnchor(currentTitle?.id);
    setCurrentIndex(idx);
  }, []);

  const onScroll = useThrottleCallback(updateCurrentAnchor, 100);

  useEffect(() => {
    updateCurrentAnchor();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, updateCurrentAnchor]);

  if (items.length === 0) return null;

  return (
    <>
      <h3 className="mb-3.5 text-sm font-medium leading-tight tracking-extra-tight">
        On this page
      </h3>
      <ul className="no-scrollbars overflow-y-auto">
        {items.map((item, index) => (
          <li className="group relative" key={index}>
            <Item
              index={item.index}
              currentIndex={currentIndex}
              currentAnchor={currentAnchor}
              isUserScrolling={isUserScrolling}
              setIsUserScrolling={setIsUserScrolling}
              isTemplate={isTemplate}
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
      index: PropTypes.number,
      id: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  isTemplate: PropTypes.bool,
};

export default TableOfContents;
