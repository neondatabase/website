'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ImageBlock = ({
  src,
  className,
  title,
  isReleaseNote,
  ...rest
}) => (
    <Zoom classDialog="zoom-modal" zoomImg={{ src }} zoomMargin={16}>
      <Image
        className={clsx(className, { 'no-border': title === 'no-border' })}
        src={src}
        width={isReleaseNote ? 762 : 796}
        height={isReleaseNote ? 428 : 447}
        style={{ width: '100%', height: '100%' }}
        title={title !== 'no-border' ? title : undefined}
        {...rest}
      />
    </Zoom>
  )

ImageBlock.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  isReleaseNote: PropTypes.bool,
};

export default ImageBlock;
