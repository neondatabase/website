import Cards from 'components/pages/case-studies/cards';
import Hero from 'components/pages/case-studies/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import { getAllWpCaseStudiesPosts } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.caseStudies);

const CaseStudiesPage = async () => {
  const allCaseStudies = await getAllWpCaseStudiesPosts();
  return (
    <Layout>
      <Hero items={allCaseStudies} />
      <Cards items={allCaseStudies} />
      <CTA
        title="Ready to get started with Neon?"
        description="Interested in increasing your free tier limits or learning about pricing? Complete the form below to get in touch"
        buttonText="Contact sales"
        buttonUrl={LINKS.contactSales}
      />
    </Layout>
  );
};

export default CaseStudiesPage;

export const revalidate = 60;
