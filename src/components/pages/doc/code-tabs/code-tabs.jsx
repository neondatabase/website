import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import CodeBlock from 'components/shared/code-block';

const CodeTabs = ({ children, labels }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="my-10 max-w-full overflow-hidden rounded-md bg-gray-7">
      <div className="no-scrollbars bg-grey-15 flex w-full flex-nowrap overflow-auto border-b border-gray-6">
        {labels.map((label, i) => (
          <div
            key={`lb-${i}`}
            className={clsx(
              'cursor-pointer whitespace-nowrap border-b-2 px-[18px] pt-3 pb-3.5 font-semibold leading-none transition-colors duration-200',
              i === currentIndex
                ? 'border-secondary-8 text-secondary-8 after:opacity-100'
                : 'border-transparent'
            )}
            tabIndex="0"
            role="button"
            onClick={() => setCurrentIndex(i)}
            onKeyDown={() => setCurrentIndex(i)}
          >
            {label}
          </div>
        ))}
      </div>

      {React.Children.map(children, (child, i) => {
        if (i !== currentIndex) {
          return null;
        }

        const { children, className } = child.props?.children.props ?? {};

        return (
          <CodeBlock key={i} className={clsx(className, 'code-tab')} showLineNumbers>
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
