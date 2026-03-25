import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import Aside from 'components/pages/blog-post/aside';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import MoreArticles from 'components/pages/blog-post/more-articles';
import SocialShare from 'components/pages/blog-post/social-share';
import ChangelogForm from 'components/shared/changelog-form';
import LINKS from 'constants/links';
import { getAllBlogPosts, getBlogPostBySlug } from 'utils/api-blog';
import getFormattedDate from 'utils/get-formatted-date';
import getMarkdownTableOfContents from 'utils/get-markdown-table-of-contents';
import getMetadata from 'utils/get-metadata';

const BlogPage = async (props0) => {
  const params = await props0.params;
  const { post, relatedPosts } = getBlogPostBySlug(params?.slug);

  if (!post) {
    return notFound();
  }

  const { slug, title, content, pageBlogPost, date, dateGmt, modifiedGmt, categories, seo } = post;
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${LINKS.blog}/${slug}`;
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
          <Hero
            className="col-start-4 col-end-10 mx-5 xl:col-start-1 xl:col-end-9 lg:mx-0"
            title={title}
            date={formattedDate}
            category={categories.nodes[0]}
            authors={pageBlogPost.authors}
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
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            }
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

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const { post } = getBlogPostBySlug(slug);

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
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export const revalidate = 60;

export default BlogPage;
