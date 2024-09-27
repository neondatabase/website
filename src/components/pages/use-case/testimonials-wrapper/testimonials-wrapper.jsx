'use client';

import clsx from 'clsx';
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

const TestimonialsWrapper = ({ children }) => {
  const [activeSliderItemIndex, setActiveSliderItemIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  return (
    <section className="mb-[72px] flex flex-col gap-y-4">
      <AnimatePresence initial={false} mode="wait">
        {React.Children.map(children, (child, index) =>
          index === activeSliderItemIndex ? (
            <div className={clsx('flex flex-col gap-6')}>
              <motion.div
                className="flex items-center space-x-[18px]"
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
            </div>
          ) : null
        )}
      </AnimatePresence>
      <div className="items-start-center flex justify-start gap-x-2.5">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1A1C20] bg-[#0D0E10] transition-colors duration-200 hover:bg-gray-new-10"
          type="button"
          onClick={() => {
            setActiveSliderItemIndex(
              (itemIndex) => (itemIndex + children.length - 1) % children.length
            );
            setDirection('left');
          }}
        >
          <ChevronIcon className="rotate-180" />
          <span className="sr-only">Prev</span>
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1A1C20] bg-[#0D0E10] transition-colors duration-200 hover:bg-gray-new-10"
          type="button"
          onClick={() => {
            setActiveSliderItemIndex((itemIndex) => (itemIndex + 1) % children.length);
            setDirection('right');
          }}
        >
          <ChevronIcon />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </section>
  );
};

TestimonialsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TestimonialsWrapper;
