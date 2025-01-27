import Sidebar from 'components/pages/blog/sidebar';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import AlgoliaSearch from 'components/shared/algolia-search';
import SearchResults from 'components/shared/algolia-search/search-results';
import Container from 'components/shared/container';
import { getAllCategories, getAllPosts } from 'utils/api-posts';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();
  const posts = await getAllPosts();

  return (
    <div className="safe-paddings py-16 lg:py-12 sm:py-10">
      <Container className="flex flex-col" size="1344">
        <div className="mb-16 flex flex-col justify-center text-center lg:mb-12 md:mb-8">
          <h1 className="font-title text-[68px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl">
            What&apos;s new?
          </h1>
          <p className="mt-3 text-xl tracking-extra-tight text-gray-new-80">
            Discover our newest features, product updates, and technical improvements.
          </p>
        </div>
        <div className="flex gap-8 pl-16 xl:gap-6 xl:pl-0 lg:flex-col lg:gap-0">
          <AlgoliaSearch indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}>
            <Sidebar categories={categories} />
            <div className="relative max-w-3xl lg:max-w-full">
              <SearchResults posts={posts}>{children}</SearchResults>
            </div>
          </AlgoliaSearch>
        </div>
        <SubscribeForm
          className="mt-[120px] xl:mt-[104px] lg:mt-[88px] md:mt-20"
          dataTest="blog-subscribe-form"
        />
      </Container>
    </div>
  );
};

export default BlogPageLayout;
