import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import BlogHeader from 'components/pages/blog/blog-header';
import BlogSearch from 'components/shared/blog-search';
import ScrollLoader from 'components/shared/scroll-loader';
import { BLOG_BASE_PATH } from 'constants/blog';
import SEO_DATA from 'constants/seo-data';
import { getAllPosts } from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({ ...SEO_DATA.blog, rssPathname: `${BLOG_BASE_PATH}rss.xml` });

const BlogPage = async () => {
  const posts = await getAllPosts();

  if (!posts) return notFound();

  return (
    <>
      <BlogHeader
        className="border-b border-gray-new-20 pb-12 lg:-top-[68px] md:-top-[62px] md:pb-16"
        title="What we’re shipping. What you’re building."
        basePath={BLOG_BASE_PATH}
        withLabel
      />
      <Suspense fallback={null}>
        <BlogSearch
          searchInputClassName="right-full mr-16 top-[256px] lg:-top-[68px] md:top-0"
          posts={posts}
        >
          <div className="grid grid-cols-2 gap-x-16 xl:gap-x-5 md:grid-cols-1">
            {posts.slice(0, 10).map((post, index) => (
              <BlogGridItem
                key={post.slug}
                post={post}
                isFeatured={post.isFeatured}
                isPriority={index < 5}
              />
            ))}
            {posts.length > 10 && (
              <ScrollLoader itemsCount={10}>
                {posts.slice(10).map((post) => (
                  <BlogGridItem key={post.slug} post={post} />
                ))}
              </ScrollLoader>
            )}
          </div>
        </BlogSearch>
      </Suspense>
    </>
  );
};

export const revalidate = 300;

export default BlogPage;
