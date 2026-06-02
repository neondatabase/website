'use client';

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ChevronIcon from './images/chevron.inline.svg';

const sliderItemsAnimationProps = {
  initial: (direction) => ({
    opacity: 0,
    translateX: direction === 'right' ? 20 : -20,
  }),
  animate: {
    opacity: 1,
    translateX: 0,
    transition: { ease: [0.25, 0.1, 0, 1], duration: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { ease: [0.25, 0.1, 0, 1], duration: 0.2 },
  },
};

const handleOnDragEnd = (info, setActiveSliderItemIndex, children, setDirection) => {
  if (info.offset.x > 0) {
    setActiveSliderItemIndex((itemIndex) => (itemIndex + children.length - 1) % children.length);
    setDirection('left');
  } else {
    setActiveSliderItemIndex((itemIndex) => (itemIndex + 1) % children.length);
    setDirection('right');
  }
};

const QuoteBlocksWrapper = ({ children }) => {
  const [activeSliderItemIndex, setActiveSliderItemIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  return (
    <section className="mt-8 mb-20 flex flex-col gap-y-3 md:mb-12">
      <div className="flex justify-end gap-x-2.5">
        <button
          className="flex h-8 w-8 items-center justify-center border border-gray-new-80 bg-white transition-colors duration-200 hover:bg-gray-new-94 dark:border-gray-new-20 dark:bg-gray-new-10 dark:hover:bg-gray-new-15"
          type="button"
          onClick={() => {
            setActiveSliderItemIndex(
              (itemIndex) => (itemIndex + children.length - 1) % children.length
            );
            setDirection('left');
          }}
        >
          <ChevronIcon className="rotate-180 text-gray-new-40 dark:text-white" />
          <span className="sr-only">Prev</span>
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center border border-gray-new-80 bg-white transition-colors duration-200 hover:bg-gray-new-94 dark:border-gray-new-20 dark:bg-gray-new-10 dark:hover:bg-gray-new-15"
          type="button"
          onClick={() => {
            setActiveSliderItemIndex((itemIndex) => (itemIndex + 1) % children.length);
            setDirection('right');
          }}
        >
          <ChevronIcon className="text-gray-new-40 dark:text-white" />
          <span className="sr-only">Next</span>
        </button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {React.Children.map(children, (child, index) =>
          index === activeSliderItemIndex ? (
            <motion.div
              key={index}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, info) =>
                handleOnDragEnd(info, setActiveSliderItemIndex, children, setDirection)
              }
              {...sliderItemsAnimationProps}
            >
              {child}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </section>
  );
};

QuoteBlocksWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QuoteBlocksWrapper;
