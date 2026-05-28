import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const themes = {
  new: 'text-[#00B87B] dark:text-green-45 bg-[#00B87B]/10 dark:bg-green-45/10',
  beta: 'text-[#E9943E] dark:text-yellow-70 bg-[#E9943E]/10 dark:bg-yellow-70/10',
  'coming soon':
    'text-[#92400E] dark:text-[#FCD34D] bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#FDE68A] dark:border-[#92400E]/50',
  deprecated: 'text-[#1897DF] dark:text-blue-80 bg-[#1897DF]/10 dark:bg-blue-80/10',
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
      className,
      themes?.[label] || themes.default,
      sizes?.[size] || sizes.md
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
