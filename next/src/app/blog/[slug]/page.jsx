import { notFound } from 'next/navigation';

import Hero from 'components/pages/blog-post/hero';
import PostContent from 'components/pages/blog-post/post-content';
import SocialShareBar from 'components/pages/blog-post/social-share-bar';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { getAllWpPosts, getWpPostBySlug } from 'utils/api-posts';

const BlogPage = async ({ params }) => {
  const { post } = await getWpPostBySlug(params?.slug);

  if (!post) return notFound();

  const { slug, title, content, pageBlogPost, date, readingTime } = post;
  const shareUrl = `${process.env.DEFAULT_SITE_URL}/blog/${slug}`;
  const formattedDate = new Date(date).toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
  );

  return (
    <Layout headerTheme="white" isHeaderSticky>
      <article className="mx-auto grid max-w-[1009px] grid-cols-10 gap-x-8 pt-20 xl:max-w-[936px] xl:pt-16 lg:max-w-none lg:px-6 lg:pt-12 md:gap-x-0 md:px-4 md:pt-6">
        <Hero
          className="col-start-2 col-end-10 md:col-span-full"
          title={title}
          date={formattedDate}
          readingTime={readingTime}
          {...pageBlogPost}
        />
        <PostContent title={title} content={content} authors={pageBlogPost.authors} slug={slug} />
      </article>
      <SubscribeMinimalistic />
      <SocialShareBar className="hidden md:block" slug={shareUrl} title={title} />
    </Layout>
  );
};

export async function generateStaticParams() {
  const posts = await getAllWpPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default BlogPage;
