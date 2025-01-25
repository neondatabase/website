import clsx from 'clsx';
import { notFound } from 'next/navigation';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import LoadMorePosts from 'components/shared/load-more-posts/load-more-posts';
import { BLOG_BASE_PATH } from 'constants/blog';
import SEO_DATA from 'constants/seo-data';
import { getAllPosts } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({ ...SEO_DATA.blog, rssPathname: `${BLOG_BASE_PATH}rss.xml` });

const BlogPage = async () => {
  const posts = await getAllPosts();

  if (!posts) return notFound();

  return (
    <>
      <h2 className="sr-only">Blog</h2>
      <div className="grid grid-cols-2 gap-x-6 md:grid-cols-1">
        <LoadMorePosts className="mt-16" defaultCountPosts={8} countToAdd={8}>
          {posts.map((post, index) => {
            const isFeatured = index < 2;

            return (
              <BlogPostCard
                className={clsx(
                  isFeatured
                    ? 'pb-11 md:pb-8'
                    : 'col-span-full border-t border-gray-new-15 py-8 first:border-0 first:border-t-0 first:pt-0 last:pb-0'
                )}
                key={post.slug}
                fullSize={!isFeatured}
                isPriority={index < 5}
                imageWidth={isFeatured ? 372 : 336}
                imageHeight={isFeatured ? 212 : 189}
                withAuthorPhoto
                {...post}
              />
            );
          })}
        </LoadMorePosts>
      </div>
    </>
  );
};

export const revalidate = 60;

export default BlogPage;
