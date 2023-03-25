import { previewData as getPreviewData } from 'next/headers';
import { notFound } from 'next/navigation';

import Hero from 'components/pages/blog-post/hero';
import PostContent from 'components/pages/blog-post/post-content';
import SocialShareBar from 'components/pages/blog-post/social-share-bar';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { getAllWpPosts, getWpPostBySlug, getWpPreviewPostData } from 'utils/api-posts';

const BlogPage = async ({ params }) => {
  const previewData = getPreviewData();
  const isPreviewMode = !!previewData;

  let postResult;

  if (isPreviewMode) {
    postResult = await getWpPreviewPostData(previewData.id, previewData.status);
  } else {
    postResult = await getWpPostBySlug(params?.slug);
  }

  const { post } = postResult;
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
      {isPreviewMode && (
        <a
          href={`/api/exit-preview?slug=${previewData.slug}&pageType=blog`}
          className="t-base fixed left-5 bottom-5 inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-primary-1 py-[14px] px-[26px] py-[11px] text-center font-bold !leading-none text-black outline-none transition-colors duration-200 hover:bg-[#00e5bf]"
        >
          Preview Mode
        </a>
      )}
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
