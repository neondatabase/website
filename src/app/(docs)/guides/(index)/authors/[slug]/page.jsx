/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import GuideCard from 'components/pages/guides/guide-card';
import { GUIDES_BASE_PATH } from 'constants/guides';
import { getAllGuides, getAuthors } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  return Object.keys(getAuthors()).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const authorsData = getAuthors();
  if (!authorsData[params.slug]) return notFound();
  return getMetadata({
    title: `Neon guides by ${authorsData[params.slug].name}`,
    rssPathname: `${GUIDES_BASE_PATH}rss.xml`,
  });
}

const GuidesPage = async ({ params }) => {
  const authorsData = getAuthors();
  const author = authorsData[params.slug];

  if (!author) return notFound();

  const posts = (await getAllGuides()).filter((i) => i.author.name === author.name);

  if (!posts || posts.length === 0)
    return <div className="w-full text-center text-lg">No guides yet</div>;

  return (
    <div className="min-w-0 pb-32 lg:pb-24 md:pb-20">
      <Breadcrumbs
        breadcrumbs={[
          {
            title: 'Community',
            slug: 'community/community-intro',
          },
          {
            title: 'Guides',
            slug: 'guides',
          },
          {
            title: `Guides by ${author.name}`,
          },
        ]}
      />
      <BlogHeader title={`Guides by ${author.name}`} basePath={GUIDES_BASE_PATH} />
      <div className="guides">
        {posts.map((post) => (
          <GuideCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
};

export default GuidesPage;
