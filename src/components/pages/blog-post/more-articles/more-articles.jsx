import Image from 'next/image';
import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import { DEFAULT_BLOG_ROUTE_CONFIG } from 'constants/blog';
import triangleIcon from 'icons/triangle.svg';
import { cn } from 'utils/cn';

const MoreArticles = ({ className = null, posts, routeConfig = DEFAULT_BLOG_ROUTE_CONFIG }) => (
  <section className={cn('more-articles flex flex-col', className)}>
    <h2 className="flex items-center gap-x-2 font-mono text-xs leading-none -tracking-extra-tight text-gray-new-80 uppercase">
      <Image className="" src={triangleIcon} alt="" width={12} height={14} aria-hidden="true" />
      <span className="">More from Neon</span>
      <span className="ml-2.5 h-px grow bg-gray-new-20" />
    </h2>

    <div className="mt-8 flex flex-col md:mt-6">
      {posts.map(({ excerpt: _excerpt, subtitle: _subtitle, ...post }, index) => (
        <BlogPostCard
          key={index}
          {...post}
          imageWidth={260}
          imageHeight={146}
          routeConfig={routeConfig}
          isSmart
        />
      ))}
    </div>
  </section>
);

MoreArticles.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      categories: PropTypes.shape({
        nodes: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            slug: PropTypes.string,
          })
        ),
      }),
      pageBlogPost: PropTypes.shape({
        authors: PropTypes.arrayOf(
          PropTypes.shape({
            author: PropTypes.shape({
              title: PropTypes.string,
              postAuthor: PropTypes.shape({
                image: PropTypes.shape({
                  mediaItemUrl: PropTypes.string,
                }),
              }),
            }),
          })
        ),
      }),
    })
  ),
  routeConfig: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    categoryBasePath: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    previewParams: PropTypes.object,
  }),
};

export default MoreArticles;
