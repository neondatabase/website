import { notFound } from 'next/navigation';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
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
    <ScrollLoader
      className="blog-posts grid grid-cols-2 gap-x-6 xl:gap-x-5 md:grid-cols-1"
      itemsCount={8}
    >
      {posts.map((post, index) => (
        <BlogGridItem key={post.slug} index={index} post={post} />
      ))}
    </ScrollLoader>
  );
};

export const revalidate = 60;

export default BlogPage;
