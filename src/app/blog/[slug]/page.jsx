import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import Aside from 'components/pages/blog-post/aside';
import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import PreviewWarning from 'components/pages/blog-post/preview-warning';
import SocialShare from 'components/pages/blog-post/social-share';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import CodeBlock from 'components/shared/code-block';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import { getAllWpPosts, getWpPostBySlug, getWpPreviewPostData } from 'utils/api-posts';
import getFormattedDate from 'utils/get-formatted-date';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPage = async ({ params, searchParams }) => {
  const { isEnabled: isDraftModeEnabled } = draftMode();

  let postResult;

  if (isDraftModeEnabled) {
    postResult = await getWpPreviewPostData(searchParams?.id, searchParams?.status);
  } else {
    postResult = await getWpPostBySlug(params?.slug);
  }

  const { post, relatedPosts } = postResult;

  if (!post) {
    return notFound();
  }

  const { slug, title, content, pageBlogPost, date, dateGmt, modifiedGmt, categories, seo } = post;
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${LINKS.blog}/${slug}`;
  const formattedDate = getFormattedDate(date);

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
      blogpostcta: CTA,
    },
    true
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: [seo?.twitterImage?.mediaItemUrl],
    datePublished: dateGmt,
    dateModified: modifiedGmt,
    description: pageBlogPost?.description,
    author: {
      '@type': 'Person',
      name: pageBlogPost?.authors?.[0].author.title,
    },
  };

  return (
    <Layout
      className="bg-black-new text-white"
      headerTheme="gray-8"
      footerTheme="black-new"
      footerWithTopBorder
      isHeaderSticky
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="safe-paddings bg-gray-new-8">
        <article className="dark mx-auto grid max-w-[1472px] grid-cols-12 gap-x-10 pb-40 pt-16 2xl:px-10 xl:gap-x-6 xl:pb-32 xl:pt-12 lg:max-w-none lg:px-8 lg:pb-28 lg:pt-10 md:gap-x-0 md:px-4 md:pb-20 md:pt-8">
          <Hero
            className="col-start-4 col-end-10 xl:col-start-1 xl:col-end-9 lg:col-span-full"
            title={title}
            date={formattedDate}
            category={categories.nodes[0]}
            {...pageBlogPost}
          />

          <Content
            className="col-start-4 col-end-10 row-start-2 mt-10 xl:col-start-1 xl:col-end-9 lg:col-span-full lg:row-start-3"
            html={contentWithLazyBlocks}
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
      <SubscribeForm />
      {isDraftModeEnabled && <PreviewWarning />}
    </Layout>
  );
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { post } = await getWpPostBySlug(slug);

  if (!post) return notFound();

  const {
    seo: {
      title,
      metaDesc,
      metaKeywords,
      metaRobotsNoindex,
      opengraphTitle,
      opengraphDescription,
      twitterImage,
    },
    date,
    pageBlogPost,
    categories,
  } = post;

  const authors = pageBlogPost.authors.map(({ author }) => author?.title);

  return getMetadata({
    title: opengraphTitle || title,
    description: opengraphDescription || metaDesc,
    keywords: metaKeywords,
    robotsNoindex: metaRobotsNoindex,
    pathname: `${LINKS.blog}/${slug}`,
    imagePath: twitterImage?.mediaItemUrl,
    type: 'article',
    publishedTime: date,
    category: categories.nodes[0]?.name,
    authors,
  });
}

export async function generateStaticParams() {
  const posts = await getAllWpPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default BlogPage;

export const revalidate = 60;
