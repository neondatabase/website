import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const FlowPage = ({ children }) => (
  <Layout headerWithBorder isHeaderSticky withOverflowHidden>
    <Container
      className="w-full pb-20 pt-[88px] xl:pt-16 lg:pb-16 lg:pt-12 md:pb-14 md:pt-10"
      size="xxs"
    >
      {children}
    </Container>
  </Layout>
);

export default FlowPage;
