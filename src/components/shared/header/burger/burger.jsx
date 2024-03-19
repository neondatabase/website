import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

const ANIMATION_DURATION = 0.2;

const Burger = ({ className = null, isToggled = null, onClick = null, isNewDesign = false }) => (
  <LazyMotion features={domAnimation}>
    <m.button
      className={clsx(
        '-mr-1 flex h-8 w-7 shrink rounded-full',
        isNewDesign ? '-mt-1.5' : ' -mt-1',
        className
      )}
      type="button"
      animate={isToggled ? 'toggled' : 'initial'}
      aria-label={isToggled ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    >
      <m.span
        className={clsx(
          'absolute block h-0.5 rounded-full bg-current',
          isNewDesign ? 'left-px top-2 w-6' : 'left-1.5 top-2.5 w-4'
        )}
        variants={{
          initial: {
            top: isNewDesign ? 8 : 10,
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
      <m.span
        className={clsx(
          'absolute block h-0.5 rounded-full bg-current',
          isNewDesign ? 'left-px top-4 w-6' : 'left-1.5 top-[15px] w-4'
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
      <m.span
        className={clsx(
          'absolute block h-0.5 rounded-full bg-current',
          isNewDesign ? 'bottom-1.5 left-px w-6' : 'bottom-2.5 left-1.5 w-4'
        )}
        variants={{
          initial: {
            bottom: isNewDesign ? 6 : 10,
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
      <m.span
        className={clsx(
          'absolute hidden h-0.5 w-4 rounded-full bg-current',
          isNewDesign ? 'left-[3px] top-4 w-[22px]' : 'left-1.5 top-3.5 w-4'
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
      <m.span
        className={clsx(
          'absolute hidden h-0.5 w-4 rounded-full bg-current',
          isNewDesign ? 'left-[3px] top-4 w-[22px]' : 'left-1.5 top-3.5 w-4'
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
    </m.button>
  </LazyMotion>
);

Burger.propTypes = {
  className: PropTypes.string,
  isToggled: PropTypes.bool,
  onClick: PropTypes.func,
  isNewDesign: PropTypes.bool,
};

export default Burger;
