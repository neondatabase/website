'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import getNodeText from 'utils/get-node-text';
import sendGtagEvent from 'utils/send-gtag-event';

const styles = {
  base: 'inline-flex items-center justify-center font-bold !leading-none text-center whitespace-nowrap rounded-full transition-colors duration-200 outline-none',
  size: {
    lg: 'text-base h-12 px-[54px] lg:h-11 lg:px-11 lg:text-sm',
    md: 't-2xl py-7 px-11 2xl:py-[26px] xl:py-[21px] xl:px-9 md:py-5 md:px-8',
    'new-md': 't-base py-[11px] px-[26px]',
    'new-md-2':
      'text-base px-9 h-12 font-medium tracking-tighter lg:h-11 lg:px-11 xs:h-10 xs:text-sm',
    sm: 't-xl py-[26px] px-11 2xl:py-[21px] 2xl:px-9 xl:py-5 xl:px-8',
    xs: 't-base py-[14px] px-[26px]',
    xxs: 'h-8 px-4 text-sm tracking-extra-tight',
  },
  theme: {
    primary: 'bg-primary-1 text-black hover:bg-[#00e5bf]',
    secondary: 'bg-black text-white hover:bg-[#292929] disabled:bg-[#292929]',
    tertiary: 'bg-transparent text-white border border-white hover:border-primary-2',
    quaternary: 'bg-white text-black border border-black hover:border-primary-2',
    'white-filled': 'bg-white text-black hover:bg-gray-6',
    'white-outline': 'bg-transparent text-white border border-white hover:border-primary-2',
    'black-outline': 'bg-transparent text-white border border-[#2E3038] hover:border-primary-2',
    'gray-2-outline': 'bg-gray-2 border border-gray-3 text-white hover:border-white',
    'gray-outline':
      'text-black border-gray-new-90 bg-gray-new-98 dark:bg-transparent dark:text-white border dark:border-gray-new-30 dark:hover:border-white hover:border-gray-new-70',
    'gray-dark-outline': 'bg-gray-new-10 text-white border border-[#37393D] hover:border-white',
    'gray-dark-outline-black':
      'text-black border border-gray-new-90 bg-gray-new-98 hover:border-gray-new-70 dark:text-white dark:bg-gray-new-10 dark:border-[#37393D] dark:hover:border-white',
    'green-outline':
      'bg-[#0D0D0D] text-white border transition-shadow duration-500 border-green-45 hover:shadow-[0px_8px_30px_0px_rgba(0,229,153,.16)]',
    'green-underlined':
      'underline decoration-green-45/40 hover:decoration-green-45/100 text-green-45 transition-colors duration-500',
    blue: 'bg-blue-80 text-black hover:bg-[#C6EAF1]',
    'gray-10': 'bg-gray-new-10 text-white hover:bg-gray-new-20',
    'gray-15': 'bg-gray-new-15 text-white hover:bg-gray-new-20',
    'gray-94-filled': 'bg-gray-new-94 text-black hover:bg-gray-6',
    'gray-15-outline':
      'border bg-transparent border-gray-new-15 text-white hover:border-gray-new-30',
    'with-icon':
      'pl-[4.1rem] xl:pl-[4.25rem] lg:pl-[4.25rem] bg-green-45 text-black hover:bg-[#00e5bf]',
  },
};

const Button = ({
  className: additionalClassName = null,
  to = null,
  size = null,
  theme = null,
  tag_name = null,
  children,
  ...otherProps
}) => {
  const className = clsx(styles.base, styles.size[size], styles.theme[theme], additionalClassName);

  const Tag = to ? Link : 'button';

  return (
    <Tag
      className={className}
      to={to}
      onClick={() => {
        sendGtagEvent('Button Clicked', {
          style: theme,
          text: getNodeText(children),
          tag_name,
        });
      }}
      {...otherProps}
    >
      {children}
    </Tag>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)),
  theme: PropTypes.oneOf(Object.keys(styles.theme)),
  children: PropTypes.node.isRequired,
  tag_name: PropTypes.string,
};

export default Button;
