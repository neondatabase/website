'use client';

import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import Tooltip from 'components/shared/tooltip';
import ExternalIcon from 'icons/external.inline.svg';
import { cn } from 'utils/cn';

const LINK_CLASS_NAME =
  'inline-flex items-center gap-1 text-gray-new-50 transition-colors duration-200 hover:text-gray-new-30 focus-visible:outline-primary-2 dark:text-gray-new-60 dark:hover:text-gray-new-80';

const TOOLTIP_CLASS_NAME =
  'max-w-[496px]! border-gray-new-30! bg-gray-new-8! px-3.5! pt-2.5! pb-3! text-[13px]! leading-[1.375]! tracking-normal! text-gray-new-80! shadow-none!';

const labelVariantClassNames = {
  mono: 'font-mono',
  text: 'font-sans',
};

const ApiAiContextLink = ({
  to,
  tooltipId,
  tooltipDescription,
  tooltipLabel = null,
  tooltipLabelVariant = 'text',
}) => (
  <span className="inline-flex">
    <Link
      className={LINK_CLASS_NAME}
      to={to}
      data-tooltip-id={tooltipId}
      aria-describedby={tooltipId}
    >
      Markdown for AI context
      <ExternalIcon className="size-3" />
    </Link>

    <Tooltip
      id={tooltipId}
      place="top"
      offset={10}
      noArrow={false}
      arrowColor="#131415"
      border="1px solid #494B50"
      className={TOOLTIP_CLASS_NAME}
    >
      {tooltipLabel && (
        <span
          className={cn(
            'text-[13px] leading-[1.375] tracking-normal break-words text-gray-new-80',
            labelVariantClassNames[tooltipLabelVariant]
          )}
        >
          {tooltipLabel}:{' '}
        </span>
      )}
      <span className="font-sans text-[13px] leading-[1.375] tracking-normal break-words text-gray-new-80">
        {tooltipDescription}
      </span>
    </Tooltip>
  </span>
);

ApiAiContextLink.propTypes = {
  to: PropTypes.string.isRequired,
  tooltipId: PropTypes.string.isRequired,
  tooltipDescription: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string,
  tooltipLabelVariant: PropTypes.oneOf(Object.keys(labelVariantClassNames)),
};

export default ApiAiContextLink;
