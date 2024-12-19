import PropTypes from 'prop-types';

import PauseableVideo from 'components/shared/pauseable-video';

/* 
  Recommended video omtimization parameters:
  mp4: -pix_fmt yuv420p -vf scale={width}:-2 -movflags faststart -vcodec libx264 -crf 20
  webm: -c:v libvpx-vp9 -crf 20 -vf scale={width}:-2 -deadline best -an
*/
const Video = ({ sources, width, height }) => (
  <PauseableVideo width={width} height={height}>
    {sources.map(({ src, type }) => (
      <source key={src} src={src} type={type} />
    ))}
  </PauseableVideo>
);

Video.propTypes = {
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Video;
