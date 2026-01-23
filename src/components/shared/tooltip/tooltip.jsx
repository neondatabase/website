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
        className={clsx(
          'z-[9999] sm:max-w-[80vw]',
          '!border !border-gray-new-30 !bg-gray-new-8',
          '!px-4 !py-3',
          '!shadow-[0px_4px_30px_0px_rgba(0,0,0,0.8)]',
          '!text-[15px] !leading-snug !tracking-tighter !text-gray-new-80',
          '[&_a:hover]:border-gray-new-70 [&_a]:transition-colors [&_a]:duration-200 [&_a]:hover:text-gray-new-80',
          '!rounded-none',
          className
        )}
        id={id}
        place={width < 640 ? 'top-center' : place}
        effect="solid"
        type="dark"
        offset={offset}
        anchorSelect={anchorSelect}
        opacity={1}
        multiline
        noArrow
        {...rest}
      />,
      document.body
    );
  }

  return null;
};

Tooltip.propTypes = {
  id: PropTypes.string,
  place: PropTypes.string,
  className: PropTypes.string,
  offset: PropTypes.shape({}),
  anchorSelect: PropTypes.string,
};

export default Tooltip;
