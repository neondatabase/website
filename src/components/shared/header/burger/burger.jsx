import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

const ANIMATION_DURATION = 0.2;

const Burger = ({ className = null, isToggled = null, onClick = null }) => (
  <motion.button
    className={clsx('relative -mr-1 -mt-1 flex h-8 w-7 shrink rounded-full', className)}
    type="button"
    animate={isToggled ? 'toggled' : 'initial'}
    aria-label={isToggled ? 'Close menu' : 'Open menu'}
    onClick={onClick}
  >
    <motion.span
      className="absolute left-1.5 top-2.5 block h-0.5 w-4 rounded-full bg-current"
      variants={{
        initial: {
          top: 10,
          display: 'block',
          transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
        },
        toggled: {
          top: 12,
          transition: { duration: ANIMATION_DURATION },
          transitionEnd: { display: 'none' },
        },
      }}
    />
    <motion.span
      className="absolute left-1.5 top-[15px] block h-0.5 w-4 rounded-full bg-current"
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
      className="absolute bottom-2.5 left-1.5 block h-0.5 w-4 rounded-full bg-current"
      variants={{
        initial: {
          bottom: 10,
          display: 'block',
          transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
        },
        toggled: {
          bottom: 12,
          transition: { duration: ANIMATION_DURATION },
          transitionEnd: { display: 'none' },
        },
      }}
    />
    <motion.span
      className="absolute left-1.5 top-3.5 hidden h-0.5 w-4 rounded-full bg-current"
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
      className="absolute left-1.5 top-3.5 hidden h-0.5 w-4 rounded-full bg-current"
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

export default Burger;
