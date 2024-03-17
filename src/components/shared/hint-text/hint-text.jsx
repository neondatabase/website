import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tooltip from 'components/shared/tooltip';

const HintText = ({
  className,
  text,
  tooltip = null,
  tooltipId = null,
  tooltipPlace = 'top-center',
  greenHighlight = false,
}) => {
  if (!text.includes('*') || !tooltip) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {text.split('*').map((part, index) => {
        if (index !== 1) return part;
        return (
          <strong
            className={clsx(
              'relative font-medium',
              'after:absolute after:inset-x-0 after:-bottom-0.5 after:border-b after:border-dashed',
              !greenHighlight && 'text-white after:border-gray-new-90',
              greenHighlight && 'text-green-45 after:border-green-45'
            )}
            data-tooltip-id={`hint-text-${tooltipId}`}
            data-tooltip-html={tooltip}
          >
            {part}
          </strong>
        );
      })}

      <Tooltip
        className="w-sm z-20 !bg-gray-new-15"
        id={`hint-text-${tooltipId}`}
        positionStrategy="fixed"
        place={tooltipPlace}
        arrowColor="#242628"
        visible
      />
    </span>
  );
};

HintText.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltipPlace: PropTypes.string,
  greenHighlight: PropTypes.bool,
};

export default HintText;
