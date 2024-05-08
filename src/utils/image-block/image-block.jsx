'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ImageBlock = ({ src, className, width, height, alt, isPriority }) => {
  const urlWithoutSize = src.replace(/-\d+x\d+/i, '');

  return (
    <Zoom classDialog="zoom-modal" zoomImg={{ src }} zoomMargin={16}>
      <Image
        className={clsx('rounded-md', className)}
        src={urlWithoutSize}
        width={width || 975}
        height={height || 512}
        quality={85}
        alt={alt || 'Post image'}
        priority={isPriority || false}
        sizes="(max-width: 767px) 100vw"
      />
    </Zoom>
  );
}

ImageBlock.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
  isPriority: PropTypes.bool,
};

export default ImageBlock;
