import PropTypes from 'prop-types';

import { BlogPostCardPropTypes } from 'components/pages/blog/blog-post-card';

import VideoPreview from './video-preview';

const VideoList = ({ videos }) => (
  <section className="videos flex flex-col">
    <h2 className="flex items-center text-xs font-semibold uppercase leading-none -tracking-extra-tight text-pink-90">
      <span>Video</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>
    <div className="mt-6 grid grid-cols-6 gap-5 lg:mt-5 lg:grid-cols-4 md:gap-x-6 md:gap-y-10 sm:grid-cols-2 xs:grid-cols-1">
      {videos.map(({ post }, index) => (
        <VideoPreview
          {...post}
          key={index}
          withImageHover={false}
          imageWidth={380}
          imageHeight={196}
        />
      ))}
    </div>
  </section>
);

VideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.shape({
        ...BlogPostCardPropTypes,
      }),
    })
  ),
};

export default VideoList;
