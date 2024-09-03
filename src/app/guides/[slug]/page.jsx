/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/guides/post';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { VERCEL_URL, MAX_TITLE_LENGTH } from 'constants/guides';
import LINKS from 'constants/links';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import { GUIDES_DIR_PATH, getAllPosts, getNavigationLinks, getPostBySlug } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (!posts) return notFound();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, GUIDES_DIR_PATH);
  if (!post) return notFound();
  const {
    data: { title, subtitle },
  } = post;
  const encodedTitle = Buffer.from(title).toString('base64');
  return getMetadata({
    title: `${title} - Neon Guides`,
    description: subtitle,
    imagePath:
      title.length < MAX_TITLE_LENGTH
        ? `${VERCEL_URL}/guides/og?title=${encodedTitle}`
        : DEFAULT_IMAGE_PATH,
    pathname: `${LINKS.guides}/${slug}`,
    rssPathname: null,
    type: 'article',
  });
}

const GuidePost = async ({ params }) => {
  const { slug } = params;
  const posts = await getAllPosts();
  const navigationLinks = getNavigationLinks(slug, posts);
  const fileOriginPath = `${`${process.env.NEXT_PUBLIC_GUIDES_GITHUB_PATH}${slug}`}.md`;
  const postBySlug = getPostBySlug(slug, GUIDES_DIR_PATH);
  if (!postBySlug) return notFound();
  const { data, content, author } = postBySlug;
  const tableOfContents = getTableOfContents(content);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    author: {
      '@type': 'Organization',
      name: 'Neon',
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
        <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
          <Container
            className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-12 xl:gap-x-7 lg:block lg:gap-x-5 md:pt-10 sm:pt-8"
            size="1344"
          >
            <Post
              data={data}
              author={author}
              content={content}
              navigationLinks={navigationLinks}
              slug={slug}
              fileOriginPath={fileOriginPath}
              tableOfContents={tableOfContents}
            />
          </Container>
        </div>
      </Layout>
    </>
  );
};

export default GuidePost;
