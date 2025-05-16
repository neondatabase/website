import clsx from 'clsx';
import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';

const BlogGridItem = ({ className, post, category, isPriority, isFeatured }) => (
  <BlogPostCard
    className={clsx(
      'py-8 last:pb-0 md:py-6',
      isFeatured
        ? '!pt-0'
        : 'col-span-full border-t border-gray-new-15 py-8 first:border-0 first:pt-0',
      '[&:nth-child(-n+2)]:-order-1 [&:nth-child(3)]:border-0',
      className
    )}
    category={category}
    fullSize={!isFeatured}
    imageWidth={isFeatured ? 372 : 336}
    imageHeight={isFeatured ? 209 : 189}
    isPriority={isPriority}
    withAuthorPhoto
    {...post}
  />
);

BlogGridItem.propTypes = {
  className: PropTypes.string,
  post: PropTypes.object.isRequired,
  category: PropTypes.string,
  isFeatured: PropTypes.bool,
  isPriority: PropTypes.bool,
};

export default BlogGridItem;
