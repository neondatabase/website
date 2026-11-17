import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const YoutubeIframe = ({
  embedId,
  className,
  isDocPost = true,
  autoplay = false,
  muted = false,
  controls = true,
  title = 'YouTube video',
  start,
}) => {
  const embedUrl = new URL(`https://www.youtube.com/embed/${embedId}`);
  const params = embedUrl.searchParams;

  if (start !== undefined) params.set('start', String(start));

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
        src={embedUrl.toString()}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={title}
        loading={autoplay ? 'eager' : 'lazy'}
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
  title: PropTypes.string,
  start: PropTypes.number,
};

export default YoutubeIframe;
