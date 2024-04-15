import clsx from 'clsx';
import PropTypes from 'prop-types';

import { BlogPostCardPropTypes } from 'components/pages/blog/blog-post-card';

import VideoPreview from './video-preview';

const VideoList = ({ videos }) => (
  <section className="videos flex flex-col">
    <h2 className="flex items-center font-title text-xs font-medium uppercase leading-none -tracking-extra-tight text-pink-90">
      <span>Video</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>
    <div className="mt-6 grid grid-cols-5 gap-8 xl:gap-7 lg:mt-5 lg:grid-cols-4 lg:gap-6 md:gap-x-6 md:gap-y-10 sm:grid-cols-2 xs:grid-cols-1">
      {videos.map(({ post }, index) => (
        <VideoPreview
          className={clsx(index > 4 && 'hidden lg:block')}
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
