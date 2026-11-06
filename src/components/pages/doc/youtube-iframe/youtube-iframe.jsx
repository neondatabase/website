import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const YoutubeIframe = ({
  embedId,
  className,
  isDocPost = true,
  autoplay = false,
  muted = false,
  controls = true,
}) => {
  const params = new URLSearchParams();

  if (autoplay) {
    params.set('autoplay', '1');
    params.set('playsinline', '1');
  }

  if (muted) {
    params.set('mute', '1');
  }

  if (!controls) {
    params.set('controls', '0');
  }

  const query = params.toString();
  const src = `https://www.youtube.com/embed/${embedId}${query ? `?${query}` : ''}`;

  return (
    <figure
      className={cn(
        'relative h-0 overflow-hidden pb-[56.25%]',
        className,
        isDocPost && 'not-prose my-8'
      )}
    >
      <iframe
        className="absolute top-0 left-0 my-0! h-full w-full"
        width="796"
        height="447"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Embedded YouTube"
        allowFullScreen
      />
    </figure>
  );
};

YoutubeIframe.propTypes = {
  className: PropTypes.string,
  embedId: PropTypes.string.isRequired,
  isDocPost: PropTypes.bool,
  autoplay: PropTypes.bool,
  muted: PropTypes.bool,
  controls: PropTypes.bool,
};

export default YoutubeIframe;
