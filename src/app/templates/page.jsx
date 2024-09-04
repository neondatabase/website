import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

const TemplatesPage = () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
        size="1344"
      >
        {/* <Sidebar /> */}
        <div className="col-span-7 col-start-4 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:mx-auto lg:pt-0">
          Content
        </div>
      </Container>
    </div>
  </Layout>
);

export default TemplatesPage;
