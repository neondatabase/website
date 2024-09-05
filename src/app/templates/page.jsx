import Content from 'components/pages/templates/content';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

const TemplatesPage = () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-5 pb-[104px] pt-12 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
        size="960"
      >
        <div className="col-span-4 col-start-1 max-w-[703px]">
          <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight">
            Find your Template
          </h1>
          <p className="mt-2.5 max-w-[558px] text-lg font-light leading-snug tracking-extra-tight text-gray-new-20 dark:text-gray-new-80">
            Jumpstart your app development process with pre-built solutions from Neon and our
            community.
          </p>
        </div>
        <div className="col-span-5 col-start-1 mt-14 grid grid-cols-5">
          <Content />
        </div>
      </Container>
    </div>
  </Layout>
);

export default TemplatesPage;
