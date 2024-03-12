import DemoList from 'components/pages/demos/demo-list';
import Hero from 'components/pages/demos/hero';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.demos);

const DemoPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <DemoList />
    <CTAWithElephant
      titleClassName="flat-none md:!max-w-none md:flat-breaks"
      buttonClassName="px-[77px] xl:px-10 lg:px-9 sm:px-14"
      title="Get started<br/> with Neon"
      description="The fully managed multi-cloud Postgres with a generous free tier. We separated storage and compute to offer autoscaling, branching, and bottomless storage."
      buttonText="Sign Up"
      buttonUrl={LINKS.signup}
    />
  </Layout>
);

export default DemoPage;
