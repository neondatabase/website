import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const YoutubeIframe = ({ embedId, className, isDocPost = true }) => (
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
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      title="Embedded YouTube"
      allowFullScreen
    />
  </figure>
);

YoutubeIframe.propTypes = {
  className: PropTypes.string,
  embedId: PropTypes.string.isRequired,
  isDocPost: PropTypes.bool,
};

export default YoutubeIframe;
