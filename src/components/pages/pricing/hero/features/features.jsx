'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import InfoIcon from 'components/shared/info-icon';
import Link from 'components/shared/link';

const variantsAnimation = {
  open: {
    height: 'auto',
  },
  closed: {
    height: 70,
  },
};

const getIdByTitle = (title) => {
  const titleText = Array.isArray(title)
    ? title.map((part) => (typeof part === 'string' ? part : part.text)).join(' ')
    : title;
  return titleText.toLowerCase().replace(/ /g, '-');
};

const Feature = ({ title, info, disabled, highlighted }) => (
  <li className="flex gap-x-2">
    <span
      className={clsx(disabled ? 'pricing-minus-icon' : 'pricing-check-icon', 'h-[15px] w-3.5', {
        'bg-green-45': highlighted,
        'bg-gray-new-30': disabled,
        'bg-gray-new-60': !highlighted && !disabled,
      })}
      aria-hidden
    />
    <p
      className={clsx('text-[15px] leading-none tracking-extra-tight', {
        'text-gray-new-98': highlighted,
        'text-gray-new-30': disabled,
        'text-gray-new-80': !highlighted && !disabled,
      })}
    >
      <span className="with-link-primary">
        {Array.isArray(title)
          ? title.map((part, i) =>
              typeof part === 'string' ? (
                part
              ) : (
                <Link key={i} to={part.href} onClick={part.onClick}>
                  {part.text}
                </Link>
              )
            )
          : title}
      </span>
      {info && (
        <span className="whitespace-nowrap">
          &nbsp;
          <InfoIcon
            className="relative top-0.5 ml-0.5 inline-block"
            tooltip={info}
            tooltipId={getIdByTitle(title)}
          />
        </span>
      )}
    </p>
  </li>
);

Feature.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          text: PropTypes.string,
          info: PropTypes.string,
        }),
      ])
    ),
  ]),
  info: PropTypes.string,
  disabled: PropTypes.bool,
  highlighted: PropTypes.bool,
};

const Features = ({ title, items, disabled, highlighted, hasToggler }) => {
  const hasHiddenItems = items.length > 3;
  const [isOpen, setIsOpen] = useState(!hasHiddenItems);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div
      className={clsx(
        'mt-5 space-y-[18px] border-t border-dashed border-gray-new-20 pt-5',
        'text-[15px] leading-none tracking-extra-tight',
        highlighted ? 'text-white' : 'text-gray-new-80'
      )}
    >
      {title && (
        <p className="text-[15px] font-medium leading-none tracking-extra-tight">
          {title.text}
          {title.info && (
            <span className="whitespace-nowrap">
              &nbsp;
              <InfoIcon
                className="relative top-0.5 ml-0.5 inline-block"
                tooltip={title.info}
                tooltipId={getIdByTitle(title.text)}
              />
            </span>
          )}
        </p>
      )}
      <LazyMotion features={domAnimation}>
        <m.ul
          initial={hasToggler && 'closed'}
          animate={hasToggler && !isOpen ? 'closed' : 'open'}
          variants={variantsAnimation}
          transition={{ duration: 0.5 }}
          className={clsx('space-y-3.5 pb-0.5', hasToggler && 'overflow-hidden')}
        >
          {items.map((item, index) => (
            <Feature {...item} disabled={disabled} highlighted={highlighted} key={index} />
          ))}
        </m.ul>
      </LazyMotion>
      {hasToggler && !isOpen && (
        <button
          type="button"
          className={clsx(
            'border-b pb-0.5 transition-colors duration-200 hover:border-green-45/50 hover:text-green-45',
            highlighted ? 'border-white/50' : 'border-gray-new-80/50'
          )}
          onClick={handleOpen}
        >
          And more...
        </button>
      )}
    </div>
  );
};

Features.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  items: PropTypes.arrayOf(Feature.propTypes).isRequired,
  disabled: PropTypes.bool,
  highlighted: PropTypes.bool,
  hasToggler: PropTypes.bool,
};

export default Features;
