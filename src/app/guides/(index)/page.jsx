import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import GuideCard from 'components/pages/guides/guide-card';
import AlgoliaSearch from 'components/shared/algolia-search';
import SearchResults from 'components/shared/algolia-search/search-results';
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
    <AlgoliaSearch indexName={process.env.NEXT_PUBLIC_ALGOLIA_GUIDES_INDEX_NAME}>
      <BlogHeader title="Guides" basePath={GUIDES_BASE_PATH} />
      <SearchResults posts={posts} indexName="guides">
        <div className="guides">
          {posts.map((post) => (
            <GuideCard key={post.slug} {...post} />
          ))}
        </div>
      </SearchResults>
    </AlgoliaSearch>
  );
};

export default GuidesPage;
