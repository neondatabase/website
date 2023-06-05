import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { RELEASE_NOTES_SLUG_REGEX } from 'constants/docs';
import { getSidebar } from 'utils/api-docs';

// eslint-disable-next-line react/prop-types
const ReleaseNoteLayout = async ({ children, params: { slug } }) => {
  const sidebar = await getSidebar();
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);

  return (
    <Layout
      headerTheme="white"
      headerWithBottomBorder={!isReleaseNotePage}
      burgerWithoutBorder={!isReleaseNotePage}
      footerWithTopBorder
      isDocPage
    >
      {isReleaseNotePage ? (
        children
      ) : (
        <div className="safe-paddings flex flex-1 flex-col dark:bg-black dark:text-white lg:block">
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
      )}
    </Layout>
  );
};

export default ReleaseNoteLayout;
