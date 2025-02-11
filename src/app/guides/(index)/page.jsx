/* eslint-disable react/prop-types */

import clsx from 'clsx';

import GuideCard from 'components/pages/guides/guide-card';
import Sidebar from 'components/pages/guides/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import RssButton from 'components/shared/rss-button';
import { GUIDES_BASE_PATH } from 'constants/guides';
import { getAllGuides } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata() {
  // TO-DO: Update real data here
  return getMetadata({
    title: 'Neon guides',
    // description: '',
    // type: '',
    rssPathname: `${GUIDES_BASE_PATH}rss.xml`,
  });
}

const sidebarClassName = 'col-span-3 pb-10 lt:col-span-3 lg:hidden';
const contentClassName =
  'col-span-7 col-start-4 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:mx-auto';

const GuidesPage = async () => {
  const posts = await getAllGuides();
  // TO-DO: Update text here
  if (!posts) return <div className="text-18">No guides yet</div>;

  return (
    <Layout
      searchIndexName={process.env.NEXT_PUBLIC_ALGOLIA_GUIDES_INDEX_NAME}
      headerWithBorder
      burgerWithoutBorder
      isHeaderSticky
      hasThemesSupport
      showSearchInput
    >
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
          size="1344"
        >
          <span className={sidebarClassName} aria-hidden />
          <div
            className={clsx(
              contentClassName,
              'mb-12 flex items-end justify-between text-center lg:mb-10 lg:items-center md:mb-8'
            )}
          >
            <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight lg:text-[32px] md:text-[28px]">
              Guides
            </h1>
            <RssButton className="mb-1.5 lg:mb-0" basePath={GUIDES_BASE_PATH} title="Guides" />
          </div>
          <Sidebar className={sidebarClassName} />
          <div className={clsx(contentClassName, 'flex flex-col lg:pt-0')}>
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
