import clsx from 'clsx';
import PropTypes from 'prop-types';

const Label = ({ className = '', children }) => (
  <span className={clsx('flex h-[14px] max-h-[14px] items-end gap-2 overflow-hidden ', className)}>
    <svg
      aria-hidden="true"
      viewBox="0 0 12 14"
      className="block h-[14px] w-[12px] flex-none text-[#FF3621]"
      focusable="false"
    >
      <path d="M12 7L3 12.1962L3 1.80385L12 7Z" fill="currentColor" />
    </svg>

    <span className="font-mono text-[12px] font-medium uppercase leading-none text-gray-new-80">
      {children}
    </span>
  </span>
);

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Label;
