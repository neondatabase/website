'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useId } from 'react';

// TODO: rename once we get better understanding of all possible styles
const spreadStyles = {
  1: 'mt-[4%] h-[130px] w-[105%]',
  2: '-mt-[2%] h-[130px] w-[110%]',
  3: 'mt-[2%] h-[130px] w-[103%]',
  4: 'mt-0 h-[130px] w-[100%]',
  5: 'mt-0 h-[123px] w-[103%]',
};

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

LinesIllustration.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  spread: PropTypes.oneOf([1, 2, 3, 4, 5]),
};

export default LinesIllustration;
