/* eslint-disable react/prop-types */

import GuideCard from 'components/pages/guides/guide-card';
import Sidebar from 'components/pages/guides/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { getAllPosts } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata() {
  // TO-DO: Update real data here
  return getMetadata({
    title: 'Neon guides',
    // description: '',
    // type: '',
  });
}

const GuidesPage = async () => {
  const posts = await getAllPosts();
  // TO-DO: Update text here
  if (!posts) return <div className="text-18">No guides yet</div>;

  return (
    <Layout headerWithBorder burgerWithoutBorder isHeaderSticky>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
          size="1344"
        >
          <Sidebar />
          <div className="col-span-7 col-start-4 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:mx-auto lg:pt-0">
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
