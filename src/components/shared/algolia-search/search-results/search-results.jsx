'use client';

import PropTypes from 'prop-types';
import { useInstantSearch, useHits } from 'react-instantsearch';

import BlogPostCard from 'components/pages/blog/blog-post-card';

const SearchResults = ({ posts, className, children }) => {
  const { indexUiState } = useInstantSearch();
  const { items } = useHits();

  if (!indexUiState.query) {
    return children;
  }

  return (
    <div className={className}>
      {items.map(({ url }) => {
        const slug = url.split('/').pop();
        const post = posts.find((post) => post.slug === slug);

        if (!post) return null;

        return (
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
