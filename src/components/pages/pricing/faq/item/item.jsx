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
    <li className="border-b border-pricing-gray-2 py-6 xl:py-5 lg:py-4">
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
        <h3 className="text-[22px] font-medium leading-tight tracking-tight lg:text-xl">
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
            className="with-link-primary pl-[42px] pt-2 text-base font-light leading-tight text-[#EFEFF0] xl:pt-[18px] xl:text-lg lg:pt-3.5 md:pt-3"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          {linkText && linkUrl && (
            <Link
              className="ml-[42px] mt-3 border-b border-pricing-primary-3 pb-1.5 !text-base font-normal leading-none !text-pricing-primary-1 hover:!border-pricing-primary-1 xl:mt-4 lg:mt-3 lg:!text-base md:mt-2.5"
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
