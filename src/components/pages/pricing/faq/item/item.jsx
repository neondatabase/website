'use client';

import clsx from 'clsx';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link/link';
import sendGtagEvent from 'utils/send-gtag-event';
import sendSegmentEvent from 'utils/send-segment-event';

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

const Item = ({ question, answer, linkText = null, linkUrl = null, linkLabel = null, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    const eventName = 'pricing_faq';
    const properties = {
      faq_question: question,
      faq_answer: answer,
    };
    sendGtagEvent(eventName, properties);
    sendSegmentEvent(eventName, properties);
  };

  return (
    <li className="border-b border-gray-new-20 py-3.5">
      <button
        className="relative flex w-full items-start gap-4 text-left after:absolute after:-inset-y-3.5 after:left-0 after:w-full"
        type="button"
        aria-expanded={isOpen}
        aria-controls={index}
        onClick={handleOpen}
      >
        <ArrowIcon
          className={clsx(
            'shrink-0 transition-[fill,transform] duration-200',
            isOpen ? 'rotate-90 fill-green-45 text-black-new' : 'text-green-45'
          )}
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
              className="my-2.5 ml-[42px] pb-1.5 !text-base font-normal leading-none lg:mt-4 lg:!text-base"
              size="sm"
              theme="green"
              to={linkUrl}
            >
              {linkText}
              {linkLabel && <span className="sr-only">{linkLabel}</span>}
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
  linkLabel: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default Item;
