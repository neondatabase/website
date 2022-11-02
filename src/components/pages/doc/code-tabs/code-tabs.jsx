import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import CodeBlock from 'components/shared/code-block';

const CodeTabs = ({ children, labels }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="my-10 max-w-full overflow-hidden rounded-md bg-gray-9">
      <div className="no-scrollbars bg-grey-15 relative flex w-full flex-nowrap overflow-auto after:absolute after:bottom-0 after:h-px after:w-full after:bg-gray-7">
        {labels.map((label, index) => (
          <div
            key={`lb-${index}`}
            className={clsx(
              'relative z-10 cursor-pointer whitespace-nowrap border-b-2 px-[18px] pt-3 pb-3.5 font-semibold leading-none transition-colors duration-200',
              index === currentIndex
                ? 'border-secondary-8 text-secondary-8 after:opacity-100'
                : 'border-transparent text-gray-3'
            )}
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
          <CodeBlock key={index} className={clsx(className, 'code-tab')} showLineNumbers>
            {children}
          </CodeBlock>
        );
      })}
    </div>
  );
};

CodeTabs.propTypes = {
  children: PropTypes.node,
  labels: PropTypes.arrayOf(PropTypes.string),
};

CodeTabs.defaultProps = {
  children: null,
  labels: [],
};

export default CodeTabs;
