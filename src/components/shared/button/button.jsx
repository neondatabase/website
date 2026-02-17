'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Link from 'components/shared/link';
import getNodeText from 'utils/get-node-text';
import sendGtagEvent from 'utils/send-gtag-event';

const styles = {
  base: 'inline-flex cursor-pointer items-center justify-center !leading-none text-center whitespace-nowrap rounded-full transition-colors duration-200 outline-none',
  size: {
    lg: 'text-base h-12 px-[54px] lg:h-11 lg:px-11 lg:text-sm font-semibold',
    'lg-new':
      'text-base h-11 px-7 tracking-extra-tight xl:text-sm xl:px-[18px] xl:h-9 md:px-[14px]',
    md: 't-2xl py-7 px-11 2xl:py-[26px] xl:py-[21px] xl:px-9 md:py-5 md:px-8 font-semibold',
    'md-new': 'px-9 h-12 font-medium tracking-tighter lg:h-11 lg:px-11 xs:h-10 xs:text-sm',
    sm: 't-xl py-[26px] px-11 2xl:py-[21px] 2xl:px-9 xl:py-5 xl:px-8 font-semibold',
    'sm-new': 'h-[38px] px-7 tracking-extra-tight text-sm',
    xs: 't-base py-[14px] px-[26px] font-medium',
    xxs: 'h-8 px-4 text-sm tracking-extra-tight font-medium',
    new: 'h-11 px-7 tracking-extra-tight lg:h-9 lg:text-sm lg:px-[18px]',
  },
  theme: {
    primary: 'bg-primary-1 text-black hover:bg-[#00e5bf]',
    secondary: 'bg-black text-white hover:bg-[#292929] disabled:bg-[#292929]',
    'white-off-filled': 'bg-[#E4F1EB] text-gray-new-8',
    'white-filled': 'bg-white text-black hover:bg-gray-new-80',
    'white-filled-multi':
      'dark:bg-white dark:text-black hover:dark:bg-gray-new-80 bg-black-pure text-white hover:bg-gray-new-20',
    outlined:
      'bg-black-pure/0.02 text-black-pure border-gray-new-20 hover:border-black-pure dark:bg-white/0.02 border dark:border-gray-new-40 dark:text-white hover:dark:border-white',
    'outlined-new':
      'bg-black-pure/0.02 text-black-pure border-gray-new-20 hover:border-black-pure dark:bg-white/0.02 border dark:border-gray-new-40 dark:text-white hover:dark:border-white',
    'green-underlined':
      'underline decoration-green-45/40 hover:decoration-green-45/100 text-green-45 transition-colors duration-500',
    'green-filled': 'bg-green-52 text-black-pure hover:bg-code-green-2',
    blue: 'bg-blue-80 text-black hover:bg-[#C6EAF1]',
    'gray-10': 'bg-gray-new-10 text-white hover:bg-gray-new-20',
    'gray-20': 'bg-gray-new-20 text-white hover:bg-gray-new-40',
    'gray-94-filled': 'bg-gray-new-94 text-black hover:bg-gray-6',
    'with-icon':
      'pl-[4.1rem] xl:pl-[4.25rem] lg:pl-[4.25rem] bg-green-45 text-black hover:bg-[#00e5bf]',
    'red-filled': 'bg-[#F18484] text-black hover:bg-[#FBA8A8]',
    transparent:
      'bg-transparent text-black-pure hover:bg-gray-new-90 hover:dark:bg-gray-new-10 dark:text-white',
  },
};

const getCombinationStyles = (size, theme) => {
  if (size === 'new' && theme === 'white-filled') return 'font-medium';
  return null;
};

const Button = forwardRef(
  (
    {
      className: additionalClassName = null,
      to = null,
      size = null,
      theme = null,
      tagName = null,
      analyticsOnHover = false,
      handleClick = null,
      withArrow = false,
      children,
      ...otherProps
    },
    ref
  ) => {
    const className = clsx(
      styles.base,
      styles.size[size],
      styles.theme[theme],
      getCombinationStyles(size, theme),
      additionalClassName
    );

    const Tag = to || withArrow ? Link : 'button';

    const handleAnalytics = (eventType = 'clicked') => {
      if (!tagName) return;

      sendGtagEvent(`Button ${eventType}`, {
        style: theme,
        text: getNodeText(children),
        tag_name: tagName,
      });
    };

    return (
      <Tag
        ref={ref}
        className={className}
        to={to}
        {...(withArrow ? { withArrow } : {})}
        onClick={() => {
          if (handleClick) handleClick();
          handleAnalytics('clicked');
        }}
        onMouseEnter={analyticsOnHover ? () => handleAnalytics('hovered') : undefined}
        {...otherProps}
      >
        {children}
      </Tag>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)),
  theme: PropTypes.oneOf(Object.keys(styles.theme)),
  children: PropTypes.node.isRequired,
  tagName: PropTypes.string,
  analyticsOnHover: PropTypes.bool,
  handleClick: PropTypes.func,
  withArrow: PropTypes.bool,
};

export default Button;
