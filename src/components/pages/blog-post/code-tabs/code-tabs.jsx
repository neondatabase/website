'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CodeBlock from 'components/shared/code-block';

const CodeTabs = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <figure className="my-5 max-w-full overflow-hidden rounded-md bg-black-new">
      <div className="no-scrollbars relative flex w-full flex-nowrap overflow-auto after:absolute after:bottom-0 after:h-px after:w-full after:bg-gray-new-20">
        {items.map(({ label }, index) => (
          <button
            className={clsx(
              'relative z-10 cursor-pointer whitespace-nowrap border-b-2 px-[18px] pb-3.5 pt-3 text-base font-semibold leading-none transition-colors duration-200 hover:text-green-45',
              index === currentIndex
                ? 'border-green-45 text-green-45 after:opacity-100'
                : 'border-transparent text-gray-new-90'
            )}
            key={`lb-${index}`}
            type="button"
            onClick={() => setCurrentIndex(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {items
        .filter((_, index) => index === currentIndex)
        .map(({ language, code, highlight }, index) => (
          <CodeBlock
            className="[&_pre]:my-0"
            language={language}
            key={index}
            highlight={highlight.toString()}
            showLineNumbers
            isBlogPost
          >
            {code}
          </CodeBlock>
        ))}
    </figure>
  );
};

CodeTabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CodeTabs;
