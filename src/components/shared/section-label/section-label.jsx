import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import LabelArrow from 'icons/arrow-label.inline.svg';
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
  className = '',
  theme = 'black',
  size = 'regular',
  variant = 'default',
  icon = 'triangle',
  databricks = false,
  children,
}) => {
  const isDenseVariant = variant === 'dense';
  let iconNode;

  if (databricks) {
    iconNode = (
      <Image
        className="relative translate-y-[3px] sm:size-2.5"
        src={databricksIcon}
        width={20}
        height={20}
        alt="Databricks logo"
      />
    );
  } else if (icon === 'arrow') {
    iconNode = (
      <LabelArrow
        aria-hidden="true"
        focusable="false"
        className={clsx(
          'block h-3.5 w-3 flex-none text-[#FF3621]',
          isDenseVariant ? 'md:h-2.5 md:w-2.5' : 'sm:h-2.5 sm:w-2.5'
        )}
      />
    );
  } else {
    iconNode = (
      <Image
        src={triangleIcon}
        alt=""
        width={12}
        height={14}
        aria-hidden="true"
        className={isDenseVariant ? 'md:h-2.5 md:w-2.5' : 'sm:h-2.5 sm:w-2.5'}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex',
        isDenseVariant ? 'h-3.5 items-end gap-2 md:h-2.5 md:gap-1.5' : 'items-end gap-2 sm:gap-1.5',
        !isDenseVariant && themeClassName[theme],
        className
      )}
    >
      {iconNode}
      <span
        className={clsx(
          'font-mono font-medium uppercase leading-none',
          isDenseVariant ? 'text-xs text-gray-new-80 md:text-[10px]' : sizeClassName[size]
        )}
      >
        {children}
      </span>
    </div>
  );
};

SectionLabel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
  size: PropTypes.oneOf(Object.keys(sizeClassName)),
  variant: PropTypes.oneOf(['default', 'dense']),
  icon: PropTypes.oneOf(['triangle', 'arrow']),
  databricks: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
