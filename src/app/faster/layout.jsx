import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const CasesLayout = async ({ children }) => (
  <Layout headerWithBorder isHeaderSticky>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="flex w-full flex-1 gap-x-24 pt-11 2xl:gap-x-8 xl:max-w-3xl xl:px-8 xl:pt-9 lg:block sm:pt-7"
        size="1152"
      >
        {children}
      </Container>
    </div>
  </Layout>
);

export default CasesLayout;
