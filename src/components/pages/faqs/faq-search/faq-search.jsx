'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState, useMemo, useRef } from 'react';

import FaqCard from 'components/pages/faqs/faq-card';
import SearchInput from 'components/shared/blog-search/search-input';
import debounce from 'utils/debounce';

const FaqSearch = ({ children, posts, searchInputClassName }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(urlQuery);
  const isInternalUpdateRef = useRef(false);

  useEffect(() => {
    if (!isInternalUpdateRef.current) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((value) => {
        isInternalUpdateRef.current = true;
        const params = new URLSearchParams(window.location.search);
        if (value) {
          params.set('query', value);
        } else {
          params.delete('query');
        }
        const queryString = params.toString();
        const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
        router.push(newUrl, { scroll: false });
        setTimeout(() => {
          isInternalUpdateRef.current = false;
        }, 50);
      }, 100),
    [pathname, router]
  );

  useEffect(
    () => () => {
      debouncedUpdateURL.cancel?.();
    },
    [debouncedUpdateURL]
  );

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
      {filteredPosts === null ? (
        children
      ) : filteredPosts.length === 0 ? (
        <div className="w-full text-lg text-gray-new-70 md:pt-24">No search results found</div>
      ) : (
        <div className="faqs" role="region" aria-label="Search results">
          <div role="status" aria-live="polite" className="sr-only">
            {filteredPosts.length} results found
          </div>
          {filteredPosts.map((post) => (
            <FaqCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </>
  );
};

FaqSearch.propTypes = {
  children: PropTypes.node.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  searchInputClassName: PropTypes.string,
};

export default FaqSearch;
