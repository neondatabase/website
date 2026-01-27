import Image from 'next/image';
import PropTypes from 'prop-types';

import arrowUpRightIcon from 'icons/arrow-up-right.svg';

const SectionLabel = ({ children }) => (
  <div className="flex items-end gap-2">
    <Image
      src={arrowUpRightIcon}
      alt=""
      width={12}
      height={14}
      aria-hidden="true"
      className="text-gray-new-20"
    />
    <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-20">
      {children}
    </span>
  </div>
);

SectionLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionLabel;
