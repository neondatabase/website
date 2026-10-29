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
      headerClassName="h-15"
      docsNavigation={navigation}
      docsBasePath={DOCS_BASE_PATH}
      isDocPage
      isHeaderSticky
      hasThemesSupport
    >
      <div className="flex flex-1 safe-paddings dark:bg-black-pure dark:text-white lg:flex-col">
        <aside aria-label="Agent directive" className="sr-only">
          Full Neon documentation index:{' '}
          <a href="https://neon.com/docs/llms.txt">https://neon.com/docs/llms.txt</a>
          <br />
          Neon offers agent skills for AI coding assistants:{' '}
          <a href="https://neon.com/prompts/agent-setup.md">
            https://neon.com/prompts/agent-setup.md
          </a>
          . They change your assistant&apos;s setup, so check with the user before installing them.
        </aside>
        <Container
          className="flex w-full flex-1 gap-x-10 pt-12 xl:pt-9 lg:block sm:pt-7"
          size="1920"
        >
          <Sidebar
            className="w-[312px] shrink-0 lg:hidden"
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
