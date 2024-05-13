/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import GuideItem from 'components/pages/guides/guide-item';
import Sidebar from 'components/pages/guides/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { getAllPosts } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (!posts) return notFound();
  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');
    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata() {
  // TO-DO: Update real data here
  return getMetadata({
    title: 'Neon guides',
    // description: '',
    // type: '',
  });
}

export default async function GuidesPage() {
  const posts = await getAllPosts();
  // TO-DO: Update text here
  if (!posts) return <div className="text-18">No guides yet</div>;

  return (
    <Layout
      headerTheme="white"
      headerWithBottomBorder
      footerWithTopBorder
      burgerWithoutBorder
      isGuidePage
      isHeaderSticky
    >
      <div className="safe-paddings flex flex-1 flex-col dark:bg-gray-new-8 dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
          size="medium"
        >
          <Sidebar />
          <div className="col-span-7 col-start-4 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto">
            <ul>
              {posts.map(({ title, subtitle, author, createdAt, updatedOn, slug }) => (
                <GuideItem
                  key={slug}
                  title={title}
                  subtitle={subtitle}
                  author={author}
                  createdAt={createdAt}
                  updatedOn={updatedOn}
                  slug={slug}
                />
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
