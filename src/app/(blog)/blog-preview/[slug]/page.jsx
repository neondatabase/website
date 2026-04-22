/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import resolveBlogPreviewRequest from 'app/blog-preview/blog-preview';
import BlogPostPage from 'components/pages/blog-post/blog-post-page';
import { BLOG_PREVIEW_BASE_PATH, buildBlogPostPath } from 'constants/blog';
import { getBlogPostBySlug, getBlogSnapshot } from 'utils/api-blog';
import getMetadata from 'utils/get-metadata';

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

  const { slug } = post;
  const previewUrl = buildBlogPostPath(routeConfig, slug);

  return (
    <BlogPostPage
      post={post}
      postUrl={previewUrl}
      relatedPosts={relatedPosts}
      routeConfig={routeConfig}
      previewBanner={{ branch, commitSha: snapshot.commitSha }}
      showSocialShare={false}
    />
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
