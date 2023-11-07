'use client';

import clsx from 'clsx';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link/link';
import sendGtagEvent from 'utils/send-gtag-event';

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
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    sendGtagEvent('pricing_faq', {
      faq_question: question,
      faq_answer: answer,
    });
  };

  return (
    <li className="border-b border-gray-new-20 py-3.5">
      <button
        className="flex w-full items-start gap-4 text-left"
        type="button"
        aria-expanded={isOpen}
        aria-controls={index}
        onClick={handleOpen}
      >
        <ArrowIcon
          className={clsx('shrink-0 text-pricing-primary-1 transition duration-200', {
            'rotate-90 fill-pricing-primary-1 !text-black-new': isOpen,
          })}
          aria-hidden
        />
        <h3 className="text-[22px] font-medium leading-tight tracking-tight xl:text-xl md:text-lg">
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
            className={clsx(
              'with-link-primary pl-[42px] pr-24 pt-2.5 text-base font-light leading-tight text-gray-new-94 xl:pr-12 lg:pr-0',
              linkText && linkUrl ? 'pb-0' : 'pb-2.5'
            )}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          {linkText && linkUrl && (
            <Link
              className="my-2.5 ml-[42px] border-b border-pricing-primary-3 pb-1.5 !text-base font-normal leading-none !text-pricing-primary-1 hover:!border-pricing-primary-1 lg:mt-4 lg:!text-base"
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
