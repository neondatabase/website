import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import triangleIcon from 'icons/home-new/triangle.svg';

const HeadingLabel = ({ className = '', children }) => (
  <span
    className={clsx(
      'flex w-fit items-center gap-x-2 font-mono-new text-xs font-medium uppercase leading-none text-gray-new-80',
      'sm:gap-1.5 sm:text-[10px]',
      className
    )}
  >
    <Image className="sm:size-2.5" src={triangleIcon} width={12} height={14} alt="" />
    {children}
  </span>
);

HeadingLabel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default HeadingLabel;
