import { notFound } from 'next/navigation';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import BlogHeader from 'components/pages/blog/blog-header';
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
        className="lg:-top-[68px] md:-top-[116px]"
        title="Blog"
        basePath={BLOG_BASE_PATH}
      />
      <div className="blog-posts grid grid-cols-2 gap-x-6 xl:gap-x-5 md:grid-cols-1">
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
    </>
  );
};

export const revalidate = 300;

export default BlogPage;
