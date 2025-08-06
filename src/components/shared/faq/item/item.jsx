'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

const variantsAnimation = {
  open: {
    opacity: 1,
    height: 'auto',
    pointerEvents: 'auto',
  },
  closed: {
    opacity: 0,
    height: 0,
    pointerEvents: 'none',
  },
};

const Item = ({ question, answer, id = null, initialState = 'closed', index }) => {
  const [isOpen, setIsOpen] = useState(initialState === 'open');

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li className="overflow-hidden border-b border-gray-new-15 py-[18px] last:border-0" id={id}>
      <button
        className="group relative flex w-full items-start justify-between gap-4 text-left after:absolute after:-inset-y-5 after:left-0 after:w-full"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`panel-${index}`}
        onClick={handleOpen}
      >
        <h3 className="text-xl font-medium leading-snug tracking-tighter transition-colors duration-300 group-hover:text-primary-2 lg:text-lg md:text-[18px]">
          {question}
        </h3>
        <span
          className={clsx(
            'mr-2.5 mt-2.5 h-2 w-2 shrink-0 transform border-l border-t border-gray-new-80 transition duration-300 group-hover:border-primary-2',
            isOpen ? 'rotate-[405deg]' : 'rotate-[225deg]'
          )}
        />
      </button>
      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false} mode="wait">
          <m.div
            key={index}
            id={`panel-${index}`}
            initial={initialState}
            animate={isOpen ? 'open' : 'closed'}
            variants={variantsAnimation}
            transition={{
              opacity: { duration: 0.2 },
              height: { duration: 0.3 },
            }}
          >
            <div
              className={clsx(
                'with-link-primary with-list-style pr-14 pt-4 text-[15px] font-normal leading-normal text-gray-new-80 lg:pt-5',
                '[&_p:not(:has(+_code))]:mb-2',
                '[&_ul]:ml-0 [&_ul]:list-none [&_ul]:pl-4',
                '[&_li]:relative [&_li]:list-inside [&_li]:!pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:content-["-"]',
                '[&_code]:my-4 [&_code]:inline-block [&_code]:rounded-lg [&_code]:bg-gray-new-10 [&_code]:px-[10px] [&_code]:py-1'
              )}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </li>
  );
};

Item.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  id: PropTypes.string,
  initialState: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default Item;
