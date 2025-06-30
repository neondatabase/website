'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Children, useState } from 'react';

const Tabs = ({ labels = [], children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <figure className="my-5 max-w-full overflow-hidden rounded-md bg-gray-new-98 dark:bg-gray-new-10">
      <div className="no-scrollbars bg-grey-15 relative flex w-full flex-nowrap overflow-auto after:absolute after:bottom-0 after:h-px after:w-full after:bg-gray-new-90 dark:after:bg-gray-new-20">
        {labels.map((label, index) => (
          <button
            className={clsx(
              'relative z-10 cursor-pointer whitespace-nowrap border-b-2 px-[18px] pb-3.5 pt-3 font-semibold leading-none transition-colors duration-200 hover:text-secondary-8 dark:hover:text-green-45',
              index === currentIndex
                ? 'border-secondary-8 text-secondary-8 after:opacity-100 dark:border-primary-1 dark:text-primary-1'
                : 'border-transparent text-gray-new-40 dark:text-gray-7'
            )}
            key={`lb-${index}`}
            type="button"
            onClick={() => setCurrentIndex(index)}
            onKeyDown={() => setCurrentIndex(index)}
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
