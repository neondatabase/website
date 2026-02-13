import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import triangleIcon from 'icons/triangle.svg';

const Label = ({ className, children }) => (
  <span
    className={clsx(
      'flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase leading-none text-gray-new-80',
      className
    )}
  >
    <Image src={triangleIcon} width={12} height={14} alt="" />
    {children}
  </span>
);

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Label;
