import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Tooltip from 'components/shared/tooltip';
import tooltipHoveredSvg from 'icons/tooltip-hovered.svg';
import tooltipSvg from 'icons/tooltip.svg';

const InfoIcon = ({ className, tooltip, tooltipId, tooltipPlace = 'right' }) => (
  <span
    className={clsx('group/info relative', className)}
    data-tooltip-id={`info-icon-${tooltipId}`}
    data-tooltip-html={tooltip}
    aria-hidden
  >
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
    <Tooltip
      className="w-sm z-20 !bg-gray-new-15"
      id={`info-icon-${tooltipId}`}
      place={tooltipPlace}
      arrowColor="#242628"
    />
  </span>
);

InfoIcon.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  tooltipId: PropTypes.string.isRequired,
  tooltipPlace: PropTypes.string,
};

export default InfoIcon;
