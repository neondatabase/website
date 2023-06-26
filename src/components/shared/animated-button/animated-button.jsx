'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useState, useMemo } from 'react';

import Link from 'components/shared/link';

import LinesIllustration from '../lines-illustration';

const styles = {
  base: 'inline-flex items-center justify-center font-bold !leading-none text-center whitespace-nowrap rounded-full transition-colors duration-200 outline-none',
  size: {
    md: 't-2xl py-7 px-11 2xl:py-[26px] xl:py-[21px] xl:px-9 md:py-5 md:px-8',
    sm: 't-xl py-[26px] px-11 2xl:py-[21px] 2xl:px-9 xl:py-5 xl:px-8',
    xs: 't-base py-[14px] px-[26px]',
    xxs: 'px-3 py-1.5 text-xs uppercase tracking-wider',
  },
  theme: {
    primary: 'bg-primary-1 text-black hover:bg-[#00e5bf]',
    secondary: 'bg-black text-white hover:bg-[#292929] disabled:bg-[#292929]',
    tertiary: 'bg-black text-white border-2 border-white hover:border-primary-2',
    quaternary: 'bg-white text-black border-2 border-black hover:border-primary-2',
    'white-outline': 'bg-transparent text-white border-2 border-white hover:border-primary-2',
  },
};

const AnimatedButton = ({
  className: additionalClassName = null,
  to = null,
  isAnimated = false,
  animationClassName = null,
  animationColor = '#00E599',
  animationSize = 'xs',
  size,
  theme,
  spread,
  children,
  ...otherProps
}) => {
  const className = clsx(styles.base, styles.size[size], styles.theme[theme], additionalClassName);
  const [cursorAnimationVariant, setCursorAnimationVariant] = useState('default');
  const [mouseXPosition, setMouseXPosition] = useState(0);
  const [mouseYPosition, setMouseYPosition] = useState(0);
  const buttonRef = useRef(null);
  const cursorBlurVariants = useMemo(
    () => ({
      default: {
        opacity: 1,
        backgroundColor: 'transparent',
        height: 10,
        width: 10,
        x: mouseXPosition,
        y: mouseYPosition,
        transition: {
          type: 'spring',
          mass: 0.1,
        },
      },
      blur: {
        opacity: 1,
        backgroundColor: animationColor,
        height: 26,
        width: 26,
        x: mouseXPosition,
        y: mouseYPosition,
      },
    }),
    [animationColor, mouseXPosition, mouseYPosition]
  );

  const handleMouseMove = (event) => {
    const { left, top } = buttonRef.current.getBoundingClientRect();

    if (event.clientX !== null) {
      setMouseXPosition(event.clientX - left - 13);
    }

    if (event.clientY !== null) {
      setMouseYPosition(event.clientY - top - 13);
    }
  };

  const handleMouseEnter = () => {
    setCursorAnimationVariant('blur');
  };

  const handleMouseLeave = () => {
    setCursorAnimationVariant('default');
  };

  const Tag = to ? Link : 'button';

  return isAnimated ? (
    <Tag
      className={clsx('relative', className)}
      to={to}
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...otherProps}
    >
      <motion.span
        className="absolute left-0 top-0 rounded-full blur-xl"
        variants={cursorBlurVariants}
        animate={cursorAnimationVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
        aria-hidden
      />
      {children}
      <LinesIllustration
        className={animationClassName}
        color={animationColor}
        size={animationSize}
        spread={spread}
      />
    </Tag>
  ) : (
    <Tag className={className} to={to} {...otherProps}>
      {children}
    </Tag>
  );
};

AnimatedButton.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)).isRequired,
  theme: PropTypes.oneOf(Object.keys(styles.theme)).isRequired,
  children: PropTypes.node.isRequired,
  animationClassName: PropTypes.string,
  animationSize: PropTypes.oneOf(['xs', 'sm']),
  animationColor: PropTypes.string,
  isAnimated: PropTypes.bool,
  spread: PropTypes.oneOf([1, 2, 3, 4, 5]),
};

export default AnimatedButton;
