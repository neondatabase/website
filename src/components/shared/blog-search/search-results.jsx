'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import BlogGridItem from 'components/pages/blog/blog-grid-item';

const SearchResults = ({ posts, className, children }) => {
  // Show children when no search query is active
  if (posts === null) {
    return children;
  }

  // Show "no results" message
  if (posts.length === 0) {
    return <div className="w-full text-center text-lg">No search results found</div>;
  }

  // Show filtered results
  return (
    <div className={clsx('search-results', className)}>
      {posts.map((post, index) => (
        <BlogGridItem key={post.slug} post={post} isPriority={index < 5} />
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
        subtitle: PropTypes.string.isRequired,
        excerpt: PropTypes.string.isRequired,
      })
    ),
    PropTypes.oneOf([null]),
  ]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SearchResults;
