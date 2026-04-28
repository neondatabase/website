import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import { DEFAULT_BLOG_ROUTE_CONFIG } from 'constants/blog';
import { cn } from 'utils/cn';

const BlogGridItem = ({
  className,
  post,
  category,
  isPriority,
  isFeatured,
  routeConfig = DEFAULT_BLOG_ROUTE_CONFIG,
}) => {
  const { isFeatured: _, ...postProps } = post;

  return (
    <BlogPostCard
      className={cn(
        'last:pb-0',
        isFeatured
          ? 'pt-0! pb-10'
          : 'col-span-full border-t border-gray-new-20 py-8 first-of-type:border-0 first-of-type:pt-0 md:py-6',
        className
      )}
      category={category}
      isFeatured={isFeatured}
      fullSize={!isFeatured}
      imageWidth={isFeatured ? 560 : 336}
      imageHeight={isFeatured ? 294 : 176}
      isPriority={isPriority}
      routeConfig={routeConfig}
      withAuthorPhoto
      {...postProps}
    />
  );
};

BlogGridItem.propTypes = {
  className: PropTypes.string,
  post: PropTypes.object.isRequired,
  category: PropTypes.string,
  isFeatured: PropTypes.bool,
  isPriority: PropTypes.bool,
  routeConfig: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    categoryBasePath: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    previewParams: PropTypes.object,
  }),
};

export default BlogGridItem;
