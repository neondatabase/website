import PropTypes from 'prop-types';

import BlogPostCard from '../blog-post-card';
import { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

const VideoList = ({ videos }) => (
  <section className="videos flex flex-col">
    <h2 className="flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-pink-90">
      <span>Video</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>
    <div className="mt-6 grid grid-cols-3 gap-x-10 2xl:gap-x-6 lg:mt-5 md:grid-cols-1 md:gap-y-10">
      {videos.map(({ post }, index) => (
        <BlogPostCard
          {...post}
          key={index}
          size="md"
          withImageHover={false}
          imageWidth={380}
          imageHeight={196}
          withAuthorPhoto
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
