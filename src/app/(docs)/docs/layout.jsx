/* eslint-disable react/prop-types */
import MobileNav from 'components/pages/doc/mobile-nav';
import ModeToggler from 'components/pages/doc/mode-toggler';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getSidebar } from 'utils/api-docs';

const NeonDocsLayout = async ({ children }) => {
  const sidebar = await getSidebar();

  return (
    <Layout
      headerClassName="lg:border-none"
      isDocPage
      isHeaderSticky
      headerWithBorder
      hasThemesSupport
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
          className="grid w-full flex-1 grid-cols-12 gap-x-8 pb-20 pt-9 xl:flex xl:max-w-[calc(100vw-302px)] xl:flex-col lg:pt-5 md:pt-4"
          size="1408"
        >
          <ModeToggler className="mb-7 hidden md:flex" />
          {children}
        </Container>
      </div>
    </Layout>
  );
};

export default NeonDocsLayout;
