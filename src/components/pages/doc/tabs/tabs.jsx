'use client';

import PropTypes from 'prop-types';
import { Children, useState, useEffect, useContext } from 'react';

import { TabsContext } from 'contexts/tabs-context';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const Tabs = ({ labels = [], children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const tmp = labels.indexOf(activeTab);
    if (tmp !== -1) setCurrentIndex(tmp);
  }, [activeTab, labels]);

  const handleTabClick = (index) => {
    const label = labels[index];
    setCurrentIndex(index);
    setActiveTab(label);
    sendGtagEvent('Tab Clicked', { tab_label: label, tag_name: 'ContentTab' });
  };

  return (
    <figure className="my-5 max-w-full overflow-hidden border border-gray-new-90 dark:border-gray-new-20">
      <div className="bg-grey-15 relative no-scrollbars flex w-full flex-nowrap gap-5 overflow-auto pl-5 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-gray-new-90 dark:bg-gray-new-8 dark:after:bg-gray-new-20">
        {labels.map((label, index) => (
          <button
            className={cn(
              'relative z-10 cursor-pointer border-b pt-2.5 pb-3.5 text-sm leading-none font-medium whitespace-nowrap transition-colors duration-200 hover:text-black-new dark:hover:text-gray-new-80',
              index === currentIndex
                ? 'border-black-new text-black-new after:opacity-100 dark:border-white dark:text-white'
                : 'border-transparent text-gray-new-60'
            )}
            key={`lb-${index}`}
            type="button"
            onClick={() => handleTabClick(index)}
            onKeyDown={() => handleTabClick(index)}
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
