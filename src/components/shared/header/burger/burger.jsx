import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

const ANIMATION_DURATION = 0.2;

const Burger = ({ className, isToggled, onClick, withoutBorder }) => (
  <motion.button
    className={clsx(
      'relative rounded-full',
      withoutBorder ? '-mr-0.5 h-5 w-5' : 'h-10 w-10 border-2 border-current',
      className
    )}
    type="button"
    animate={isToggled ? 'toggled' : 'initial'}
    aria-label={isToggled ? 'Close menu' : 'Open menu'}
    onClick={onClick}
  >
    <motion.span
      className={clsx(
        'absolute block h-0.5 rounded-full bg-current',
        withoutBorder ? 'left-0 top-0.5 w-4' : 'left-2 top-[11px] w-5'
      )}
      variants={{
        initial: {
          top: withoutBorder ? 2 : 11,
          display: 'block',
          transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
        },
        toggled: {
          top: withoutBorder ? 12 : 17,
          transition: { duration: ANIMATION_DURATION },
          transitionEnd: { display: 'none' },
        },
      }}
    />
    <motion.span
      className={clsx(
        'absolute block h-0.5 rounded-full bg-current',
        withoutBorder ? 'left-0 top-[7px] w-4' : 'left-3 top-[17px] w-3'
      )}
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
      className={clsx(
        'absolute block h-0.5 rounded-full bg-current',
        withoutBorder ? 'left-0 bottom-1.5 w-4' : 'left-2 bottom-[11px] w-5'
      )}
      variants={{
        initial: {
          bottom: withoutBorder ? 6 : 11,
          display: 'block',
          transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
        },
        toggled: {
          bottom: withoutBorder ? 12 : 17,
          transition: { duration: ANIMATION_DURATION },
          transitionEnd: { display: 'none' },
        },
      }}
    />
    <motion.span
      className={clsx(
        'absolute hidden h-0.5 rounded-full bg-current',
        withoutBorder ? 'left-0 top-1.5 w-4' : 'left-2 top-[17px] w-5'
      )}
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
      className={clsx(
        'absolute hidden h-0.5 rounded-full bg-current',
        withoutBorder ? 'left-0 top-1.5 w-4' : 'left-2 top-[17px] w-5'
      )}
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
  withoutBorder: PropTypes.bool,
};

Burger.defaultProps = {
  className: null,
  isToggled: false,
  onClick: null,
  withoutBorder: false,
};

export default Burger;
