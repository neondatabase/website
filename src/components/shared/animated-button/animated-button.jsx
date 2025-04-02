'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useState, useMemo } from 'react';

import Link from 'components/shared/link';
import getNodeText from 'utils/get-node-text';
import sendGtagEvent from 'utils/send-gtag-event';

const styles = {
  base: 'inline-flex items-center justify-center font-bold !leading-none text-center whitespace-nowrap rounded-full transition-colors duration-200 outline-none',
  size: {
    lg: 'text-lg py-[17px] px-11 2xl:py-4 2xl:px-9',
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

const CURSOR_OFFSET = 13;

const AnimatedButton = ({
  className: additionalClassName = null,
  to = null,
  isAnimated = false,
  animationColor = '#00E599',
  size = null,
  tagName = null,
  theme,
  children,
  linesOffsetTop = 28,
  linesOffsetSide = 34,
  linesOffsetBottom = 46,
  ...otherProps
}) => {
  const [cursorAnimationVariant, setCursorAnimationVariant] = useState('default');
  const [mouseXPosition, setMouseXPosition] = useState(0);
  const [mouseYPosition, setMouseYPosition] = useState(0);
  const buttonRef = useRef(null);

  const cursorBlurVariants = useMemo(
    () => ({
      default: {
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
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
      setMouseXPosition(event.clientX - left - CURSOR_OFFSET);
    }

    if (event.clientY !== null) {
      setMouseYPosition(event.clientY - top - CURSOR_OFFSET);
    }
  };

  const handleMouseEnter = () => {
    setCursorAnimationVariant('blur');
  };

  const handleMouseLeave = () => {
    setCursorAnimationVariant('default');
  };

  const className = clsx(styles.base, styles.size[size], styles.theme[theme], additionalClassName);

  const cssProperties = {
    '--color': animationColor,
    '--top': `${linesOffsetTop}px`,
    '--side': `${linesOffsetSide}px`,
    '--bottom': `${linesOffsetBottom}px`,
  };

  const Tag = to ? Link : 'button';

  return isAnimated ? (
    <Tag
      className={clsx('animated-button', className)}
      style={cssProperties}
      to={to}
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        sendGtagEvent('Button Clicked', {
          style: 'Animated',
          text: getNodeText(children),
          tagName,
        });
      }}
      {...otherProps}
    >
      <LazyMotion features={domAnimation}>
        <m.span
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

        <m.span className="-z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden>
          <span className="top" />
          <span className="bottom" />
          <span className="line" />
        </m.span>
      </LazyMotion>
      <span className="content">{children}</span>
    </Tag>
  ) : (
    <Tag className={className} style={cssProperties} to={to} {...otherProps}>
      {children}
    </Tag>
  );
};

AnimatedButton.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)),
  tagName: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(styles.theme)).isRequired,
  children: PropTypes.node.isRequired,
  animationColor: PropTypes.string,
  isAnimated: PropTypes.bool,
  linesOffsetTop: PropTypes.number,
  linesOffsetSide: PropTypes.number,
  linesOffsetBottom: PropTypes.number,
};

export default AnimatedButton;
