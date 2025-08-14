/* eslint-disable react/prop-types */
import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getSidebar } from 'utils/api-docs';

const NeonDocsLayout = async ({ children }) => {
  const sidebar = await getSidebar();

  return (
    <Layout headerClassName="h-28" isDocPage isHeaderSticky headerWithBorder hasThemesSupport>
      <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:flex-col">
        <MobileNav
          className="hidden lg:block"
          sidebar={sidebar}
          slug="introduction"
          basePath={DOCS_BASE_PATH}
        />
        <Container
          className="grid w-full flex-1 grid-cols-[16rem_auto_16rem] gap-x-24 pb-20 pt-11 xl:pt-9 sm:pt-7"
          size="1600"
        >
          <Sidebar
            className="lg:hidden"
            sidebar={sidebar}
            slug="introduction"
            basePath={DOCS_BASE_PATH}
          />
          {children}
        </Container>
      </div>
    </Layout>
  );
};

export default NeonDocsLayout;
