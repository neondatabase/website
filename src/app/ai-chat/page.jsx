import MobileNav from 'components/pages/doc/mobile-nav';
import ModeToggler from 'components/pages/doc/mode-toggler';
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
      // hideFooter
    >
      <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:flex-col">
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

        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-8 pb-20 pt-9 xl:flex xl:flex-col lg:min-h-[calc(100svh-144px)] lg:flex-none lg:pb-12 lg:pt-0 md:pb-5 md:pt-4"
          size="1408"
        >
          <ModeToggler className="hidden shrink-0 md:flex" isAiChatPage />
          <h1 className="sr-only">Neon AI Chat</h1>
          <div className="col-span-7 col-start-2 -ml-6 flex w-full max-w-[832px] flex-1 items-center justify-center 3xl:ml-0 2xl:col-span-8 2xl:col-start-1 lg:max-w-none">
            <InkeepEmbedded />
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default AiChatPage;
