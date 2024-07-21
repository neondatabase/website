'use client';

/* eslint-disable react/prop-types */

import { useEffect } from 'react';

import useLocalStorage from 'hooks/use-local-storage';

const SaveViewedPost = ({ post }) => {
  const [, setViewedPosts] = useLocalStorage('viewedPosts', []);
  useEffect(() => {
    setViewedPosts((prevPosts) => {
      if (!prevPosts.some((p) => p.slug === post.slug)) {
        return [...prevPosts, post];
      }
      return prevPosts;
    });
  }, [post, setViewedPosts]);

  return null;
};

export default SaveViewedPost;
