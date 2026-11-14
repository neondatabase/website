'use client';

import PropTypes from 'prop-types';
import { Children, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TabsContext } from 'contexts/tabs-context';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const Tabs = ({ labels = [], children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const containerRef = useRef(null);
  const lastSelectedIndexRef = useRef(0);
  const tabTopBeforeClickRef = useRef(null);
  const panelRefs = useRef([]);
  const hashTargetRef = useRef(null);
  const currentIndexRef = useRef(0);
  // Panel that holds the URL hash target. It takes priority over the synced tab
  // until the reader clicks a tab, so following a link to a heading inside an
  // inactive panel shows that panel without changing the saved tab preference.
  const [hashPanelIndex, setHashPanelIndex] = useState(null);

  const syncedIndex = labels.indexOf(activeTab);
  const currentIndex =
    hashPanelIndex ?? (syncedIndex === -1 ? lastSelectedIndexRef.current : syncedIndex);

  useEffect(() => {
    const revealHashTarget = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        return;
      }

      let id = hash;
      try {
        id = decodeURIComponent(hash);
      } catch {
        // Keep the raw hash if it isn't valid percent-encoding
      }

      const target = document.getElementById(id);
      const panelIndex = target
        ? panelRefs.current.findIndex((panel) => panel?.contains(target))
        : -1;

      if (panelIndex === -1) {
        return;
      }

      // The browser can't scroll to a target in a hidden panel. Scroll to it
      // once its panel is visible (see the layout effect below).
      if (panelIndex !== currentIndexRef.current) {
        hashTargetRef.current = target;
      }
      setHashPanelIndex(panelIndex);
    };

    revealHashTarget();
    window.addEventListener('hashchange', revealHashTarget);

    return () => window.removeEventListener('hashchange', revealHashTarget);
  }, []);

  useLayoutEffect(() => {
    lastSelectedIndexRef.current = currentIndex;
    currentIndexRef.current = currentIndex;

    if (hashTargetRef.current) {
      hashTargetRef.current.scrollIntoView();
      hashTargetRef.current = null;
    }

    if (tabTopBeforeClickRef.current === null) {
      return undefined;
    }

    const tabTopAfterClick = containerRef.current?.getBoundingClientRect().top;

    if (typeof tabTopAfterClick === 'number') {
      const scrollDelta = tabTopAfterClick - tabTopBeforeClickRef.current;

      if (Math.abs(scrollDelta) > 1) {
        window.scrollBy(0, scrollDelta);
      }
    }

    tabTopBeforeClickRef.current = null;
    return undefined;
  }, [currentIndex]);

  const handleTabClick = (index) => {
    const label = labels[index];

    if (label === activeTab && index === currentIndex) {
      sendGtagEvent('Tab Clicked', { tab_label: label, tag_name: 'ContentTab' });
      return;
    }

    if (index !== currentIndex) {
      tabTopBeforeClickRef.current = containerRef.current?.getBoundingClientRect().top ?? null;
    }
    setHashPanelIndex(null);
    setActiveTab(label);
    sendGtagEvent('Tab Clicked', { tab_label: label, tag_name: 'ContentTab' });
  };

  return (
    <figure
      className="my-5 max-w-full overflow-hidden border border-gray-new-80 dark:border-gray-new-20 [&_.code-block]:my-0 [&_.code-block]:!border-none"
      ref={containerRef}
    >
      <div className="relative no-scrollbars flex min-h-11 w-full flex-nowrap gap-5 overflow-auto bg-gray-new-98 pl-5 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-gray-new-80 dark:bg-gray-new-8 dark:after:bg-gray-new-20">
        {labels.map((label, index) => (
          <button
            className={cn(
              'relative z-10 cursor-pointer border-b pt-2.5 pb-3.5 text-sm leading-none font-medium tracking-extra-tight whitespace-nowrap transition-colors duration-200 hover:text-black-pure dark:hover:text-white',
              index === currentIndex
                ? 'border-black-pure text-black-pure after:opacity-100 dark:border-white dark:text-white'
                : 'border-transparent text-gray-new-40 dark:text-gray-new-60'
            )}
            key={`lb-${index}`}
            type="button"
            onClick={() => handleTabClick(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Inactive panels are hidden with CSS so their content stays in the server-rendered HTML */}
      {Children.map(children, (child, index) => (
        <div
          className={cn(index !== currentIndex && 'hidden')}
          ref={(element) => {
            panelRefs.current[index] = element;
          }}
        >
          {child}
        </div>
      ))}
    </figure>
  );
};

Tabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default Tabs;
