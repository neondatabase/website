/* eslint-disable react/prop-types */
import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import { DocsVersionProvider } from 'components/pages/doc/version-context';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getNavigation, getNavigationByDocsVersion, getSDKNavigation } from 'utils/api-docs';

const NeonDocsLayout = async ({ children }) => {
  const navigation = await getNavigation();
  const navigationByVersion = getNavigationByDocsVersion();
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
      <DocsVersionProvider>
        <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:flex-col">
          <Container
            className="flex w-full flex-1 gap-x-24 pt-12 2xl:gap-x-8 xl:pt-9 lg:block sm:pt-7"
            size="1920"
          >
            <Sidebar
              className="w-[312px] shrink-0 lg:hidden"
              navigation={navigation}
              navigationByVersion={navigationByVersion}
              basePath={DOCS_BASE_PATH}
              sdkNavigation={sdkNavigation}
              showVersionSwitcher
            />
            {children}
          </Container>
          <MobileNav
            navigation={navigation}
            navigationByVersion={navigationByVersion}
            basePath={DOCS_BASE_PATH}
          />
        </div>
      </DocsVersionProvider>
    </Layout>
  );
};

export default NeonDocsLayout;
