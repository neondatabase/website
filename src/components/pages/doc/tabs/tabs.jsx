'use client';

import PropTypes from 'prop-types';
import { Children, useContext, useLayoutEffect, useRef } from 'react';

import { TabsContext } from 'contexts/tabs-context';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const Tabs = ({ labels = [], children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const containerRef = useRef(null);
  const lastSelectedIndexRef = useRef(0);
  const tabTopBeforeClickRef = useRef(null);

  const syncedIndex = labels.indexOf(activeTab);
  const currentIndex = syncedIndex === -1 ? lastSelectedIndexRef.current : syncedIndex;

  useLayoutEffect(() => {
    lastSelectedIndexRef.current = currentIndex;

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

    tabTopBeforeClickRef.current = containerRef.current?.getBoundingClientRect().top ?? null;
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
      {Children.map(children, (child, index) => {
        if (index !== currentIndex) {
          return null;
        }

        return child;
      })}
    </figure>
  );
};

Tabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default Tabs;
