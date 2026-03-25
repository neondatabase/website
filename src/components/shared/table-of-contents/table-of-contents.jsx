'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { TabsContext } from 'contexts/tabs-context';
import TOCIcon from 'icons/toc.inline.svg';

import Item from './item';

const ANCHOR_SCROLL_MARGIN = 130;

const TableOfContents = ({ items, isTemplate }) => {
  const titles = useRef([]);
  const [currentAnchor, setCurrentAnchor] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(true);
  const { activeTab } = useContext(TabsContext);

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

  // Mirror the Tabs component's fallback: default to the first tab label
  // when activeTab doesn't match any label in the group.
  const effectiveActiveTab = useMemo(() => {
    const group = items.find((item) => item.tabGroupLabels)?.tabGroupLabels;
    if (!group) return activeTab;
    return group.includes(activeTab) ? activeTab : group[0];
  }, [items, activeTab]);

  const flatItemsRef = useRef(flatItems);
  flatItemsRef.current = flatItems;

  const effectiveActiveTabRef = useRef(effectiveActiveTab);
  effectiveActiveTabRef.current = effectiveActiveTab;

  const resolveTitles = useCallback(() => {
    const eTab = effectiveActiveTabRef.current;
    titles.current = flatItems
      .filter((item) => !item.tabLabel || item.tabLabel === eTab)
      .map(({ id }) => document.getElementById(id))
      .filter((anchor) => anchor !== null);
  }, [flatItems]);

  const updateCurrentAnchor = useCallback(() => {
    const currentTitleIdx = titles.current.findIndex((anchor) => {
      if (!anchor.isConnected) return false;
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

    // When duplicate IDs exist across tabs, prefer the item in the active tab
    const eTab = effectiveActiveTabRef.current;
    const matchingItem =
      flatItemsRef.current.find(
        (item) => item.id === currentTitle?.id && (!item.tabLabel || item.tabLabel === eTab)
      ) || flatItemsRef.current.find((item) => item.id === currentTitle?.id);
    setCurrentIndex(matchingItem?.index ?? null);
  }, []);

  const onScroll = useThrottleCallback(updateCurrentAnchor, 100);

  useEffect(() => {
    resolveTitles();
    updateCurrentAnchor();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, updateCurrentAnchor, resolveTitles]);

  useEffect(() => {
    resolveTitles();
    updateCurrentAnchor();
  }, [activeTab, resolveTitles, updateCurrentAnchor]);

  // Whether the current heading is within a numbered steps section.
  // When false, numbered step items should not show "past" fill styling.
  const currentAnchorInSteps = useMemo(() => {
    if (!currentAnchor) return false;
    const item = flatItems.find((i) => i.id === currentAnchor);
    if (item?.numberedStep) return true;
    // Check if the current anchor is a child of a numbered step
    return items.some(
      (parent) => parent.numberedStep && parent.items?.some((child) => child.id === currentAnchor)
    );
  }, [flatItems, items, currentAnchor]);

  const hasTabs = items.length > 0 && items.some((item) => item.tabLabel);

  // Group items: items without a tab label go first, then items grouped by tab
  const tabGroups = useMemo(() => {
    if (!hasTabs || items.length === 0) return null;

    const groups = [];
    let currentTabLabel = null;
    let currentGroup = null;

    for (const item of items) {
      if (item.tabLabel !== currentTabLabel) {
        currentTabLabel = item.tabLabel;
        currentGroup = { label: currentTabLabel || null, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(item);
    }

    return groups;
  }, [items, hasTabs]);

  if (items.length === 0) return null;

  const renderItem = (item, index) => (
    <li className="group relative" key={index}>
      <Item
        index={item.index}
        currentIndex={currentIndex}
        currentAnchor={currentAnchor}
        currentAnchorInSteps={currentAnchorInSteps}
        isUserScrolling={isUserScrolling}
        setIsUserScrolling={setIsUserScrolling}
        isTemplate={isTemplate}
        {...item}
      />
    </li>
  );

  return (
    <>
      <h3 className="mb-6 flex items-center gap-2 text-sm leading-none font-medium tracking-extra-tight">
        <TOCIcon className="size-3 shrink-0" aria-hidden />
        On this page
      </h3>
      <ul className="no-scrollbars flex flex-col gap-3 overflow-y-auto">
        {hasTabs
          ? tabGroups.map((group, groupIdx) => (
              <li key={groupIdx}>
                {group.label && (
                  <span className="mb-2 mt-1 block text-xs font-medium uppercase tracking-wide text-gray-new-50 first:mt-0 dark:text-gray-new-60">
                    {group.label}
                  </span>
                )}
                <ul className="flex flex-col gap-3">{group.items.map(renderItem)}</ul>
              </li>
            ))
          : items.map(renderItem)}
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
      tabLabel: PropTypes.string,
      tabGroupLabels: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  isTemplate: PropTypes.bool,
};

export default TableOfContents;
