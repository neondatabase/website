import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

const NeonGuidesLayout = async ({ children }) => (
    <Layout
      headerTheme="white"
      headerWithBottomBorder
      footerWithTopBorder
      burgerWithoutBorder
      isDocPage
      isHeaderSticky
    >
      <div className="safe-paddings flex flex-1 flex-col dark:bg-gray-new-8 dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-10 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
          size="medium"
        >
          {children}
        </Container>
      </div>
    </Layout>
  );

export default NeonGuidesLayout;
