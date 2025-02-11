import { notFound } from 'next/navigation';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import BlogHeader from 'components/pages/blog/blog-header';
import LoadMorePosts from 'components/shared/load-more-posts';
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
        className="lg:-top-[68px] md:-top-[60px]"
        title="Blog"
        basePath={BLOG_BASE_PATH}
      />
      <div className="grid grid-cols-2 gap-x-6 xl:gap-x-5 md:grid-cols-1">
        <LoadMorePosts className="mt-8 md:mt-6" defaultCountPosts={8} countToAdd={8}>
          {posts.map((post, index) => (
            <BlogGridItem key={post.slug} index={index} post={post} />
          ))}
        </LoadMorePosts>
      </div>
    </>
  );
};

export const revalidate = 60;

export default BlogPage;
