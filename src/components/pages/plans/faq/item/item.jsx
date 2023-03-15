'use client';

import { LazyMotion, m, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link/link';

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

const Item = ({ question, answer, linkText = null, linkUrl = null, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li className="border-b border-gray-2 py-6 xl:py-5 lg:py-4">
      <button
        className="w-full text-left"
        type="button"
        aria-expanded={isOpen}
        aria-controls={index}
        onClick={handleOpen}
      >
        <h3 className="text-3xl font-bold leading-tight xl:text-2xl lg:text-xl">{question}</h3>
      </button>
      <LazyMotion features={domAnimation}>
        <m.div
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={variantsAnimation}
          transition={{
            opacity: { duration: 0.2 },
            height: { duration: 0.3 },
          }}
        >
          <p
            className="with-link-primary pt-5 text-xl xl:pt-[18px] xl:text-lg lg:pt-3.5 md:pt-3"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          {linkText && linkUrl && (
            <Link
              className="mt-5 border-b-[3px] border-primary-1 pb-1.5 !text-lg font-semibold leading-none xl:mt-4 lg:mt-3 lg:!text-base md:mt-2.5"
              size="sm"
              theme="white"
              to={linkUrl}
            >
              {linkText}
            </Link>
          )}
        </m.div>
      </LazyMotion>
    </li>
  );
};

Item.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  linkText: PropTypes.string,
  linkUrl: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default Item;
