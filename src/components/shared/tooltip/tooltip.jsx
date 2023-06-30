'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Tooltip = ({
  id = null,
  arrowColor = '#161928',
  place = 'right',
  className = null,
  offset = 10,
  anchorSelect = null,
}) => {
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  if (isTooltipVisible) {
    return (
      <ReactTooltip
        className={className}
        arrowColor={arrowColor}
        id={id}
        place={place}
        effect="solid"
        type="dark"
        offset={offset}
        anchorSelect={anchorSelect}
        multiline
      />
    );
  }
  return null;
};

Tooltip.propTypes = {
  id: PropTypes.string,
  arrowColor: PropTypes.string,
  place: PropTypes.string,
  className: PropTypes.string,
  offset: PropTypes.shape({}),
  anchorSelect: PropTypes.string,
};

export default Tooltip;
