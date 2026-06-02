'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

import { DEFAULT_BLOG_ROUTE_CONFIG, EXTRA_CATEGORIES } from 'constants/blog';
import debounce from 'utils/debounce';

import SearchInput from './search-input';
import SearchResults from './search-results';

const extraCategoryNameBySlug = new Map(
  EXTRA_CATEGORIES.map((category) => [category.slug, category.name])
);

const normalizeSearchText = (value = '') =>
  String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`([^`]*)`/gu, ' $1 ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, ' $1 ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/[_*#>~|[\]{}()]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLowerCase();

const getAuthorNames = (post) => {
  const postAuthors = post.pageBlogPost?.authors || [];
  const authorNames = postAuthors.map((item) => item?.author?.title).filter(Boolean);

  if (post.author?.name) {
    authorNames.push(post.author.name);
  }

  if (post.author?.title) {
    authorNames.push(post.author.title);
  }

  return authorNames.join(' ');
};

const getCategorySearchText = (post) => {
  const categories = (post.categories?.nodes || [])
    .map((category) => category?.name || category?.slug)
    .filter(Boolean);

  if (post.category) {
    categories.push(extraCategoryNameBySlug.get(post.category) || post.category);
  }

  return categories.join(' ');
};

const getSearchableFields = (post) => ({
  title: normalizeSearchText(post.title),
  subtitle: normalizeSearchText(post.subtitle),
  excerpt: normalizeSearchText(post.excerpt),
  description: normalizeSearchText(post.pageBlogPost?.description),
  category: normalizeSearchText(getCategorySearchText(post)),
  author: normalizeSearchText(getAuthorNames(post)),
  content: normalizeSearchText(post.content),
});

const getFieldScore = (fieldValue, query, tokens, weight) => {
  if (!fieldValue) {
    return 0;
  }

  const includesWholeQuery = fieldValue.includes(query);
  const includesAllTokens =
    tokens.length > 1 && tokens.every((token) => fieldValue.includes(token));

  if (!includesWholeQuery && !includesAllTokens) {
    return 0;
  }

  let score = weight;

  if (fieldValue === query) {
    score += weight * 2;
  } else if (fieldValue.startsWith(query)) {
    score += weight;
  }

  score += tokens.filter((token) => fieldValue.includes(token)).length;

  return score;
};

const BlogSearch = ({
  children,
  posts,
  searchInputClassName,
  routeConfig = DEFAULT_BLOG_ROUTE_CONFIG,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(urlQuery);
  const deferredQuery = useDeferredValue(query);
  const isInternalUpdateRef = useRef(false);

  useEffect(() => {
    // Only sync from URL if it's an external change (browser back/forward)
    // not from our own typing which triggers debounced URL updates
    if (!isInternalUpdateRef.current) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Debounced URL update
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
        // Reset flag after allowing time for URL change to propagate
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

  const searchablePosts = useMemo(
    () =>
      posts.map((post, index) => ({
        index,
        post,
        fields: getSearchableFields(post),
      })),
    [posts]
  );

  // Filter posts based on query
  const filteredPosts = useMemo(() => {
    if (!deferredQuery.trim()) {
      return null;
    }

    const searchTerm = normalizeSearchText(deferredQuery);
    const tokens = searchTerm.split(' ').filter(Boolean);

    return searchablePosts
      .map(({ index, post, fields }) => {
        const score =
          getFieldScore(fields.title, searchTerm, tokens, 100) +
          getFieldScore(fields.subtitle, searchTerm, tokens, 70) +
          getFieldScore(fields.excerpt, searchTerm, tokens, 55) +
          getFieldScore(fields.description, searchTerm, tokens, 45) +
          getFieldScore(fields.category, searchTerm, tokens, 30) +
          getFieldScore(fields.author, searchTerm, tokens, 25) +
          getFieldScore(fields.content, searchTerm, tokens, 10);

        return { index, post, score };
      })
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || left.index - right.index)
      .map((item) => item.post);
  }, [deferredQuery, searchablePosts]);

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
      <SearchResults posts={filteredPosts} routeConfig={routeConfig}>
        {children}
      </SearchResults>
    </>
  );
};

BlogSearch.propTypes = {
  children: PropTypes.node.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      excerpt: PropTypes.string,
      content: PropTypes.string,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  searchInputClassName: PropTypes.string,
  routeConfig: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    categoryBasePath: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    previewParams: PropTypes.object,
  }),
};

export default BlogSearch;
