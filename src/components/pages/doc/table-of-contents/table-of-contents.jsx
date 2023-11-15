'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import TOCIcon from './images/toc.inline.svg';
import Item from './item';

const CURRENT_ANCHOR_GAP_PX = 32;

const TableOfContents = ({ items }) => {
  const titles = useRef([]);
  const [currentAnchor, setCurrentAnchor] = useState(null);

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

    setCurrentAnchor(currentTitle.id);
  }, []);

  const onScroll = useThrottleCallback(updateCurrentAnchor, 100);

  useEffect(() => {
    updateCurrentAnchor();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, updateCurrentAnchor]);

  if (items.length === 0) return null;

  return (
    <LazyMotion features={domAnimation}>
      <h3 className="flex items-center space-x-2 py-2 text-sm font-semibold leading-tight">
        <TOCIcon className="h-3.5 w-3.5 text-black dark:text-white" />
        <span>On this page</span>
      </h3>
      <ul className="mt-2.5">
        {items.map(({ title, id, level, items }, index) => {
          const linkHref = `#${id}`;
          const shouldRenderSubItems =
            !!items?.length &&
            (currentAnchor === id || items.some(({ id }) => currentAnchor === id));

          return (
            <li key={index}>
              <Item
                href={linkHref}
                title={title}
                level={level}
                id={id}
                currentAnchor={currentAnchor}
              />
              <AnimatePresence initial={false}>
                {shouldRenderSubItems && (
                  <m.ul
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 1000 }}
                    exit={{ opacity: 0, maxHeight: 0 }}
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                  >
                    {items.map(({ title, id, level }, index) => {
                      const linkHref = `#${id}`;

                      return (
                        <li key={index}>
                          <Item
                            href={linkHref}
                            title={title}
                            level={level}
                            id={id}
                            currentAnchor={currentAnchor}
                          />
                        </li>
                      );
                    })}
                  </m.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </LazyMotion>
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
