import { previewData as getPreviewData } from 'next/headers';
import { notFound } from 'next/navigation';

import Aside from 'components/pages/blog-post/aside';
import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import SocialShare from 'components/pages/blog-post/social-share';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import CodeBlock from 'components/shared/code-block';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import { getAllWpPosts, getWpPostBySlug, getWpPreviewPostData } from 'utils/api-posts';
import getFormattedDate from 'utils/get-formatted-date';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPage = async ({ params }) => {
  const previewData = getPreviewData();
  const isPreviewMode = !!previewData;

  let postResult;

  if (isPreviewMode) {
    postResult = await getWpPreviewPostData(previewData.id, previewData.status);
  } else {
    postResult = await getWpPostBySlug(params?.slug);
  }

  const { post, relatedPosts } = postResult;
  if (!post) return notFound();

  const { slug, title, content, pageBlogPost, date, categories } = post;
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${LINKS.blog}${slug}`;
  const formattedDate = getFormattedDate(date);

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
      blogpostcta: CTA,
    },
    true
  );

  return (
    <Layout
      className="bg-black-new text-white"
      headerTheme="gray-8"
      footerTheme="black-new"
      footerWithTopBorder
      isHeaderSticky
    >
      <div className="safe-paddings bg-gray-new-8">
        <article className="mx-auto grid max-w-[1472px] grid-cols-12 gap-x-10 pt-16 pb-40 2xl:px-10 xl:gap-x-6 xl:pt-12 xl:pb-32 lg:max-w-none lg:px-8 lg:pb-28 lg:pt-10 md:gap-x-0 md:px-4 md:pb-20 md:pt-8">
          <Hero
            className="col-start-4 col-end-10 xl:col-start-1 xl:col-end-9 lg:col-span-full"
            title={title}
            date={formattedDate}
            category={categories.nodes[0]}
            {...pageBlogPost}
          />

          <Content
            className="prose-invert col-start-4 col-end-10 row-start-2 mt-10 xl:col-start-1 xl:col-end-9 lg:col-span-full lg:row-start-3"
            html={contentWithLazyBlocks}
            title={title}
            cover={pageBlogPost.largeCover}
          />
          <Aside
            className="col-span-3 col-end-13 row-start-2 mt-10 xl:col-span-4 lg:col-span-full lg:mt-5"
            title={title}
            slug={shareUrl}
            authors={pageBlogPost.authors}
            posts={relatedPosts}
          />
          <SocialShare className="hidden lg:mt-14 lg:flex md:mt-12" title={title} slug={shareUrl} />

          <MoreArticles
            className="col-span-10 col-start-2 mt-16 xl:col-span-full xl:mt-14 lg:mt-12 md:mt-11"
            posts={relatedPosts}
          />
        </article>
      </div>
      <SubscribeForm className="pt-[118px] pb-[125px] xl:pt-[104px] xl:pb-[123px] lg:pt-20 lg:pb-28 md:pt-16 md:pb-24" />
      {isPreviewMode && (
        <a
          href={`/api/exit-preview?slug=${previewData.slug}&pageType=blog`}
          className="t-base fixed left-5 bottom-5 inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-primary-1 px-[26px] py-[11px] text-center font-bold !leading-none text-black outline-none transition-colors duration-200 hover:bg-[#00e5bf]"
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
