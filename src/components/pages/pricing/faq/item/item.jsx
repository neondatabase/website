'use client';

import clsx from 'clsx';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link/link';

import ArrowIcon from '../svg/arrow.inline.svg';

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
    <li className="border-b border-gray-new-20 py-[14px] xl:py-[15px] lg:py-4">
      <button
        className="flex w-full items-start gap-4 text-left"
        type="button"
        aria-expanded={isOpen}
        aria-controls={index}
        onClick={handleOpen}
      >
        <ArrowIcon
          className={clsx('shrink-0 text-pricing-primary-1 transition duration-200', {
            'rotate-90 fill-pricing-primary-1 !text-pricing-black': isOpen,
          })}
          aria-hidden
        />
        <h3 className="text-[22px] font-medium leading-tight tracking-tight xl:text-xl">
          {question}
        </h3>
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
            className="with-link-primary pl-[42px] pr-24 pt-4 text-base font-light leading-tight text-gray-new-94 xl:pt-[11px] xl:pr-12 lg:pt-3.5 lg:pr-0 md:pt-3"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          {linkText && linkUrl && (
            <Link
              className="my-2 ml-[42px] border-b border-pricing-primary-3 pb-1.5 !text-base font-normal leading-none !text-pricing-primary-1 hover:!border-pricing-primary-1 xl:mt-3 xl:mb-2 lg:!text-base md:mb-0"
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
