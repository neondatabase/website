import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import databricksIcon from 'icons/home/databricks.svg';
import triangleIcon from 'icons/home/triangle.svg';

const themeClassName = {
  white: 'text-gray-new-80',
  black: 'text-gray-new-20',
};
const sizes = {
  regular: 'text-xs sm:text-[10px]',
  large: 'text-sm sm:text-[10px]',
};

const HeadingLabel = ({
  className,
  theme = 'white',
  databricks = false,
  size = 'regular',
  children,
}) => (
  <span
    className={clsx(
      'flex w-fit items-center gap-2 font-mono font-medium uppercase leading-none',
      'sm:gap-1.5',
      themeClassName[theme],
      className,
      sizes[size]
    )}
  >
    {databricks ? (
      <Image
        className="sm:size-2.5"
        src={databricksIcon}
        width={22}
        height={22}
        alt="Databricks logo"
      />
    ) : (
      <Image className="sm:size-2.5" src={triangleIcon} width={12} height={14} alt="" />
    )}
    {children}
  </span>
);

HeadingLabel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
  databricks: PropTypes.bool,
  size: PropTypes.oneOf(Object.keys(sizes)),
  children: PropTypes.node.isRequired,
};

export default HeadingLabel;
