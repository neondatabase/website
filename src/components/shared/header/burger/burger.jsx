import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

const ANIMATION_DURATION = 0.2;

const Burger = ({ className: additionalClassName, onClick, isToggled }) => (
  <motion.button
    className={clsx('relative h-10 w-10 rounded-full border-2 border-white', additionalClassName)}
    type="button"
    animate={isToggled ? 'toggled' : 'initial'}
    onClick={onClick}
  >
    <motion.span
      className="absolute top-[11px] left-[8px] block h-0.5 w-5 rounded-full bg-white"
      variants={{
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
      }}
    />
    <motion.span
      className="absolute top-[17px] left-[12px] block h-0.5 w-3 rounded-full bg-white"
      variants={{
        initial: {
          display: 'block',
          transition: { delay: ANIMATION_DURATION },
        },
        toggled: {
          display: 'none',
          transition: { delay: ANIMATION_DURATION },
        },
      }}
    />
    <motion.span
      className="absolute bottom-[11px] left-[8px] block h-0.5 w-5 rounded-full bg-white"
      variants={{
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
      }}
    />
    <motion.span
      className="absolute top-[17px] left-[8px] hidden h-0.5 w-5 rounded-full bg-white"
      variants={{
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
      }}
    />
    <motion.span
      className="absolute top-[17px] left-[8px] hidden h-0.5 w-5 rounded-full bg-white"
      variants={{
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
      }}
    />
  </motion.button>
);

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
