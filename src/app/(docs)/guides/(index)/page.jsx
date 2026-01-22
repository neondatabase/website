import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import GuideCard from 'components/pages/guides/guide-card';
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
    <div className="min-w-0 pb-32 lg:pb-24 md:pb-20">
      <Breadcrumbs
        breadcrumbs={[
          {
            title: 'Community',
            slug: 'community/community-intro',
          },
          {
            title: 'Guides',
          },
        ]}
      />
      <BlogHeader title="Guides" basePath={GUIDES_BASE_PATH} />
      <div className="guides">
        {posts.map((post) => (
          <GuideCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
};

export default GuidesPage;
