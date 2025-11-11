import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import triangleIcon from 'icons/home-new/triangle.svg';

const themeClassName = {
  white: 'text-gray-new-80',
  black: 'text-gray-new-20',
};

const HeadingLabel = ({ className, theme = 'white', children }) => (
  <span
    className={clsx(
      'flex w-fit items-center gap-x-2 font-mono text-[12px] font-medium uppercase leading-none',
      themeClassName[theme],
      className
    )}
  >
    <Image src={triangleIcon} width={12} height={14} alt="" />
    {children}
  </span>
);

HeadingLabel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
  children: PropTypes.node.isRequired,
};

export default HeadingLabel;
