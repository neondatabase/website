/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

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
  const posts = (await getAllGuides()).filter(
    (i) => i.author.name === authorsData[params.slug].name
  );

  if (!posts) return <div className="w-full text-center text-lg">No guides yet</div>;

  return (
    <div className="guides">
      {posts.map((post) => (
        <GuideCard key={post.slug} {...post} />
      ))}
    </div>
  );
};

export default GuidesPage;
