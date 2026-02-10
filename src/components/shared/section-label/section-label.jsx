import clsx from 'clsx';
import PropTypes from 'prop-types';

import LabelArrow from 'icons/arrow-label.inline.svg';

const SectionLabel = ({ className = '', children }) => (
  <div className={clsx('flex h-[14px] items-end gap-2 md:h-[10px] md:gap-[6px]', className)}>
    <LabelArrow
      aria-hidden="true"
      focusable="false"
      className="block h-[14px] w-[12px] flex-none text-[#FF3621] md:h-[10px] md:w-[10px]"
    />
    <span className="font-mono text-[12px] font-medium uppercase leading-none text-gray-new-80 md:text-[10px]">
      {children}
    </span>
  </div>
);

SectionLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
