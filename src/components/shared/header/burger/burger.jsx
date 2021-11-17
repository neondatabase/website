import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

const ANIMATION_DURATION = 0.2;

const Burger = ({ className: additionalClassName, isToggled, onClick }) => (
  <button
    className={clsx('relative w-10 h-10 border-2 border-white rounded-full', additionalClassName)}
    type="button"
    onClick={onClick}
  >
    <motion.span
      className="absolute top-[11px] left-[8px] block w-5 h-0.5 bg-white rounded-full"
      initial={{
        top: 11,
      }}
      animate={
        isToggled
          ? {
              top: 17,
              transition: { duration: ANIMATION_DURATION },
              transitionEnd: { display: 'none' },
            }
          : {
              top: 11,
              display: 'block',
              transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
            }
      }
    />
    <motion.span
      className="absolute top-[17px] left-[12px] block w-3 h-0.5 bg-white rounded-full"
      initial={{
        display: 'block',
      }}
      animate={
        isToggled
          ? { display: 'none', transition: { delay: ANIMATION_DURATION } }
          : { display: 'block', transition: { delay: ANIMATION_DURATION } }
      }
    />
    <motion.span
      className="absolute bottom-[11px] left-[8px] block w-5 h-0.5 bg-white rounded-full"
      initial={{
        bottom: 11,
      }}
      animate={
        isToggled
          ? {
              bottom: 17,
              transition: { duration: ANIMATION_DURATION },
              transitionEnd: {
                display: 'none',
              },
            }
          : {
              bottom: 11,
              display: 'block',
              transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
            }
      }
    />
    <motion.span
      className="absolute top-[17px] left-[8px] block w-5 h-0.5 bg-white rounded-full"
      initial={{
        display: 'none',
        rotate: '0deg',
      }}
      animate={
        isToggled
          ? {
              display: 'block',
              rotate: '45deg',
              transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
            }
          : {
              rotate: '0deg',
              transition: { duration: ANIMATION_DURATION },
              transitionEnd: { display: 'none' },
            }
      }
    />
    <motion.span
      className="absolute top-[17px] left-[8px] block w-5 h-0.5 bg-white rounded-full"
      initial={{
        display: 'none',
        rotate: '0deg',
      }}
      animate={
        isToggled
          ? {
              display: 'block',
              rotate: '-45deg',
              transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
            }
          : {
              rotate: '0deg',
              transition: { duration: ANIMATION_DURATION },
              transitionEnd: { display: 'none' },
            }
      }
    />
  </button>
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
