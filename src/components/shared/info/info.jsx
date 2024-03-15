import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import tooltipHoveredSvg from 'icons/tooltip-hovered.svg';
import tooltipSvg from 'icons/tooltip.svg';

const Info = ({ className, ...attrs }) => (
  <span className={clsx('group/info relative', className)} {...attrs}>
    <Image
      className="transition-opacity duration-200 group-hover/info:opacity-0"
      src={tooltipSvg}
      width={14}
      height={14}
      alt=""
      loading="lazy"
    />
    <Image
      className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/info:opacity-100"
      src={tooltipHoveredSvg}
      width={14}
      height={14}
      alt=""
      loading="lazy"
    />
  </span>
);

Info.propTypes = {
  className: PropTypes.string,
};

export default Info;
