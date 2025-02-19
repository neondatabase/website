'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ChevronRight from 'icons/chevron-right-sm.inline.svg';

const TechCardsWrapper = ({ children, withToggler }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <ul className="not-prose !my-7 grid grid-cols-3 gap-5 !p-0 sm:grid-cols-1">
        {withToggler && !isOpen ? children.slice(0, 3) : children}
      </ul>
      {withToggler && (
        <button
          type="button"
          className="mx-auto mt-4 flex items-center rounded-full bg-gray-new-98 px-[18px] py-1.5 text-black-new transition-colors duration-200 hover:bg-gray-new-94 dark:bg-gray-new-10 dark:text-gray-new-80 dark:hover:bg-gray-new-15"
          onClick={handleClick}
        >
          <span className="text-sm font-medium">{isOpen ? 'Hide' : 'Show more'}</span>
          <span className="ml-2.5 flex size-3 items-center justify-center">
            <ChevronRight
              className={clsx(
                'block shrink-0 transition-[transform,color] duration-200 ',
                isOpen ? '-rotate-90' : 'rotate-90'
              )}
            />
          </span>
        </button>
      )}
    </>
  );
};

TechCardsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  withToggler: PropTypes.bool.isRequired,
};

export default TechCardsWrapper;
