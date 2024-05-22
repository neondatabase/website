'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import 'styles/image-zoom.css';

const ImageZoom = ({ src, isDark, children }) => (
  <Zoom
    classDialog={clsx('zoom-modal', isDark && 'dark')}
    zoomImg={{ src }}
    zoomMargin={16}
    wrapElement="span"
  >
    {children}
  </Zoom>
);

ImageZoom.propTypes = {
  src: PropTypes.string.isRequired,
  isDark: PropTypes.bool,
  children: PropTypes.node,
};

export default ImageZoom;
