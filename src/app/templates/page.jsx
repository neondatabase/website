import Content from 'components/pages/templates/content';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata() {
  return getMetadata({
    title: 'Neon templates',
    description:
      'Jumpstart your app development process with pre-built solutions from Neon and our community.',
  });
}

const TemplatesPage = () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-5 pb-[104px] pt-12 xl:gap-x-7 xl:pb-24 lg:block lg:gap-x-5 lg:pb-20 lg:pt-9 md:pb-[72px] sm:pt-6"
        size="960"
      >
        <div className="col-span-4 col-start-1 max-w-[703px]">
          <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight xl:text-[36px] lg:text-[32px] sm:text-[28px]">
            Find your Template
          </h1>
          <p className="mt-2.5 max-w-[558px] text-lg font-light leading-snug tracking-extra-tight text-gray-new-20 dark:text-gray-new-80 sm:text-base">
            Jumpstart your app development process with pre-built solutions from Neon and our
            community.
          </p>
        </div>
        <div className="col-span-5 col-start-1 mt-14 grid grid-cols-5 xl:mt-12 lg:mt-11 lg:flex lg:flex-col sm:mt-[38px]">
          <Content />
        </div>
      </Container>
    </div>
  </Layout>
);

export default TemplatesPage;
