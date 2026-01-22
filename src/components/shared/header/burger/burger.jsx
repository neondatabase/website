import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

const ANIMATION_DURATION = 0.2;

const Burger = ({ className = null, isToggled = null, onClick = null }) => (
  <LazyMotion features={domAnimation}>
    <m.button
      className={clsx('flex h-8 w-8 shrink', className)}
      type="button"
      animate={isToggled ? 'toggled' : 'initial'}
      aria-label={isToggled ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    >
      <m.span
        className="absolute left-1 top-2 block h-0.5 w-6 bg-current"
        variants={{
          initial: {
            top: 8,
            visibility: 'visible',
            transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
          },
          toggled: {
            top: 12,
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { visibility: 'hidden' },
          },
        }}
      />
      <m.span
        className="absolute left-1 top-4 block h-0.5 w-6 bg-current"
        variants={{
          initial: {
            visibility: 'visible',
            transition: { delay: ANIMATION_DURATION },
          },
          toggled: {
            visibility: 'hidden',
            transition: { delay: ANIMATION_DURATION },
          },
        }}
      />
      <m.span
        className="absolute bottom-1.5 left-1 block h-0.5 w-6 bg-current"
        variants={{
          initial: {
            bottom: 6,
            visibility: 'visible',
            transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
          },
          toggled: {
            bottom: 12,
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { visibility: 'hidden' },
          },
        }}
      />
      <m.span
        className="absolute left-[5px] top-4 h-0.5 w-[22px] bg-current"
        variants={{
          initial: {
            rotate: '0deg',
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { visibility: 'hidden' },
          },
          toggled: {
            visibility: 'visible',
            rotate: '45deg',
            transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
          },
        }}
      />
      <m.span
        className="absolute left-[5px] top-4 h-0.5 w-[22px] bg-current"
        variants={{
          initial: {
            rotate: '0deg',
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { visibility: 'hidden' },
          },
          toggled: {
            visibility: 'visible',
            rotate: '-45deg',
            transition: { duration: ANIMATION_DURATION, delay: ANIMATION_DURATION },
          },
        }}
      />
    </m.button>
  </LazyMotion>
);

Burger.propTypes = {
  className: PropTypes.string,
  isToggled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Burger;
