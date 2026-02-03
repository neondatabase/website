'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';

import debounce from 'utils/debounce';

import SearchInput from './search-input';
import SearchResults from './search-results';

const BlogSearch = ({ children, posts, searchInputClassName }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Debounced URL update
  const debouncedUpdateURL = useMemo(
    () =>
      debounce((value) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
          params.set('query', value);
        } else {
          params.delete('query');
        }
        const queryString = params.toString();
        const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
        router.push(newUrl, { scroll: false });
      }, 100),
    [pathname, router]
  );

  // Filter posts based on query
  const filteredPosts = useMemo(() => {
    if (!query.trim()) return null;

    const searchTerm = query.toLowerCase();
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || '';
      const subtitle = post.subtitle?.toLowerCase() || '';
      const excerpt = post.excerpt?.toLowerCase() || '';

      return (
        title.includes(searchTerm) || subtitle.includes(searchTerm) || excerpt.includes(searchTerm)
      );
    });
  }, [posts, query]);

  const handleSearchChange = (value) => {
    setQuery(value);
    debouncedUpdateURL(value);
  };

  // Preloader
  if (!mounted) {
    return (
      <>
        <SearchInput className={searchInputClassName} value="" asPlaceholder onChange={() => {}} />
        {children}
      </>
    );
  }

  return (
    <>
      <SearchInput className={searchInputClassName} value={query} onChange={handleSearchChange} />
      <SearchResults posts={filteredPosts}>{children}</SearchResults>
    </>
  );
};

BlogSearch.propTypes = {
  children: PropTypes.node.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  searchInputClassName: PropTypes.string,
};

export default BlogSearch;
