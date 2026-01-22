'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useContext, useEffect } from 'react';

import { CodeTabsContext } from 'contexts/code-tabs-context';

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
  };

  return (
    <div className="my-0 max-w-full">
      {/* Tabs above code block */}
      <div className="no-scrollbars relative mb-2.5 flex w-full flex-nowrap gap-2 overflow-auto">
        {displayedLabels.map((label, index) => (
          <div
            className={clsx(
              'relative z-10 cursor-pointer whitespace-nowrap rounded-lg px-4 py-2.5 text-[13px] font-medium leading-none transition-all duration-200',
              index === currentIndex
                ? 'bg-black-new text-white shadow-md dark:bg-white dark:text-black-new'
                : 'bg-gray-new-94 text-gray-new-40 hover:bg-gray-new-90 hover:text-gray-new-20 dark:bg-gray-new-15 dark:text-gray-new-70 dark:hover:bg-gray-new-20 dark:hover:text-gray-new-90'
            )}
            key={`lb-${index}`}
            tabIndex="0"
            role="button"
            onClick={() => handleTabClick(index)}
            onKeyDown={() => handleTabClick(index)}
          >
            {label}
          </div>
        ))}
      </div>
      {/* Code block container */}
      <div className="overflow-hidden rounded-lg border border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-10 [&_.code-block]:my-0">
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
