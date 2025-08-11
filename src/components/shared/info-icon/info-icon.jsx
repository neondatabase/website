import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Tooltip from 'components/shared/tooltip';
import tooltipHoveredSvg from 'icons/tooltip-hovered.svg';
import tooltipSvg from 'icons/tooltip.svg';

function getTooltipHtml(info, link) {
  if (!link) return info;

  const safeText = link.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const linkHTML = `
    <a
      class="border-b pb-0.5 tracking-extra-tight leading-none transition-colors duration-200 hover:border-primary-1 hover:text-primary-1 mt-2 inline-block"
      href="${link.href}"
    >
      ${safeText}
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
  toggleOnClick = false,
}) => (
  <span
    {...(toggleOnClick && { tabIndex: 0 })}
    className={clsx(
      'group/info relative outline-none',
      toggleOnClick && 'cursor-pointer',
      className
    )}
    data-tooltip-id={`info-icon-${tooltipId}`}
    data-tooltip-html={getTooltipHtml(tooltip, link)}
    aria-hidden
  >
    <Image
      className="transition-opacity duration-200 group-hover/info:opacity-0 group-focus/info:opacity-0"
      src={tooltipSvg}
      width={14}
      height={14}
      alt=""
      loading="lazy"
    />
    <Image
      className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/info:opacity-100 group-focus/info:opacity-100"
      src={tooltipHoveredSvg}
      width={14}
      height={14}
      alt=""
      loading="lazy"
    />
    <Tooltip
      className={clsx('w-sm z-20 !bg-gray-new-15', toggleOnClick && '!pointer-events-auto')}
      id={`info-icon-${tooltipId}`}
      place={tooltipPlace}
      arrowColor="#242628"
      {...(toggleOnClick && {
        openOnClick: true,
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
  toggleOnClick: PropTypes.bool,
};

export default InfoIcon;
