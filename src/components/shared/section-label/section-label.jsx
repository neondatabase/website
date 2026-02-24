import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import LabelArrow from 'icons/arrow-label.inline.svg';
import databricksIcon from 'icons/home/databricks.svg';

const themeClassName = {
  white: 'text-gray-new-80',
  black: 'text-gray-new-20',
};

const iconMap = {
  arrow: () => (
    <LabelArrow
      className="block h-3.5 w-3 flex-none text-[#FF3621] md:size-2.5"
      aria-hidden="true"
      focusable="false"
    />
  ),
  databricks: () => (
    <Image
      className="size-4 sm:size-2.5"
      src={databricksIcon}
      width={20}
      height={20}
      alt="Databricks logo"
    />
  ),
};

const SectionLabel = ({ className, theme = 'black', icon = 'arrow', children }) => {
  const IconRenderer = iconMap[icon];

  if (process.env.NODE_ENV !== 'production' && !IconRenderer) {
    throw new Error(
      `SectionLabel: unknown icon "${icon}". Valid values: ${Object.keys(iconMap).join(', ')}`
    );
  }

  if (!IconRenderer) return null;

  return (
    <div
      className={clsx(
        'flex h-3.5 gap-2 md:h-2.5 md:gap-1.5',
        icon === 'databricks' ? 'items-center' : 'items-end',
        themeClassName[theme],
        className
      )}
    >
      <IconRenderer />
      <span className="font-mono text-xs font-medium uppercase leading-none md:text-[10px]">
        {children}
      </span>
    </div>
  );
};

SectionLabel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeClassName)),
  icon: PropTypes.oneOf(Object.keys(iconMap)),
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
