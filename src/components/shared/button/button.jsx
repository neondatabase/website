import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const styles = {
  base: 'inline-flex items-center justify-center font-bold !leading-none text-center whitespace-nowrap rounded-full transition-colors duration-200 outline-none',
  size: {
    md: 't-2xl py-7 px-11 2xl:py-[26px] xl:py-[21px] xl:px-9 md:py-5 md:px-8',
    sm: 't-xl py-[26px] px-11 2xl:py-[21px] 2xl:px-9 xl:py-5 xl:px-8',
    'new-md': 't-base py-[11px] px-[26px]',
    xs: 't-base py-[14px] px-[26px]',
    xxs: 'px-3 py-1.5 text-xs uppercase tracking-wider',
  },
  theme: {
    primary: 'bg-primary-1 text-black hover:bg-[#00e5bf]',
    secondary: 'bg-black text-white hover:bg-[#292929] disabled:bg-[#292929]',
    tertiary: 'bg-transparent text-white border border-white hover:border-primary-2',
    quaternary: 'bg-white text-black border border-black hover:border-primary-2',
    'white-outline': 'bg-transparent text-white border border-white hover:border-primary-2',
    'gray-outline': 'bg-transparent text-white border border-gray-new-30 hover:border-white',
    blue: 'bg-blue-80 text-black hover:bg-[#C6EAF1]',
  },
};

const Button = ({
  className: additionalClassName = null,
  to = null,
  size = null,
  theme = null,
  children,
  ...otherProps
}) => {
  const className = clsx(styles.base, styles.size[size], styles.theme[theme], additionalClassName);

  const Tag = to ? Link : 'button';

  return (
    <Tag className={className} to={to} {...otherProps}>
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
};

export default Button;
