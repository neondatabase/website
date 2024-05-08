'use client';

import PropTypes from 'prop-types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ImageZoom = ({ src, children }) => (
  <Zoom classDialog="zoom-modal" zoomImg={{ src }} zoomMargin={16}>
    {children}
  </Zoom>
);

ImageZoom.propTypes = {
  src: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ImageZoom;
