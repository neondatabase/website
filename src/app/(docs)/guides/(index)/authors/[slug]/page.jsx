/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import GuidesList from 'components/pages/guides/guides-list';
import { GUIDES_BASE_PATH } from 'constants/guides';
import LINKS from 'constants/links';
import { getAllGuides, getAuthors } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  return Object.keys(getAuthors()).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const authorsData = getAuthors();
  if (!authorsData[params.slug]) return notFound();
  return getMetadata({
    title: `Neon guides by ${authorsData[params.slug].name}`,
    description: `Guides written by ${authorsData[params.slug].name} on building with Neon.`,
    pathname: `${LINKS.guides}/authors/${params.slug}`,
    rssPathname: `${GUIDES_BASE_PATH}rss.xml`,
  });
}

const GuidesPage = async (props) => {
  const params = await props.params;
  const authorsData = getAuthors();
  const author = authorsData[params.slug];

  if (!author) return notFound();

  const posts = (await getAllGuides()).filter((i) => i.author.name === author.name);

  if (!posts || posts.length === 0)
    return <div className="w-full text-center text-lg">No guides yet</div>;

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
            slug: 'guides',
          },
          {
            title: 'Authors',
            slug: `${LINKS.guides}/authors`,
          },
          {
            title: author.name,
          },
        ]}
      />
      <BlogHeader
        title={`Guides by ${author.name}`}
        rssTitle={`Guides by ${author.name}`}
        basePath={GUIDES_BASE_PATH}
      />
      <GuidesList posts={posts} />
    </div>
  );
};

export default GuidesPage;
