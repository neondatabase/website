import { PropTypes } from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';

const BlogSearchHit = ({ post }) => (
  <BlogPostCard
    className="col-span-full border-t border-gray-new-15 py-8 first:border-0 first:border-t-0 first:pt-0 last:pb-0"
    key={post.slug}
    imageWidth={336}
    imageHeight={189}
    fullSize
    withAuthorPhoto
    {...post}
  />
);

BlogSearchHit.propTypes = {
  post: PropTypes.object.isRequired,
};

export default BlogSearchHit;
