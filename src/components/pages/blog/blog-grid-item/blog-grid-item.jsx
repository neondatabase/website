import clsx from 'clsx';
import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';

const BlogGridItem = ({ className, post, category, index }) => {
  const isFeatured = index < 2 && post.pageBlogPost;

  return (
    <BlogPostCard
      className={clsx(
        'py-8 first:pt-0 last:pb-0 md:py-6',
        isFeatured
          ? 'pt-0 md:pt-0'
          : 'col-span-full border-t border-gray-new-15 py-8 first:border-0 first:border-t-0 first:pt-0 last:pb-0',
        className
      )}
      category={category}
      fullSize={!isFeatured}
      isPriority={index < 5}
      imageWidth={isFeatured ? 372 : 336}
      imageHeight={isFeatured ? 209 : 189}
      withAuthorPhoto
      {...post}
    />
  );
};

BlogGridItem.propTypes = {
  className: PropTypes.string,
  post: PropTypes.shape({
    pageBlogPost: PropTypes.any,
  }),
  category: PropTypes.string,
  index: PropTypes.number,
};

export default BlogGridItem;
