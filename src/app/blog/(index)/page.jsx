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
  const validPosts = Array.isArray(posts) ? posts.filter(Boolean) : [];

  return (
    <>
      <BlogHeader
        className="border-b border-gray-new-20 pb-12 lg:-top-[68px] md:top-0 md:border-b-0 md:pb-0"
        title="What we’re shipping. What you’re building."
        basePath={BLOG_BASE_PATH}
        withLabel
      />
      <Suspense fallback={null}>
        <BlogSearch
          searchInputClassName="right-full mr-16 top-[208px] lt:top-[192px] xl:mr-3.5 lg:right-0 lg:mr-0 lg:top-[12px] md:!static md:!right-auto md:!top-auto md:mt-4"
          posts={validPosts}
        >
          <div className="grid grid-cols-2 gap-x-16 xl:gap-x-5 md:grid-cols-1 md:pt-[96px]">
            {validPosts.slice(0, 10).map((post, index) => (
              <BlogGridItem
                key={post.slug}
                className={index < 2 ? 'lg:!pt-0 lg:!border-t-0 md:!pt-0 md:!border-t-0' : ''}
                post={post}
                isFeatured={post.isFeatured}
                isPriority={index < 5}
              />
            ))}
            {validPosts.length > 10 && (
              <ScrollLoader itemsCount={10}>
                {validPosts.slice(10).map((post) => (
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
