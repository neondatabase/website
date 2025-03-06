import BlogHeader from 'components/pages/blog/blog-header';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { GUIDES_BASE_PATH } from 'constants/guides';

// eslint-disable-next-line react/prop-types
const GuidesPageLayout = async ({ children }) => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-12 md:pt-10 sm:pt-10"
        size="1344"
      >
        <div className="relative col-span-7 col-start-4 flex flex-col 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:mx-auto lg:pt-0">
          <BlogHeader title="Guides" basePath={GUIDES_BASE_PATH} />
          {children}
        </div>
      </Container>
    </div>
  </Layout>
);

export default GuidesPageLayout;
