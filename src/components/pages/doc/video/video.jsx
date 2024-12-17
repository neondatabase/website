import PropTypes from 'prop-types';

import PauseableVideo from 'components/shared/pauseable-video';

const Video = ({ name, width, height }) => (
  /* 
    Video omtimization parameters:
    mp4: -pix_fmt yuv420p -vf scale={width}:-2 -movflags faststart -vcodec libx264 -crf 20
    webm: -c:v libvpx-vp9 -crf 20 -vf scale={width}:-2 -deadline best -an
  */
  <PauseableVideo
    className="mb-14 lg:mb-12 md:mb-10 sm:mb-8"
    videoClassName="!m-0 !rounded-none"
    width={width}
    height={height}
  >
    <source src={`/videos/pages/doc/${name}.mp4`} type="video/mp4" />
    <source src={`/videos/pages/doc/${name}.webm`} type="video/webm" />
  </PauseableVideo>
);

Video.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Video;
