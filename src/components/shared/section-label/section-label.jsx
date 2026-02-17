import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import databricksIcon from 'icons/home/databricks.svg';
import triangleIcon from 'icons/triangle.svg';

const themeClassName = {
  white: 'text-gray-new-80',
  black: 'text-gray-new-20',
};

const sizeClassName = {
  regular: 'text-xs sm:text-[10px]',
  large: 'text-[13px] sm:text-[10px]',
};

const SectionLabel = ({
  className,
  theme = 'black',
  size = 'regular',
  databricks = false,
  children,
}) => (
  <div className={clsx('flex items-end gap-2 sm:gap-1.5', themeClassName[theme], className)}>
    {databricks ? (
      <Image
        className="sm:size-2.5"
        src={databricksIcon}
        width={20}
        height={20}
        alt="Databricks logo"
      />
    ) : (
      <Image
        src={triangleIcon}
        alt=""
        width={12}
        height={14}
        aria-hidden="true"
        className="sm:h-2.5 sm:w-2.5"
      />
    )}
    <span className={clsx('font-mono font-medium uppercase leading-none', sizeClassName[size])}>
      {children}
    </span>
  </div>
);

SectionLabel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
  size: PropTypes.oneOf(Object.keys(sizeClassName)),
  databricks: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
