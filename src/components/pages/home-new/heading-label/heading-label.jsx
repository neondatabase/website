import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import triangleIcon from 'icons/home-new/triangle.svg';

const HeadingLabel = ({ className = '', children }) => (
  <span
    className={clsx(
      'flex w-fit items-center gap-x-2 font-mono text-[12px] font-medium uppercase leading-none text-gray-new-80',
      className
    )}
  >
    <Image src={triangleIcon} width={12} height={14} alt="" />
    {children}
  </span>
);

HeadingLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default HeadingLabel;
