/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import BlogHeader from 'components/pages/blog/blog-header';
import GuideCard from 'components/pages/guides/guide-card';
import Sidebar from 'components/pages/guides/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
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
  if (!posts) return <div className="text-18">No guides yet</div>;
  return (
    <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
          size="1344"
        >
          <Sidebar className="col-span-3 mt-[88px] pb-10 lt:col-span-3 lg:hidden" />
          <div className="col-span-7 col-start-4 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:mx-auto lg:pt-0">
            <BlogHeader title="Guides" basePath={GUIDES_BASE_PATH} />
            <ul>
              {posts.map(({ title, subtitle, author, createdAt, updatedOn, slug }) => (
                <li
                  key={slug}
                  className="border-b border-gray-new-15/20 pb-5 pt-6 first:pt-0 last:border-none last:pb-0 dark:border-gray-new-15/80"
                >
                  <GuideCard
                    title={title}
                    subtitle={subtitle}
                    author={author}
                    createdAt={createdAt}
                    updatedOn={updatedOn}
                    slug={slug}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default GuidesPage;
