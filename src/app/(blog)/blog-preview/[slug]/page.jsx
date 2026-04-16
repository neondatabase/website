/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import resolveBlogPreviewRequest from 'app/blog-preview/blog-preview';
import BlogPreviewBanner from 'components/pages/blog/blog-preview-banner';
import Aside from 'components/pages/blog-post/aside';
import CodeBlock from 'components/pages/blog-post/code-block';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import BlogQuote from 'components/shared/blog-quote';
import Button from 'components/shared/button';
import ChangelogForm from 'components/shared/changelog-form';
import EmbedTweet from 'components/shared/embed-tweet';
import { BLOG_PREVIEW_BASE_PATH, buildBlogPostPath } from 'constants/blog';
import { getBlogPostBySlug, getBlogSnapshot } from 'utils/api-blog';
import getFormattedDate from 'utils/get-formatted-date';
import getMarkdownTableOfContents from 'utils/get-markdown-table-of-contents';
import getMetadata from 'utils/get-metadata';

const renderBlogCodeBlockFromPre = async (props) => {
  const codeElement = props?.children;
  const rawCode =
    typeof codeElement?.props?.children === 'string' ? codeElement.props.children : '';
  const className = codeElement?.props?.className || codeElement?.props?.class || '';
  const languageMatch = className.match(/language-([a-z0-9-]+)/i);

  return <CodeBlock language={languageMatch ? languageMatch[1] : 'bash'}>{rawCode}</CodeBlock>;
};

const BlogPreviewPostPage = async ({ params, searchParams }) => {
  const { slug: routeSlug } = await params;
  const { branch, routeConfig, snapshot } = await resolveBlogPreviewRequest(
    searchParams,
    getBlogSnapshot
  );
  const { post, relatedPosts } = await getBlogPostBySlug(routeSlug, {
    previewBranch: branch,
    strictBranch: true,
  });

  if (!post) {
    return notFound();
  }

  const { slug, title, content, pageBlogPost, date, dateGmt, modifiedGmt, categories, seo } = post;
  const previewUrl = buildBlogPostPath(routeConfig, slug);
  const formattedDate = getFormattedDate(date);
  const tableOfContents = getMarkdownTableOfContents(content);

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
        <article className="dark relative mx-auto grid max-w-[1536px] grid-cols-12 gap-x-10 pt-20 pb-40 2xl:px-10 xl:gap-x-6 xl:pt-12 xl:pb-32 lg:block lg:max-w-none lg:px-8 lg:pt-10 lg:pb-28 md:px-4 md:pt-8 md:pb-20">
          <div className="col-start-4 col-end-10 mx-5 xl:col-start-1 xl:col-end-9 lg:mx-0">
            <BlogPreviewBanner branch={branch} commitSha={snapshot.commitSha} />
          </div>
          <Hero
            className="col-start-4 col-end-10 mx-5 xl:col-start-1 xl:col-end-9 lg:mx-0"
            title={title}
            date={formattedDate}
            category={categories.nodes[0]}
            authors={pageBlogPost.authors}
            routeConfig={routeConfig}
            {...pageBlogPost}
          />
          <ChangelogForm
            className="col-start-4 col-end-10 mx-5 mt-4 mb-8 hidden xl:col-start-1 xl:col-end-9 lg:mx-0 lg:flex"
            isBlog
          />
          <Content
            className="post-content col-start-4 col-end-10 mx-5 mt-4 xl:col-start-1 xl:col-end-9 lg:mx-0"
            html={
              <MDXRemote
                source={content}
                components={{
                  h2: AnchorHeading('h2'),
                  h3: AnchorHeading('h3'),
                  pre: renderBlogCodeBlockFromPre,
                  Admonition,
                  BlogQuote,
                  Button,
                  EmbedTweet,
                  YoutubeIframe,
                }}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            }
          />
          <Aside title={title} slug={previewUrl} tableOfContents={tableOfContents} />
          {relatedPosts.length > 0 && (
            <MoreArticles
              className="col-start-4 col-end-10 mx-5 mt-16 xl:col-start-1 xl:col-end-9 xl:mt-14 lg:mx-0 lg:mt-12 md:mt-10"
              posts={relatedPosts}
              routeConfig={routeConfig}
            />
          )}
        </article>
      </div>
    </>
  );
};

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { branch } = await resolveBlogPreviewRequest(searchParams, getBlogSnapshot);
  const { post } = await getBlogPostBySlug(slug, {
    previewBranch: branch,
    strictBranch: true,
  });

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
    title: `[Preview] ${opengraphTitle || title}`,
    description: opengraphDescription || metaDesc,
    keywords: metaKeywords,
    robotsNoindex: metaRobotsNoindex || 'noindex',
    pathname: `${BLOG_PREVIEW_BASE_PATH}${slug}`,
    imagePath: twitterImage?.mediaItemUrl,
    type: 'article',
    publishedTime: date,
    category: categories.nodes[0]?.name,
    authors,
  });
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default BlogPreviewPostPage;
