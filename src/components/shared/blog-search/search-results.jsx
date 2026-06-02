'use client';

import PropTypes from 'prop-types';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import { DEFAULT_BLOG_ROUTE_CONFIG } from 'constants/blog';
import { cn } from 'utils/cn';

const SearchResults = ({ posts, className, children, routeConfig = DEFAULT_BLOG_ROUTE_CONFIG }) => {
  // Show children when no search query is active
  if (posts === null) {
    return children;
  }

  // Show "no results" message
  if (posts.length === 0) {
    return <div className="w-full text-lg text-gray-new-70 md:pt-24">No search results found</div>;
  }

  // Show filtered results
  return (
    <div className={cn('search-results md:pt-24', className)}>
      <div role="status" aria-live="polite" className="sr-only">
        {posts.length} results found
      </div>
      {posts.map((post, index) => (
        <BlogGridItem
          key={post.slug}
          post={post}
          isPriority={index < 5}
          routeConfig={routeConfig}
        />
      ))}
    </div>
  );
};

SearchResults.propTypes = {
  posts: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        excerpt: PropTypes.string,
      })
    ),
    PropTypes.oneOf([null]),
  ]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  routeConfig: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    categoryBasePath: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    previewParams: PropTypes.object,
  }),
};

export default SearchResults;
