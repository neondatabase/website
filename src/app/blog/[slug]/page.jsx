/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import Aside from 'components/pages/blog-post/aside';
import CodeBlock from 'components/pages/blog-post/code-block';
import CodeTabs from 'components/pages/blog-post/code-tabs';
import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import Quote from 'components/pages/blog-post/quote';
import SocialShare from 'components/pages/blog-post/social-share';
import Admonition from 'components/shared/admonition';
import ChangelogForm from 'components/shared/changelog-form';
import LINKS from 'constants/links';
import { getAllWpPosts, getWpPostBySlug } from 'utils/api-wp';
import getFormattedDate from 'utils/get-formatted-date';
import getHtmlTableOfContents from 'utils/get-html-table-of-contents';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPage = async ({ params }) => {
  const postResult = await getWpPostBySlug(params?.slug);

  const { post, relatedPosts } = postResult;

  if (!post) {
    return notFound();
  }

  const { slug, title, content, pageBlogPost, date, dateGmt, modifiedGmt, categories, seo } = post;
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${LINKS.blog}/${slug}`;
  const formattedDate = getFormattedDate(date);

  const tableOfContents = getHtmlTableOfContents(content);

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
      blogpostcodetabs: CodeTabs,
      blogpostcta: CTA,
      blogpostquote: Quote,
      blogpostadmonition: (props) => <Admonition {...props} asHTML />,
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="safe-paddings">
        <article className="dark relative mx-auto grid max-w-[1536px] grid-cols-12 gap-x-10 pb-40 pt-20 2xl:px-10 xl:gap-x-6 xl:pb-32 xl:pt-12 lg:block lg:max-w-none lg:px-8 lg:pb-28 lg:pt-10 md:px-4 md:pb-20 md:pt-8">
          <Hero
            className="col-start-4 col-end-10 mx-5 xl:col-start-1 xl:col-end-9 lg:mx-0"
            title={title}
            date={formattedDate}
            category={categories.nodes[0]}
            authors={pageBlogPost.authors}
            {...pageBlogPost}
          />
          <ChangelogForm
            className="col-start-4 col-end-10 mx-5 mb-8 mt-4 hidden xl:col-start-1 xl:col-end-9 lg:mx-0 lg:flex"
            isBlog
          />
          <Content
            className="post-content col-start-4 col-end-10 mx-5 mt-4 xl:col-start-1 xl:col-end-9 lg:mx-0"
            html={contentWithLazyBlocks}
          />
          <Aside title={title} slug={shareUrl} tableOfContents={tableOfContents} />
          <SocialShare
            className="col-span-full hidden lg:mt-14 lg:flex md:mt-10 sm:mt-8"
            title={title}
            slug={shareUrl}
          />
          {relatedPosts.length > 0 && (
            <MoreArticles
              className="col-start-4 col-end-10 mx-5 mt-16 xl:col-start-1 xl:col-end-9 xl:mt-14 lg:mx-0 lg:mt-12 md:mt-10"
              posts={relatedPosts}
            />
          )}
        </article>
      </div>
    </>
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

export const revalidate = 60;

export default BlogPage;
