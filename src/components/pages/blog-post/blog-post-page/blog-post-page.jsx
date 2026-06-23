import { MDXRemote } from 'next-mdx-remote/rsc';
import PropTypes from 'prop-types';
import remarkGfm from 'remark-gfm';

import BlogPreviewBanner from 'components/pages/blog/blog-preview-banner';
import Aside from 'components/pages/blog-post/aside';
import CodeBlock from 'components/pages/blog-post/code-block';
import CodeTabs from 'components/pages/blog-post/code-tabs';
import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import SocialShare from 'components/pages/blog-post/social-share';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import BlogQuote from 'components/shared/blog-quote';
import ChangelogForm from 'components/shared/changelog-form';
import EmbedTweet from 'components/shared/embed-tweet';
import ImageZoom from 'components/shared/image-zoom';
import RequestForm from 'components/shared/request-form';
import { DEFAULT_BLOG_ROUTE_CONFIG } from 'constants/blog';
import getFormattedDate from 'utils/get-formatted-date';
import getMarkdownTableOfContents from 'utils/get-markdown-table-of-contents';

const renderBlogCodeBlockFromPre = async (props) => {
  const codeElement = props?.children;
  const rawCode =
    typeof codeElement?.props?.children === 'string' ? codeElement.props.children : '';
  const className = codeElement?.props?.className || codeElement?.props?.class || '';
  const languageMatch = className.match(/language-([a-z0-9-]+)/i);

  return <CodeBlock language={languageMatch ? languageMatch[1] : 'bash'}>{rawCode}</CodeBlock>;
};

/* eslint-disable @next/next/no-img-element */
const renderBlogImage = ({ src, alt = '', ...props }) => {
  if (!src) {
    return <img alt={alt} {...props} />;
  }

  return (
    <ImageZoom src={src} isDark>
      <img src={src} alt={alt} {...props} />
    </ImageZoom>
  );
};
/* eslint-enable @next/next/no-img-element */

const mdxComponents = {
  h2: AnchorHeading('h2'),
  h3: AnchorHeading('h3'),
  img: renderBlogImage,
  pre: renderBlogCodeBlockFromPre,
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  Admonition,
  BlogQuote,
  CodeTabs,
  CTA,
  EmbedTweet,
  RequestForm,
  YoutubeIframe,
};

const BlogPostPage = ({
  post,
  postUrl,
  relatedPosts = [],
  routeConfig = DEFAULT_BLOG_ROUTE_CONFIG,
  previewBanner = null,
  showSocialShare = true,
}) => {
  const { title, content, pageBlogPost, date, dateGmt, modifiedGmt, categories, seo } = post;
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
          {previewBanner && (
            <div className="col-start-4 col-end-10 mx-5 xl:col-start-1 xl:col-end-9 lg:mx-0">
              <BlogPreviewBanner
                branch={previewBanner.branch}
                commitSha={previewBanner.commitSha}
              />
            </div>
          )}
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
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            }
          />
          <Aside title={title} slug={postUrl} tableOfContents={tableOfContents} />
          {showSocialShare && (
            <SocialShare
              className="col-span-full hidden lg:mt-14 lg:flex md:mt-10 sm:mt-8"
              title={title}
              slug={postUrl}
            />
          )}
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

BlogPostPage.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    pageBlogPost: PropTypes.shape({
      description: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    dateGmt: PropTypes.string,
    modifiedGmt: PropTypes.string,
    categories: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    seo: PropTypes.shape({
      twitterImage: PropTypes.shape({
        mediaItemUrl: PropTypes.string,
      }),
    }),
  }).isRequired,
  postUrl: PropTypes.string.isRequired,
  relatedPosts: PropTypes.arrayOf(PropTypes.object),
  routeConfig: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    categoryBasePath: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    previewParams: PropTypes.object,
  }),
  previewBanner: PropTypes.shape({
    branch: PropTypes.string.isRequired,
    commitSha: PropTypes.string,
  }),
  showSocialShare: PropTypes.bool,
};

export default BlogPostPage;
