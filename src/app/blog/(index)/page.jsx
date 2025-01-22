import clsx from 'clsx';
import { notFound } from 'next/navigation';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import LoadMorePosts from 'components/shared/load-more-posts/load-more-posts';
import { BLOG_BASE_PATH } from 'constants/blog';
import SEO_DATA from 'constants/seo-data';
// import { getAllWpPosts } from 'utils/api-posts';
import { getFeaturedSortedWpPosts } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

// async function getChangelogData() {
//   const res = await fetch(process.env.NEXT_PUBLIC_RELEASE_NOTES_API_URL);

//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// }

export const metadata = getMetadata({ ...SEO_DATA.blog, rssPathname: `${BLOG_BASE_PATH}rss.xml` });

const BlogPage = async () => {
  // const posts = await getAllWpPosts();
  const posts = await getFeaturedSortedWpPosts();

  if (!posts) return notFound();

  return (
    <>
      <h2 className="sr-only">Blog</h2>
      <LoadMorePosts className="mt-16" defaultCountPosts={8} countToAdd={8}>
        {posts.map((post, index) => {
          const isFeatured = index < 2;

          return (
            <BlogPostCard
              className={clsx(
                isFeatured
                  ? ''
                  : 'col-span-full border-b border-gray-new-15 py-8 first:pt-0 last:border-b-0 last:pb-0'
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
    </>
  );
};

export const revalidate = 60;

export default BlogPage;
