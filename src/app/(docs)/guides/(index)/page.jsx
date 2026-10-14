import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import GuidesList from 'components/pages/guides/guides-list';
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
    <div className="mx-auto w-full max-w-304 min-w-0 pb-32 lg:max-w-none lg:pb-24 md:pb-20">
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
      <BlogHeader title="Guides" rssTitle="Guides" basePath={GUIDES_BASE_PATH} />
      <GuidesList posts={posts} />
    </div>
  );
};

export default GuidesPage;
