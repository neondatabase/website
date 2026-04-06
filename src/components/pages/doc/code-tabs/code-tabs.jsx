'use client';

import PropTypes from 'prop-types';
import { Fragment, useState, useContext, useEffect } from 'react';

import { CodeTabsContext } from 'contexts/code-tabs-context';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const CodeTabs = ({ labels = [], reverse = false, children }) => {
  const { activeTab, setActiveTab } = useContext(CodeTabsContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const tmp = labels.indexOf(activeTab);
    if (tmp !== -1) setCurrentIndex(tmp);
  }, [activeTab, labels]);

  const displayedLabels = reverse ? [...labels].reverse() : labels;
  const displayedChildren = reverse ? [...children].reverse() : children;

  const handleTabClick = (index) => {
    const label = labels[index];
    setCurrentIndex(index);
    setActiveTab(label);
    sendGtagEvent('Tab Clicked', { tab_label: label, tag_name: 'CodeTab' });
  };

  return (
    <div className="my-0 max-w-full overflow-hidden border border-gray-new-80 dark:border-gray-new-20 [&_.code-block]:my-0 [&_.code-block]:!border-none">
      {/* Tabs above code block */}
      <div className="relative no-scrollbars flex min-h-11 w-full flex-nowrap gap-5 overflow-auto bg-gray-new-98 pl-5 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-gray-new-80 dark:bg-gray-new-8 dark:after:bg-gray-new-20">
        {displayedLabels.map((label, index) => (
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
            onKeyDown={() => handleTabClick(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Code block container */}
      <div className="overflow-hidden bg-gray-new-98 dark:bg-gray-new-10 [&_.code-block]:my-0">
        {displayedChildren.map((child, index) => {
          if (index !== currentIndex) return null;
          return <Fragment key={index}>{child}</Fragment>;
        })}
      </div>
    </div>
  );
};

CodeTabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  reverse: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default CodeTabs;
