'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useContext, useEffect } from 'react';

import { ActiveLabelContext } from './CodeTabsContext';

const CodeTabs = ({ children = null, labels = [], reverse = false }) => {
  const { activeLabel, setActiveLabel } = useContext(ActiveLabelContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const tmp = labels.indexOf(activeLabel);
    if (tmp !== -1) setCurrentIndex(tmp);
  }, [activeLabel, labels]);

  const displayedLabels = useMemo(
    () => (reverse ? [...labels].reverse() : labels),
    [labels, reverse]
  );

  const displayedChildren = useMemo(
    () => (reverse ? [...children].reverse() : children),
    [children, reverse]
  );

  const handleTabClick = (index) => {
    const label = labels[index];
    setCurrentIndex(index);
    setActiveLabel(label);
  };

  return (
    <figure className="my-5 max-w-full overflow-hidden rounded-md bg-gray-new-98 dark:bg-gray-new-10 [&_.code-block]:my-0">
      <div className="no-scrollbars bg-grey-15 relative flex w-full flex-nowrap overflow-auto after:absolute after:bottom-0 after:h-px after:w-full after:bg-gray-new-90 dark:after:bg-gray-new-20">
        {displayedLabels.map((label, index) => (
          <div
            className={clsx(
              'relative z-10 cursor-pointer whitespace-nowrap border-b-2 px-[18px] pb-3.5 pt-3 font-medium leading-none transition-colors duration-200 hover:text-secondary-8 dark:hover:text-green-45',
              index === currentIndex
                ? 'border-secondary-8 text-secondary-8 after:opacity-100 dark:border-primary-1 dark:text-primary-1'
                : 'border-transparent text-gray-new-40 dark:text-gray-7'
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
      {displayedChildren.map((child, index) => {
        if (index !== currentIndex) return null;
        return <Fragment key={index}>{child}</Fragment>;
      })}
    </figure>
  );
};

CodeTabs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.object),
  ]),
  labels: PropTypes.arrayOf(PropTypes.string),
  reverse: PropTypes.bool,
};

export default CodeTabs;
