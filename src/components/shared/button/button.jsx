'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useState, useMemo } from 'react';

import Link from 'components/shared/link';

// eslint-disable-next-line react/prop-types
const LinesIllustration = ({ color }) => (
  <motion.span
    className="pointer-events-none absolute -top-1/2 left-1/2 -z-10 block w-[113%] -translate-x-1/2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    aria-hidden
  >
    <svg className="h-auto max-w-full" width="390" height="144" viewBox="0 0 390 144" fill="none">
      <g filter="url(#a)" opacity=".6">
        <path
          fill="url(#b)"
          d="M34 43.931C34 38.446 38.446 34 43.931 34h302.138c5.485 0 9.931 4.446 9.931 9.931C356 78.211 328.211 106 293.931 106H96.069C61.789 106 34 78.21 34 43.931Z"
        />
        <path
          stroke="#0C0D0D"
          d="M34.5 43.931a9.431 9.431 0 0 1 9.431-9.431h302.138a9.43 9.43 0 0 1 9.431 9.431c0 34.004-27.565 61.569-61.569 61.569H96.069C62.065 105.5 34.5 77.935 34.5 43.931Z"
        />
      </g>
      <path
        stroke="#0C0D0D"
        d="M7 17.5h376M7 15.5h376M7 13.5h376M7 11.5h376M7 9.5h376M7 21.5h376M7 19.5h376M7 23.5h376M7 25.5h376M7 27.5h376M7 31.5h376M7 29.5h376M7 33.5h376M7 35.5h376M7 37.5h376M7 41.5h376M7 39.5h376M7 43.5h376M7 45.5h376M7 47.5h376M7 51.5h376M7 49.5h376M7 53.5h376M7 55.5h376M7 57.5h376M7 61.5h376M7 59.5h376M7 63.5h376M7 65.5h376M7 67.5h376M7 71.5h376M7 69.5h376M7 73.5h376M7 75.5h376M7 77.5h376M7 81.5h376M7 79.5h376M7 83.5h376M7 85.5h376M7 87.5h376M7 91.5h376M7 89.5h376M7 93.5h376M7 95.5h376M7 97.5h376M7 101.5h376M7 99.5h376M7 103.5h376M7 105.5h376M7 107.5h376M7 111.5h376M7 109.5h376M7 113.5h376M7 115.5h376M7 117.5h376M7 121.5h376M7 119.5h376M7 123.5h376M7 125.5h376M7 127.5h376M7 131.5h376M7 129.5h376M7 133.5h376M7 135.5h376M7 137.5h376M7 141.5h376M7 139.5h376M7 143.5h376"
      />
      <defs>
        <linearGradient
          id="b"
          x1="200.963"
          x2="200.963"
          y1="34"
          y2="126"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".789" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter
          id="a"
          width="390"
          height="140"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_15185_26338" stdDeviation="17" />
        </filter>
      </defs>
    </svg>
    <motion.span
      className="absolute block h-[10px] w-full bg-button-overlay bg-blend-overlay"
      animate={{ y: [0, -144] }}
      transition={{ ease: 'linear', duration: 4, repeat: Infinity }}
    />
  </motion.span>
);

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

const Button = ({
  className: additionalClassName = null,
  to = null,
  isAnimated = false,
  animationColor = '#00E599',
  size,
  theme,
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
      <LinesIllustration color={animationColor} />
    </Tag>
  ) : (
    <Tag className={className} to={to} {...otherProps}>
      {children}
    </Tag>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)).isRequired,
  theme: PropTypes.oneOf(Object.keys(styles.theme)).isRequired,
  children: PropTypes.node.isRequired,
  animationColor: PropTypes.string,
  isAnimated: PropTypes.bool,
};

export default Button;
