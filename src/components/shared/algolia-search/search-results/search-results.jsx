'use client';

import PropTypes from 'prop-types';
import { useInstantSearch, useHits } from 'react-instantsearch';

import BlogGridItem from 'components/pages/blog/blog-grid-item';

const SearchResults = ({ posts, className, children }) => {
  const { indexUiState } = useInstantSearch();
  const { items } = useHits();

  if (!indexUiState.query) {
    return children;
  }

  if (items.length === 0) {
    // TO-DO: Update text here
    return <div className="w-full text-center text-lg">No search results found</div>;
  }

  return (
    <div className={className}>
      {items.map(({ url, index }) => {
        const slug = url.split('/').pop();
        const post = posts.find((post) => post.slug === slug);

        if (!post) return null;

        return <BlogGridItem key={post.slug} index={index} post={post} />;
      })}
    </div>
  );
};

SearchResults.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.node.isRequired,
};

export default SearchResults;
