import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import AuthorCard from 'components/pages/guides/author-card';
import { GUIDES_BASE_PATH } from 'constants/guides';
import LINKS from 'constants/links';
import { getAllGuides, getAuthor, getAuthors } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  title: 'Guide authors — Neon',
  description: 'Browse Neon guides by the people who wrote them.',
  pathname: `${LINKS.guides}/authors`,
  rssPathname: `${GUIDES_BASE_PATH}rss.xml`,
});

const GuideAuthorsPage = async () => {
  const guides = await getAllGuides();
  const guideCounts = guides.reduce((counts, { author }) => {
    if (author?.slug) counts[author.slug] = (counts[author.slug] || 0) + 1;
    return counts;
  }, {});

  const authors = Object.keys(getAuthors())
    .filter((slug) => guideCounts[slug])
    .map((slug) => ({ ...getAuthor(slug), guideCount: guideCounts[slug] }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (authors.length === 0) return notFound();

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
          },
        ]}
      />
      <BlogHeader title="Authors" rssTitle="Guides" basePath={GUIDES_BASE_PATH} />
      <ul className="grid grid-cols-3 gap-6 lg:grid-cols-2 lg:gap-5 md:grid-cols-1 md:gap-0">
        {authors.map((author) => (
          <li
            className="md:border-b md:border-gray-new-15/20 md:last:border-b-0 dark:md:border-gray-new-15/80"
            key={author.slug}
          >
            <AuthorCard {...author} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuideAuthorsPage;
