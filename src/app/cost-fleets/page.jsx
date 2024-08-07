import Hero from 'components/pages/cost-fleets/hero';
import Cta from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.costFleets);

const CostFleetsPage = async () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky>
    <Hero />
    <Cta
      className="mt-[70px] py-[250px] xl:mt-14 xl:py-[184px] lg:mt-12 lg:py-[130px] md:mt-8 md:py-[105px]"
      title="Try it yourself"
      buttonText="Create an account"
      buttonUrl={LINKS.signup}
    />
  </Layout>
);

export default CostFleetsPage;

export const revalidate = 60;
