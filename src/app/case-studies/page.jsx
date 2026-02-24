import Cards from 'components/pages/case-studies/cards';
import Hero from 'components/pages/case-studies/hero';
import Testimonials from 'components/pages/case-studies/testimonials';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getAllWpCaseStudiesPosts, getAllWpCaseStudiesCategories } from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.caseStudies);

const CaseStudiesPage = async () => {
  const caseStudies = await getAllWpCaseStudiesPosts();
  const categories = await getAllWpCaseStudiesCategories();

  return (
    <Layout>
      <Hero />
      <Testimonials />
      <Cards items={caseStudies} categories={categories} />
      <CTANew
        label="Get started"
        title="Ready to get started with Neon?"
        description="Get personalized guidance from our team — we’ll help you quickly find the right solution."
        buttonText="Talk to sales"
        buttonType="aiHelper"
      />
    </Layout>
  );
};

export default CaseStudiesPage;

export const revalidate = 60;
