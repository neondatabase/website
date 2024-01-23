import Hero from 'components/pages/case-studies/hero';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import { getAllWpCaseStudiesPosts } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.caseStudies);

const CaseStudiesPage = async () => {
  const allCaseStudies = await getAllWpCaseStudiesPosts();
  return (
    <Layout
      className="bg-black-new text-white"
      headerTheme="black-new"
      footerTheme="black-new"
      footerWithTopBorder
    >
      <Hero items={allCaseStudies} />
      <CTAWithElephant
        className="mt-[200px] 2xl:mt-40 xl:mt-[125px] lg:mt-16 sm:mt-0"
        titleClassName="-mr-10 sm:max-w-[300px]"
        buttonClassName="px-[77px] xl:px-10 lg:px-9 sm:px-14"
        title="Ready to get started with Neon?"
        description="Interested in increasing your free tier limits or learning about pricing? Complete the form below to get in touch"
        buttonText="Sign up"
        buttonUrl={LINKS.signup}
        linkText="Contact sales"
        linkUrl={LINKS.contactSales}
        linkTarget="_blank"
      />
    </Layout>
  );
};

export default CaseStudiesPage;

export const revalidate = 60;
