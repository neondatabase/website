import Cards from 'components/pages/case-studies/cards';
import Hero from 'components/pages/case-studies/hero';
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
      <Hero items={caseStudies} />
      <Cards items={caseStudies} categories={categories} />
      <CTANew
        label="ASK AI"
        title="Still have questions? Ask our AI. <br class='xs:hidden' />"
        description="It knows Neon inside and out."
        buttonText="Get Answers"
        buttonType="aiHelper"
      />
    </Layout>
  );
};

export default CaseStudiesPage;

export const revalidate = 60;
