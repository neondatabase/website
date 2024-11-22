'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import InfoIcon from 'components/shared/info-icon';
import Link from 'components/shared/link';

const icons = {
  projects: 'pricing-projects-icon',
  storage: 'pricing-storage-icon',
  clock: 'pricing-clock-icon',
  autoscale: 'pricing-autoscale-icon',
};

const variantsAnimation = {
  open: {
    height: 'auto',
  },
  closed: {
    height: 70,
  },
};

const Feature = ({ icon, title, info, type, highlighted, index }) => (
  <li className="flex gap-x-2">
    <span
      className={clsx(
        icon ? icons[icon] : 'pricing-check-icon',
        'mt-px size-3.5',
        highlighted ? 'bg-green-45' : 'bg-gray-new-70'
      )}
      aria-hidden
    />
    <p
      className={clsx(
        'text-[15px] leading-none tracking-extra-tight',
        highlighted ? 'text-white' : 'text-gray-new-80'
      )}
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
            tooltipId={`${type}_tooltip_${index}`}
          />
        </span>
      )}
    </p>
  </li>
);

Feature.propTypes = {
  icon: PropTypes.oneOf(Object.keys(icons)),
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
  type: PropTypes.string,
  highlighted: PropTypes.bool,
  index: PropTypes.number,
};

const Features = ({ title, features, type, highlighted, hasToggler }) => {
  const hasHiddenItems = features.length > 3;
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
        <p className="text-[15px] font-medium leading-none tracking-extra-tight">{title}</p>
      )}
      <LazyMotion features={domAnimation}>
        <m.ul
          initial={hasToggler && 'closed'}
          animate={hasToggler && !isOpen ? 'closed' : 'open'}
          variants={variantsAnimation}
          transition={{ duration: 0.5 }}
          className={clsx('space-y-3 pb-0.5', hasToggler && 'overflow-hidden')}
        >
          {features.map((feature, index) => (
            <Feature {...feature} type={type} highlighted={highlighted} index={index} key={index} />
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
  title: PropTypes.string,
  features: PropTypes.arrayOf(Feature.propTypes).isRequired,
  type: PropTypes.string.isRequired,
  highlighted: PropTypes.bool,
  hasToggler: PropTypes.bool,
};

export default Features;
