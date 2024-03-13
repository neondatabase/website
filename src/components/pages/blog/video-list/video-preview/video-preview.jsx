'use client';

import BlogPostCard, { BlogPostCardPropTypes } from 'components/pages/blog/blog-post-card';
import useWindowSize from 'hooks/use-window-size';

const VideoPreview = (props) => {
  // TODO: refactoring
  const { width } = useWindowSize();
  return <BlogPostCard {...props} size={width < 1024 ? 'sm' : 'video'} />;
};

VideoPreview.propTypes = BlogPostCardPropTypes;

export default VideoPreview;
