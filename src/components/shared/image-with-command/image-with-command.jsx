import Image from 'next/image';
import PropTypes from 'prop-types';

import CopyCommand from 'components/shared/copy-command';
import ImageZoom from 'components/shared/image-zoom';

const ImageWithCommand = ({ src, alt, width, height, description, command, loading = 'lazy' }) => (
  <figure className="not-prose my-8 overflow-hidden bg-black-pure">
    <ImageZoom src={src} isDark>
      <Image
        className="m-0 block h-auto w-full"
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 767px) 100vw, 708px"
        loading={loading}
        quality={100}
      />
    </ImageZoom>
    <figcaption className="flex items-center justify-between gap-5 border border-gray-new-30 bg-gray-new-8 p-5 sm:flex-col sm:items-stretch sm:gap-4 sm:p-4">
      <p className="m-0 text-base leading-snug tracking-tight text-white">{description}</p>
      <CopyCommand className="w-auto max-w-full min-w-3xs shrink-0 sm:w-full" command={command} />
    </figcaption>
  </figure>
);

ImageWithCommand.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
  loading: PropTypes.oneOf(['lazy', 'eager']),
};

export default ImageWithCommand;
