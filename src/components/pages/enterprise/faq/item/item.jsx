'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
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
        className="relative flex w-full items-start justify-between gap-4 text-left after:absolute after:-inset-y-5 after:left-0 after:w-full"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`panel-${index}`}
        onClick={handleOpen}
      >
        <h3 className="text-xl font-medium leading-snug tracking-tighter lg:text-lg md:text-[18px]">
          {question}
        </h3>
        <span
          className={clsx(
            'mr-2.5 mt-2.5 h-2 w-2 shrink-0 transform border-l border-t border-gray-new-80 transition-transform duration-300',
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
            aria-hidden={isOpen}
          >
            <p
              className="with-link-primary with-list-style pt-4 text-base leading-normal text-gray-new-80 lg:pt-5"
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
