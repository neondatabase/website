/* eslint-disable react/prop-types */
import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getNavigation, getSDKNavigation } from 'utils/api-docs';

const NeonDocsLayout = async ({ children }) => {
  const navigation = await getNavigation();
  const sdkNavigation = getSDKNavigation();

  return (
    <Layout
      headerClassName="h-28"
      docsNavigation={navigation}
      docsBasePath={DOCS_BASE_PATH}
      isDocPage
      isHeaderSticky
      hasThemesSupport
    >
      <div className="flex flex-1 safe-paddings lg:flex-col dark:bg-black-pure dark:text-white">
        <Container
          className="flex w-full flex-1 gap-x-24 pt-11 2xl:gap-x-8 sm:pt-7 lg:block xl:pt-9"
          size="1600"
        >
          <Sidebar
            className="w-64 shrink-0 lg:hidden"
            navigation={navigation}
            basePath={DOCS_BASE_PATH}
            sdkNavigation={sdkNavigation}
          />
          {children}
        </Container>
        <MobileNav navigation={navigation} basePath={DOCS_BASE_PATH} />
      </div>
    </Layout>
  );
};

export default NeonDocsLayout;
