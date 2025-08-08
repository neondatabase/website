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

const Feature = ({ title, info, type, highlighted, index, moreLink }) => {
  const tooltip = moreLink
    ? `${info}<a class="border-b pb-0.5 transition-colors duration-200 hover:border-green-45/50 hover:text-green-45 mt-2 inline-block" href="${moreLink.href}">${moreLink.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>`
    : info;

  return (
    <li className="flex gap-x-2 font-normal">
      <span
        className={clsx(
          'pricing-check-icon mt-px size-3.5 h-[14px] w-[14px] flex-shrink-0',
          highlighted ? 'bg-green-45' : 'bg-gray-new-70'
        )}
        aria-hidden
      />
      <p
        className={clsx(
          'flex items-start gap-x-1 text-[15px] leading-normal tracking-tighter',
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
              className="relative top-0.5 ml-0.5 inline-block h-[14px] w-[14px]"
              tooltip={tooltip}
              tooltipId={`${type}_tooltip_${index}`}
              toggleOnClick
            />
          </span>
        )}
      </p>
    </li>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
  type: PropTypes.string,
  highlighted: PropTypes.bool,
  index: PropTypes.number,
  moreLink: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
};

const Features = ({ title, features, type, highlighted, hasToggler }) => {
  const hasHiddenItems = features.length > 2;
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
          className={clsx('space-y-4 pb-0.5', hasToggler && 'overflow-hidden')}
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
          View more
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
