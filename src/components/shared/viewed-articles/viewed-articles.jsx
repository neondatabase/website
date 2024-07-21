'use client';

import { useEffect, useState } from 'react';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import Container from 'components/shared/container';
import useLocalStorage from 'hooks/use-local-storage';

const ViewedArticles = () => {
  const [viewedPosts] = useLocalStorage('viewedPosts', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !viewedPosts.length) return null;

  return (
    <section className="viewed-articles mt-[72px]">
      <Container size="1220">
        <div className="flex items-center">
          <h2 className="font-title text-[36px] font-medium leading-none tracking-extra-tight text-white">
            Keep reading
          </h2>
          <div className="flex gap-3" />
        </div>

        <ul className="mt-9 grid grid-cols-3 gap-x-10 xl:gap-x-6 lg:gap-x-4 md:grid-cols-1 md:gap-y-6">
          {viewedPosts.slice(0, 3).map((post, index) => (
            <li key={index} className="flex flex-col">
              <BlogPostCard
                {...post}
                size="md"
                imageWidth={380}
                imageHeight={214}
                withAuthorPhoto
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default ViewedArticles;
