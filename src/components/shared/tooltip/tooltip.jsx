'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Tooltip = ({
  id,
  arrowColor = '#161928',
  place = 'right',
  className = null,
  offset = 10,
}) => {
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  if (isTooltipVisible) {
    return (
      <ReactTooltip
        arrowColor={arrowColor}
        id={id}
        place={place}
        effect="solid"
        type="dark"
        className={className}
        offset={offset}
        multiline
      />
    );
  }
  return null;
};

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  arrowColor: PropTypes.string,
  place: PropTypes.string,
  className: PropTypes.string,
  offset: PropTypes.shape({}),
};

export default Tooltip;
