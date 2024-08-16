/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Aside from 'components/pages/blog-post/aside';
import CodeBlock from 'components/pages/blog-post/code-block';
import CodeTabs from 'components/pages/blog-post/code-tabs';
import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import PreviewWarning from 'components/pages/blog-post/preview-warning';
import SocialShare from 'components/pages/blog-post/social-share';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import Admonition from 'components/shared/admonition';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import { getWpPreviewPostData } from 'utils/api-posts';
import getFormattedDate from 'utils/get-formatted-date';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

/*
  NOTE:
  This page is only needed to show previews for the drafts.
  Its code is identical to the blog post page, except for the data fetching.
  If you need to change something here, сhange it first in the blog post page
  and then copy the changes here.
*/
/*
  WARNING:
  You can't have a post in Wordpress with the "wp-draft-post-preview-page" slug. Please be careful.
*/
const BlogDraft = async ({ searchParams }) => {
  // TODO: this is a temporary fix for a known problem with accessing serachParams on the Vercel side - https://github.com/vercel/next.js/issues/54507
  await Promise.resolve(JSON.stringify(searchParams));

  if (!searchParams?.id || !searchParams?.status) {
    return notFound();
  }

  const { post, relatedPosts } = await getWpPreviewPostData(searchParams?.id, searchParams?.status);

  if (!post) return notFound();

  const { slug, title, content, pageBlogPost, date, dateGmt, modifiedGmt, categories, seo } = post;
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${LINKS.blog}/${slug}`;
  const formattedDate = getFormattedDate(date);

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
      blogpostcodetabs: CodeTabs,
      blogpostcta: CTA,
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
      <div className="safe-paddings bg-black-pure">
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
          <SocialShare
            className="col-span-full hidden lg:mt-14 lg:flex md:mt-12"
            title={title}
            slug={shareUrl}
          />

          <SubscribeForm
            size="sm"
            className="col-span-6 col-start-4 mt-16 xl:col-span-8 lg:col-span-full"
          />
          <MoreArticles
            className="col-span-10 col-start-2 mt-16 xl:col-span-full xl:mt-14 lg:mt-12 md:mt-11"
            posts={relatedPosts}
          />
        </article>
      </div>
      <PreviewWarning />
    </>
  );
};

export async function generateMetadata() {
  const { title, description, imagePath } = SEO_DATA.blog;

  return getMetadata({
    title,
    description,
    keywords: '',
    robotsNoindex: 'noindex',
    pathname: `${LINKS.blog}/wp-draft-post-preview-page`,
    imagePath,
  });
}

export default BlogDraft;
