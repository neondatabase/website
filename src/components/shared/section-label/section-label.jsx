import clsx from 'clsx';
import PropTypes from 'prop-types';

import LabelArrow from 'icons/arrow-label.inline.svg';

const SectionLabel = ({ className = '', children }) => (
  <div className={clsx('flex h-3.5 items-end gap-2 md:h-2.5 md:gap-1.5', className)}>
    <LabelArrow
      aria-hidden="true"
      focusable="false"
      className="block h-3.5 w-3 flex-none text-[#FF3621] md:h-2.5 md:w-2.5"
    />
    <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-80 md:text-[10px]">
      {children}
    </span>
  </div>
);

SectionLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
