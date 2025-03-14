'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import useWindowSize from 'hooks/use-window-size';

const Tooltip = ({
  id = null,
  arrowColor = '#161928',
  place = 'right',
  className = null,
  offset = 10,
  anchorSelect = null,
  ...rest
}) => {
  const { width } = useWindowSize();
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  if (isTooltipVisible) {
    return createPortal(
      <ReactTooltip
        className={clsx('z-[9999] sm:max-w-[80vw]', className)}
        arrowColor={arrowColor}
        id={id}
        place={width < 640 ? 'top-center' : place}
        effect="solid"
        type="dark"
        offset={offset}
        anchorSelect={anchorSelect}
        opacity={1}
        multiline
        {...rest}
      />,
      document.body
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
