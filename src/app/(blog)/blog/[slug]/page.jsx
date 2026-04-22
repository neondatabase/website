import { notFound } from 'next/navigation';
import PropTypes from 'prop-types';

import BlogPostPage from 'components/pages/blog-post/blog-post-page';
import { DEFAULT_BLOG_ROUTE_CONFIG } from 'constants/blog';
import LINKS from 'constants/links';
import { getAllBlogPosts, getBlogPostBySlug } from 'utils/api-blog';
import getMetadata from 'utils/get-metadata';

const BlogPage = async ({ params: paramsPromise }) => {
  const params = await paramsPromise;
  const { post, relatedPosts } = await getBlogPostBySlug(params?.slug);

  if (!post) {
    return notFound();
  }

  const { slug } = post;
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${LINKS.blog}/${slug}`;

  return (
    <BlogPostPage
      post={post}
      postUrl={shareUrl}
      relatedPosts={relatedPosts}
      routeConfig={DEFAULT_BLOG_ROUTE_CONFIG}
    />
  );
};

BlogPage.propTypes = {
  params: PropTypes.object.isRequired,
};

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const { post } = await getBlogPostBySlug(slug);

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
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export const revalidate = 60;

export default BlogPage;
