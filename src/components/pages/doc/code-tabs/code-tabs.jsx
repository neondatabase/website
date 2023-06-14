'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import CodeBlock from 'components/shared/code-block';

const CodeTabs = ({ children = null, shouldWrap = false, labels = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="my-5 max-w-full overflow-hidden rounded-md bg-gray-new-98 dark:bg-gray-1">
      <div className="no-scrollbars bg-grey-15 relative flex w-full flex-nowrap overflow-auto after:absolute after:bottom-0 after:h-px after:w-full after:bg-gray-new-90 dark:after:bg-gray-2">
        {labels.map((label, index) => (
          <div
            className={clsx(
              'relative z-10 cursor-pointer whitespace-nowrap border-b-2 px-[18px] pb-3.5 pt-3 font-semibold leading-none transition-colors duration-200',
              index === currentIndex
                ? 'border-secondary-8 text-secondary-8 after:opacity-100 dark:border-primary-1 dark:text-primary-1'
                : 'border-transparent text-gray-new-40 dark:text-gray-7'
            )}
            key={`lb-${index}`}
            tabIndex="0"
            role="button"
            onClick={() => setCurrentIndex(index)}
            onKeyDown={() => setCurrentIndex(index)}
          >
            {label}
          </div>
        ))}
      </div>

      {React.Children.map(children, (child, index) => {
        if (index !== currentIndex) {
          return null;
        }

        const { children, className } = child.props?.children.props ?? {};

        return (
          <CodeBlock
            key={index}
            className={clsx(className, { 'code-wrap': shouldWrap }, 'code-tab')}
            showLineNumbers
          >
            {children}
          </CodeBlock>
        );
      })}
    </div>
  );
};

CodeTabs.propTypes = {
  children: PropTypes.node,
  shouldWrap: PropTypes.bool,
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default CodeTabs;
