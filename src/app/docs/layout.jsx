/* eslint-disable react/prop-types */
import { headers } from 'next/headers';

import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getNavigation } from 'utils/api-docs';
import getSDKNavigation from 'utils/get-sdk-navigation';

const NeonDocsLayout = async ({ children }) => {
  const navigation = await getNavigation();

  // Get current pathname from headers to determine if SDK navigation should be loaded
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const currentSlug = pathname.replace(/^\/docs\//, '');

  // Load SDK navigation data on server if this is an SDK reference page
  const sdkTOC = await getSDKNavigation(currentSlug);

  return (
    <Layout
      headerClassName="h-28 lg:h-16"
      docsNavigation={navigation}
      docsBasePath={DOCS_BASE_PATH}
      isDocPage
      isHeaderSticky
      headerWithBorder
      hasThemesSupport
    >
      <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:flex-col">
        <Container
          className="flex w-full flex-1 gap-x-24 pt-11 2xl:gap-x-8 xl:pt-9 lg:block sm:pt-7"
          size="1600"
        >
          <Sidebar
            className="w-64 shrink-0 lg:hidden"
            navigation={navigation}
            basePath={DOCS_BASE_PATH}
            sdkTOC={sdkTOC}
          />
          {children}
        </Container>
        <MobileNav navigation={navigation} basePath={DOCS_BASE_PATH} />
      </div>
    </Layout>
  );
};

export default NeonDocsLayout;
