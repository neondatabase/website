'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useState, useMemo } from 'react';

import Link from 'components/shared/link';

// eslint-disable-next-line react/prop-types
const LinesIllustration = ({ color, size }) => (
  <motion.span
    className={clsx(
      'pointer-events-none absolute -top-1/2 left-1/2 -z-10 block -translate-x-1/2',
      size === 'sm' ? 'w-[126%]' : 'w-[113%]'
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    aria-hidden
  >
    {size === 'sm' ? (
      <svg className="h-auto max-w-full" width="304" height="157" viewBox="0 0 304 157" fill="none">
        <g opacity="0.6" filter="url(#filter0_f_15659_10363)">
          <path
            d="M30.6016 65C30.6016 47.3269 44.9285 33 62.6016 33H241.388C259.061 33 273.388 47.3269 273.388 65C273.388 98.1371 246.525 125 213.388 125H90.6015C57.4645 125 30.6016 98.1371 30.6016 65Z"
            fill="url(#paint0_linear_15659_10363)"
          />
          <path
            d="M31.1016 65C31.1016 47.603 45.2046 33.5 62.6016 33.5H241.388C258.785 33.5 272.888 47.603 272.888 65C272.888 97.8609 246.249 124.5 213.388 124.5H90.6015C57.7406 124.5 31.1016 97.8609 31.1016 65Z"
            stroke="#0C0D0D"
          />
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 1.98145H300V0.981445H4V1.98145ZM300 4.19577H4V3.19577H300V4.19577ZM4 6.4101H300V5.4101H4V6.4101ZM300 8.6249H4V7.6249H300V8.6249ZM300 10.8402H4V9.84019H300V10.8402ZM300 15.2688H4V14.2688H300V15.2688ZM4 13.054H300V12.054H4V13.054ZM300 17.4832H4V16.4832H300V17.4832ZM4 19.698H300V18.698H4V19.698ZM300 21.9123H4V20.9123H300V21.9123ZM4 26.3414H300V25.3414H4V26.3414ZM300 24.1266H4V23.1266H300V24.1266ZM4 28.5558H300V27.5558H4V28.5558ZM300 30.771H4V29.771H300V30.771ZM4 32.9849H300V31.9849H4V32.9849ZM300 37.414H4V36.414H300V37.414ZM4 35.1997H300V34.1997H4V35.1997ZM300 39.6293H4V38.6293H300V39.6293ZM4 41.8436H300V40.8436H4V41.8436ZM300 44.0584H4V43.0584H300V44.0584ZM4 48.4866H300V47.4866H4V48.4866ZM300 46.2728H4V45.2728H300V46.2728ZM4 50.7014H300V49.7014H4V50.7014ZM300 52.9162H4V51.9162H300V52.9162ZM4 55.131H300V54.131H4V55.131ZM300 59.5601H4V58.5601H300V59.5601ZM4 57.3453H300V56.3453H4V57.3453ZM300 61.774H4V60.774H300V61.774ZM4 63.9893H300V62.9893H4V63.9893ZM300 66.2036H4V65.2036H300V66.2036ZM4 70.6327H300V69.6327H4V70.6327ZM300 68.4174H4V67.4174H300V68.4174ZM4 72.8471H300V71.8471H4V72.8471ZM300 75.0619H4V74.0619H300V75.0619ZM4 77.2762H300V76.2762H4V77.2762ZM300 81.7048H4V80.7048H300V81.7048ZM4 79.491H300V78.491H4V79.491ZM300 83.9196H4V82.9196H300V83.9196ZM4 86.1349H300V85.1349H4V86.1349ZM300 88.3493H4V87.3493H300V88.3493ZM4 92.7779H300V91.7779H4V92.7779ZM300 90.5636H4V89.5636H300V90.5636ZM4 94.9922H300V93.9922H4V94.9922ZM300 97.2066H4V96.2066H300V97.2066ZM4 99.4223H300V98.4223H4V99.4223ZM300 103.851H4V102.851H300V103.851ZM4 101.637H300V100.637H4V101.637ZM300 106.065H4V105.065H300V106.065ZM4 108.281H300V107.281H4V108.281ZM300 110.494H4V109.494H300V110.494ZM4 114.924H300V113.924H4V114.924ZM300 112.709H4V111.709H300V112.709ZM4 117.138H300V116.138H4V117.138ZM300 119.353H4V118.353H300V119.353ZM4 121.567H300V120.567H4V121.567ZM300 125.996H4V124.996H300V125.996ZM4 123.782H300V122.782H4V123.782ZM300 128.211H4V127.211H300V128.211ZM4 130.425H300V129.425H4V130.425ZM300 132.641H4V131.641H300V132.641ZM4 137.069H300V136.069H4V137.069ZM300 134.855H4V133.855H300V134.855ZM4 139.284H300V138.284H4V139.284ZM300 141.498H4V140.498H300V141.498ZM4 143.713H300V142.713H4V143.713ZM300 148.142H4V147.142H300V148.142ZM4 145.927H300V144.927H4V145.927ZM300 150.356H4V149.356H300V150.356ZM4 152.571H300V151.571H4V152.571ZM300 154.786H4V153.786H300V154.786ZM4 157H300V156H4V157Z"
          fill="url(#paint1_linear_15659_10363)"
        />
        <defs>
          <filter
            id="filter0_f_15659_10363"
            x="0.601562"
            y="3"
            width="302.789"
            height="152"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_15659_10363" />
          </filter>
          <linearGradient
            id="paint0_linear_15659_10363"
            x1="156.491"
            y1="33"
            x2="156.491"
            y2="150.556"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.789474" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_15659_10363"
            x1="300"
            y1="79.544"
            x2="4"
            y2="79.544"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0C0D0D" stopOpacity="0" />
            <stop offset="0.513954" stopColor="#0C0D0D" />
            <stop offset="1" stopColor="#0C0D0D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ) : (
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
    )}
    <motion.span
      className="absolute block h-[2px] w-full bg-button-overlay bg-blend-overlay"
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
  animationSize = 'xs',
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
      <LinesIllustration color={animationColor} size={animationSize} />
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
  animationSize: PropTypes.oneOf(['xs', 'sm']),
  animationColor: PropTypes.string,
  isAnimated: PropTypes.bool,
};

export default Button;
