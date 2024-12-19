import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import InkeepEmbedded from 'components/shared/inkeep-embedded';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';
import { getSidebar } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aiChat);

const AiChatPage = async () => {
  const sidebar = await getSidebar();

  return (
    <Layout
      headerClassName="lg:border-none"
      burgerWithoutBorder
      showSearchInput
      isDocPage
      isAiChatPage
      isHeaderSticky
      headerWithBorder
      hasThemesSupport
      hideFooter
    >
      <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:block">
        <MobileNav
          className="hidden lg:block"
          sidebar={sidebar}
          slug="introduction"
          basePath={DOCS_BASE_PATH}
        />

        <Sidebar
          className="-mt-[65px] w-[350px] shrink-0 xl:w-[302px] lg:hidden"
          sidebar={sidebar}
          slug="introduction"
          basePath={DOCS_BASE_PATH}
        />

        <Container className="flex w-full items-center justify-center" size="1408">
          <h1 className="sr-only">Neon AI Chat</h1>
          <InkeepEmbedded />
        </Container>
      </div>
    </Layout>
  );
};

export default AiChatPage;
