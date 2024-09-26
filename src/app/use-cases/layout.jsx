import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const UseCasesLayout = async ({ children }) => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-[88px] xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
        size="1344"
      >
        {children}
      </Container>
    </div>
  </Layout>
);

export default UseCasesLayout;
