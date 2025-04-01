import Hero from 'components/pages/security/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.report);

const ReportPage = () => (
  <Layout>
    <Hero />
    <CTA
      className="pb-[290px] pt-[348px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="Wanna meet us?"
      titleClassName="max-w-[745px] lg:max-w-[600px] md:max-w-[400px] md:leading-none"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default ReportPage;
