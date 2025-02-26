import BlogHeader from 'components/pages/blog/blog-header';
import Sidebar from 'components/pages/guides/sidebar';
import AlgoliaSearch from 'components/shared/algolia-search';
import SearchResults from 'components/shared/algolia-search/search-results';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { GUIDES_BASE_PATH } from 'constants/guides';
import { getAllGuides } from 'utils/api-guides';

// eslint-disable-next-line react/prop-types
const GuidesPageLayout = async ({ children }) => {
  const posts = await getAllGuides();

  return (
    <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
          size="1344"
        >
          <AlgoliaSearch indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}>
            <Sidebar className="col-span-2 col-start-2 mt-[88px] xl:col-span-3 xl:col-start-1 lg:top-16 lg:col-span-full lg:mx-auto lg:mb-8 lg:mt-0 lg:max-w-[750px]" />
            <div className="col-span-7 col-start-4 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:mx-auto lg:pt-0">
              <BlogHeader
                className="lg:-top-16 md:-top-[60px]"
                title="Guides"
                basePath={GUIDES_BASE_PATH}
              />
              <SearchResults posts={posts} indexName="guides">
                {children}
              </SearchResults>
            </div>
          </AlgoliaSearch>
        </Container>
      </div>
    </Layout>
  );
};

export default GuidesPageLayout;
