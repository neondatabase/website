'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Link from 'components/shared/link';
import SdkIcon from 'icons/docs/sidebar/sdk.inline.svg';

import Item from '../table-of-contents/item';

const ANCHOR_SCROLL_MARGIN = 130;

const SDKTableOfContents = ({ sections, title = 'SDK Reference' }) => {
  const titles = useRef([]);
  const [currentAnchor, setCurrentAnchor] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(true);

  const flatItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  useEffect(() => {
    titles.current = flatItems
      .map(({ id }) => document.getElementById(id))
      .filter((anchor) => anchor !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCurrentAnchor = useCallback(() => {
    const currentTitleIdx = titles.current.findIndex((anchor) => {
      const { top } = anchor.getBoundingClientRect();

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

  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        className="flex items-center gap-2.5 text-[15px] font-medium leading-snug tracking-extra-tight"
        to="#"
        theme="blue-green"
      >
        <SdkIcon className="size-4.5 shrink-0" />
        {title}
      </Link>
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-new-40 dark:text-gray-new-70">
            {section.section}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item, itemIdx) => {
              // Calculate global index for scroll spy
              const globalIndex =
                sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.items.length, 0) + itemIdx;

              return (
                <li key={itemIdx}>
                  <Item
                    index={globalIndex}
                    currentIndex={currentIndex}
                    currentAnchor={currentAnchor}
                    isUserScrolling={isUserScrolling}
                    setIsUserScrolling={setIsUserScrolling}
                    level={1}
                    {...item}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

SDKTableOfContents.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      section: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default SDKTableOfContents;
