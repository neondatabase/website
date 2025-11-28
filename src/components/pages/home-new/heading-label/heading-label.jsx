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
      'flex w-fit items-center gap-2 font-mono-new text-xs font-medium uppercase leading-none',
      'sm:gap-1.5 sm:text-[10px]',
      themeClassName[theme],
      className
    )}
  >
    <Image className="sm:size-2.5" src={triangleIcon} width={12} height={14} alt="" />
    {children}
  </span>
);

HeadingLabel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
  children: PropTypes.node.isRequired,
};

export default HeadingLabel;
