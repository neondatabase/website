import Content from 'components/pages/templates/content';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  title: 'Neon templates',
  description:
    'Jumpstart your app development process with pre-built solutions from Neon and our community.',
});

const TemplatesPage = () => (
  <Layout headerWithBorder isHeaderSticky>
    <section className="flex flex-1 flex-col bg-black-pure safe-paddings text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-5 pt-12 pb-[104px] xl:gap-x-7 xl:pb-24 lg:block lg:gap-x-5 lg:pt-9 lg:pb-20 md:pb-[72px] sm:pt-6"
        size="960"
      >
        <div className="col-span-4 col-start-1 max-w-[703px]">
          <h1 className="font-title text-4xl leading-none font-medium tracking-extra-tight xl:text-[36px] lg:text-[32px] sm:text-[28px]">
            Find your Template
          </h1>
          <p className="mt-2.5 max-w-[558px] text-lg leading-snug font-light tracking-extra-tight text-gray-new-20 dark:text-gray-new-80 sm:text-base">
            Jumpstart your app development process with pre-built solutions from Neon and our
            community.
          </p>
        </div>
        <div className="col-span-5 col-start-1 mt-14 grid grid-cols-5 xl:mt-12 lg:mt-11 lg:flex lg:flex-col sm:mt-[38px]">
          <Content />
        </div>
      </Container>
    </section>
  </Layout>
);

export default TemplatesPage;
