'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useInstantSearch, useHits } from 'react-instantsearch';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import GuideCard from 'components/pages/guides/guide-card';

const SearchResults = ({ posts, indexName, className, children }) => {
  const { indexUiState } = useInstantSearch({ query: false });
  const { items } = useHits();

  if (!indexUiState.query) {
    return children;
  }

  if (items.length === 0) {
    // TO-DO: Update text here
    return <div className="w-full text-center text-lg">No search results found</div>;
  }

  return (
    <div className={clsx('search-results', className)}>
      {items.map(({ url, index }) => {
        const slug = url.split('/').pop();
        const post = posts.find((post) => post.slug === slug);

        if (!post) return null;

        if (indexName === 'guides') return <GuideCard key={post.slug} {...post} />;

        return <BlogGridItem key={post.slug} post={post} isPriority={index < 5} />;
      })}
    </div>
  );
};

SearchResults.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SearchResults;
