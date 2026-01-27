import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import triangleIcon from 'icons/triangle.svg';

const SectionLabel = ({ className, children }) => (
  <div className={clsx('flex items-end gap-2 text-gray-new-20', className)}>
    <Image src={triangleIcon} alt="" width={12} height={14} aria-hidden="true" />
    <span className="font-mono text-xs font-medium uppercase leading-none">{children}</span>
  </div>
);

SectionLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
