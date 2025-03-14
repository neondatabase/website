'use client';

import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';

const CodeTabsNavigation = ({ items, highlightedItems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
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
      <div className="relative">
        {highlightedItems.map((item, index) => {
          if (index !== currentIndex) {
            return null;
          }

          return (
            <CodeBlockWrapper as="div" key={index}>
              {parse(item)}
            </CodeBlockWrapper>
          );
        })}
      </div>
    </>
  );
};

export default CodeTabsNavigation;

CodeTabsNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    })
  ),
  highlightedItems: PropTypes.arrayOf(PropTypes.string),
};
