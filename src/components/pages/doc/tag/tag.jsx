import clsx from 'clsx';
import PropTypes from 'prop-types';

const themes = {
  new: 'text-[#00B87B] dark:text-green-45 bg-[#00B87B]/10 dark:bg-green-45/10',
  beta: 'text-[#E9943E] dark:text-yellow-70 bg-[#E9943E]/10 dark:bg-yellow-70/10',
  'coming soon': 'text-[#7A69CA] dark:text-purple-70 bg-[#7A69CA]/10 dark:bg-purple-70/10',
  deprecated: 'text-[#1897DF] dark:text-blue-80 bg-[#1897DF]/10 dark:bg-blue-80/10',
  default: 'text-gray-new-50 dark:text-gray-new-80 bg-gray-new-50/10 dark:bg-gray-new-80/10',
};

const sizes = {
  sm: 'px-2 py-1 text-[8px]',
  md: 'px-3.5 py-2 text-[10px]',
};

const Tag = ({ className, label, size }) => (
  <span
    className={clsx(
      'block w-fit whitespace-nowrap rounded-[40px] font-semibold uppercase leading-none',
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
