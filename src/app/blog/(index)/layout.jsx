import BlogHeader from 'components/pages/blog/blog-header';
import Sidebar from 'components/pages/blog/sidebar';
import AlgoliaSearch from 'components/shared/algolia-search';
import SearchResults from 'components/shared/algolia-search/search-results';
import Container from 'components/shared/container';
import { BLOG_BASE_PATH } from 'constants/blog';
import { getAllCategories, getAllPosts } from 'utils/api-wp';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();
  const posts = await getAllPosts();

  return (
    <div className="safe-paddings pb-24 pt-16 lg:pb-20 lg:pt-12 sm:pb-16 sm:pt-10">
      <Container className="flex flex-col" size="1344">
        <div className="flex gap-8 pl-16 xl:gap-6 xl:pl-0 lg:flex-col lg:gap-0">
          <AlgoliaSearch indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}>
            <Sidebar categories={categories} />
            <div className="w-full max-w-3xl lg:max-w-full">
              <BlogHeader
                className="lg:-top-[68px] md:-top-[116px]"
                title="Blog"
                basePath={BLOG_BASE_PATH}
              />
              <SearchResults posts={posts}>{children}</SearchResults>
            </div>
          </AlgoliaSearch>
        </div>
      </Container>
    </div>
  );
};

export default BlogPageLayout;
