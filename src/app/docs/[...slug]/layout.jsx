import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { getSidebar } from 'utils/api-docs';

const DocsLayout = async ({ children, params }) => {
  const sidebar = await getSidebar();
  const currentSlug = params.slug.join('/');

  return (
    <Layout
      headerTheme="white"
      headerWithBottomBorder
      footerWithTopBorder
      burgerWithoutBorder
      isDocPage
    >
      <div className="safe-paddings flex flex-1 flex-col text-black-new dark:bg-gray-new-8 dark:text-white lg:block">
        <MobileNav className="hidden lg:block" sidebar={sidebar} currentSlug={currentSlug} />

        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
          size="mdDoc"
        >
          <Sidebar
            className="relative col-start-1 col-end-4 max-w-[254px] pb-20 pt-[111px] before:absolute before:-right-5 before:top-0 before:z-10 before:h-full before:w-screen before:bg-gray-new-98 dark:before:bg-gray-new-10 lg:hidden"
            sidebar={sidebar}
            currentSlug={currentSlug}
          />
          {children}
        </Container>
      </div>
    </Layout>
  );
};

export default DocsLayout;
