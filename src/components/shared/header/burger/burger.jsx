import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const ANIMATION_DURATION = 0.2;

const line1Variants = {
  initial: {
    top: 11,
    display: 'block',
    transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
  },
  toggled: {
    top: 17,
    transition: { duration: ANIMATION_DURATION },
    transitionEnd: { display: 'none' },
  },
};

const line2Variants = {
  initial: {
    display: 'block',
    transition: { delay: ANIMATION_DURATION },
  },
  toggled: {
    display: 'none',
    transition: { delay: ANIMATION_DURATION },
  },
};

const line3Variants = {
  initial: {
    bottom: 11,
    display: 'block',
    transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
  },
  toggled: {
    bottom: 17,
    transition: { duration: ANIMATION_DURATION },
    transitionEnd: { display: 'none' },
  },
};

const line4Variants = {
  initial: {
    rotate: '0deg',
    transition: { duration: ANIMATION_DURATION },
    transitionEnd: { display: 'none' },
  },
  toggled: {
    display: 'block',
    rotate: '45deg',
    transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
  },
};

const line5Variants = {
  initial: {
    rotate: '0deg',
    transition: { duration: ANIMATION_DURATION },
    transitionEnd: { display: 'none' },
  },
  toggled: {
    display: 'block',
    rotate: '-45deg',
    transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
  },
};

const Burger = ({ className: additionalClassName, isToggled, onClick }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isToggled) {
      controls.start('toggled');
    } else {
      controls.start('initial');
    }
  }, [isToggled, controls]);

  return (
    <button
      className={clsx('relative w-10 h-10 border-2 border-white rounded-full', additionalClassName)}
      type="button"
      onClick={onClick}
    >
      <motion.span
        className="absolute top-[11px] left-[8px] block w-5 h-0.5 bg-white rounded-full"
        variants={line1Variants}
        animate={controls}
      />
      <motion.span
        className="absolute top-[17px] left-[12px] block w-3 h-0.5 bg-white rounded-full"
        variants={line2Variants}
        animate={controls}
      />
      <motion.span
        className="absolute bottom-[11px] left-[8px] block w-5 h-0.5 bg-white rounded-full"
        variants={line3Variants}
        animate={controls}
      />
      <motion.span
        className="absolute top-[17px] left-[8px] hidden w-5 h-0.5 bg-white rounded-full"
        variants={line4Variants}
        animate={controls}
      />
      <motion.span
        className="absolute top-[17px] left-[8px] hidden w-5 h-0.5 bg-white rounded-full"
        variants={line5Variants}
        animate={controls}
      />
    </button>
  );
};

Burger.propTypes = {
  className: PropTypes.string,
  isToggled: PropTypes.bool,
  onClick: PropTypes.func,
};

Burger.defaultProps = {
  className: null,
  isToggled: false,
  onClick: null,
};

export default Burger;
