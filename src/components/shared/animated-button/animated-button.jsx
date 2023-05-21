'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useId, useRef, useState, useMemo } from 'react';

import Link from 'components/shared/link';

// TODO: rename once we get better understanding of all possible styles
const spreadStyles = {
  1: 'mt-[4%] h-[130px] w-[105%]',
  2: '-mt-[2%] h-[130px] w-[110%]',
  3: 'mt-[2%] h-[130px] w-[103%]',
};

// eslint-disable-next-line react/prop-types
const LinesIllustration = ({ className: additionalClassName, color, spread }) => {
  const id = useId();

  return (
    <motion.span
      className={clsx(
        'pointer-events-none absolute -top-1/2 left-1/2 -z-10 block w-[113%] -translate-x-1/2',
        additionalClassName
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-hidden
    >
      <svg
        className={`ml-[50%] -translate-x-1/2 ${spreadStyles[spread]}`}
        width="300"
        height="150"
        viewBox="0 0 300 150"
        preserveAspectRatio="none"
        fill="none"
      >
        <g opacity="0.6" filter="url(#filter0_f_103_7)">
          <path
            d="M30.1987 61.1842C30.1987 43.7436 44.3371 29.6052 61.7777 29.6052H238.212C255.652 29.6052 269.791 43.7436 269.791 61.1842C269.791 93.8853 243.281 120.395 210.58 120.395H89.4092C56.7082 120.395 30.1987 93.8853 30.1987 61.1842Z"
            fill={`url(#${id})`}
          />
          <path
            d="M30.6924 61.1842C30.6924 44.0161 44.6098 30.0986 61.7779 30.0986H238.212C255.38 30.0986 269.297 44.0161 269.297 61.1842C269.297 93.6127 243.009 119.901 210.58 119.901H89.4094C56.9809 119.901 30.6924 93.6127 30.6924 61.1842Z"
            stroke="#0C0D0D"
          />
        </g>

        <defs>
          <filter
            id="filter0_f_103_7"
            x="0.192383"
            y="-0.401367"
            width="299.605"
            height="150.803"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_103_7" />
          </filter>
          <linearGradient
            id={`${id}`}
            x1="154.432"
            y1="29.6052"
            x2="154.432"
            y2="145.614"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.789474" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg width="100%" height="150" fill="none" className="absolute top-0">
        <defs>
          <pattern id="linePattern" patternUnits="userSpaceOnUse" width="200" height="2">
            <line x1="0" y1="0" x2="300" y2="0" stroke="#0C0D0D" strokeWidth="1" />
            <line x1="0" y1="2" x2="300" y2="2" stroke="#0C0D0D" strokeWidth="1" />
          </pattern>
        </defs>
        <g className="button-line-animation">
          <rect width="100%" height="150" y="-1" fill="url(#linePattern)" />
          <rect width="100%" height="150" y="150" fill="url(#linePattern)" />
        </g>
      </svg>
    </motion.span>
  );
};

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
        className="absolute top-0 left-0 rounded-full blur-xl"
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
  spread: PropTypes.oneOf([1, 2, 3]),
};

export default AnimatedButton;
