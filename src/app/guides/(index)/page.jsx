import { notFound } from 'next/navigation';

import GuideCard from 'components/pages/guides/guide-card';
import AlgoliaSearch from 'components/shared/algolia-search';
import { GUIDES_BASE_PATH } from 'constants/guides';
import SEO_DATA from 'constants/seo-data';
import { getAllGuides } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.guides,
  rssPathname: `${GUIDES_BASE_PATH}rss.xml`,
});

const GuidesPage = async () => {
  const posts = await getAllGuides();

  if (!posts) return notFound();

  return (
    <AlgoliaSearch
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_GUIDES_INDEX_NAME}
      posts={posts}
      searchInputClassName="md:relative md:mb-8"
    >
      <div className="guides">
        {posts.map((post) => (
          <GuideCard key={post.slug} {...post} />
        ))}
      </div>
    </AlgoliaSearch>
  );
};

export default GuidesPage;
