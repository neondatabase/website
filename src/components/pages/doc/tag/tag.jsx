import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const themes = {
  new: 'text-[#00B87B] dark:text-green-45 bg-[#00B87B]/10 dark:bg-green-45/10',
  beta: 'text-blue-70 bg-blue-70/14 dark:text-[#94B5F7] dark:bg-[#94B5F7]/14',
  'coming soon':
    'text-[#92400E] dark:text-[#FCD34D] bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#FDE68A] dark:border-[#92400E]/50',
  deprecated: 'text-[#EC6F09] bg-[#EC6F09]/14 dark:text-[#F99D51] dark:bg-[#F99D51]/14',
  'private preview':
    'text-gray-new-30 bg-gray-new-90 font-mono dark:text-gray-new-70 dark:bg-gray-new-15',
  default: 'text-gray-new-50 dark:text-gray-new-80 bg-gray-new-50/10 dark:bg-gray-new-80/10',
};

const sizes = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2 py-1 text-[8px]',
  md: 'px-3.5 py-2 text-[10px]',
};

const Tag = ({ className, label, size }) => (
  <span
    className={cn(
      'block w-fit rounded-[40px] leading-none font-semibold whitespace-nowrap uppercase',
      themes?.[label] || themes.default,
      sizes?.[size] || sizes.md,
      className
    )}
  >
    {label}
  </span>
);

Tag.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default Tag;
