import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Tooltip from 'components/shared/tooltip';
import tooltipHoveredSvg from 'icons/tooltip-hovered.svg';
import tooltipSvg from 'icons/tooltip.svg';

function getTooltipHtml(info, link) {
  if (!link) return info;

  const linkHTML = `
    <a
      class="mt-1 inline-block w-fit border-b border-[rgba(228,229,231,0.5)] text-sm font-light leading-snug tracking-extra-tight transition-colors duration-200 hover:border-primary-1 hover:text-primary-1"
      href="${link.href}"
    >
      ${link.text}
    </a>
  `;

  return `${info}${linkHTML}`;
}

const InfoIcon = ({
  className,
  tooltip,
  link,
  tooltipId,
  tooltipPlace = 'right',
  clickable = false,
}) => (
  <span
    {...(clickable && { tabIndex: 0 })}
    className={clsx('group/info relative', clickable && 'cursor-pointer', className)}
    data-tooltip-id={`info-icon-${tooltipId}`}
    data-tooltip-html={getTooltipHtml(tooltip, link)}
    aria-hidden
  >
    <Image
      className="transition-opacity duration-200 group-hover/info:opacity-0 md:group-hover/info:opacity-100"
      src={tooltipSvg}
      width={14}
      height={14}
      alt=""
      loading="lazy"
    />
    <Image
      className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/info:opacity-100 md:group-hover/info:opacity-0"
      src={tooltipHoveredSvg}
      width={14}
      height={14}
      alt=""
      loading="lazy"
    />
    <Tooltip
      className={clsx('w-sm z-20 !rounded-lg !bg-gray-new-15 !px-4 !pb-[14px] !pt-3')}
      id={`info-icon-${tooltipId}`}
      place={tooltipPlace}
      arrowColor="#242628"
      {...(clickable && {
        clickable: true,
      })}
    />
  </span>
);

InfoIcon.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  link: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
  tooltipId: PropTypes.string.isRequired,
  tooltipPlace: PropTypes.string,
  clickable: PropTypes.bool,
};

export default InfoIcon;
