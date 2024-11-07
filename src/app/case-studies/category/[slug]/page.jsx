import { notFound } from 'next/navigation';

import Cards from 'components/pages/case-studies/cards';
import Hero from 'components/pages/case-studies/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import { getAllWpCaseStudiesPosts, getAllWpCaseStudiesCategories } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.caseStudies);

// eslint-disable-next-line react/prop-types
const CaseStudiesPage = async ({ params: { slug } }) => {
  const сaseStudies = await getAllWpCaseStudiesPosts();
  const categories = await getAllWpCaseStudiesCategories();
  const category = categories.find((cat) => cat.slug === slug);
  const сaseStudiesByCategory = сaseStudies.filter((caseStudy) =>
    caseStudy.caseStudiesCategories.nodes.some((cat) => cat.slug === slug)
  );

  if (!сaseStudiesByCategory || !category) return notFound();

  return (
    <Layout>
      <Hero items={сaseStudies} />
      <Cards items={сaseStudiesByCategory} categories={categories} activeCategory={category} />
      <CTA
        title="Ready to get started with Neon?"
        description="Interested in increasing your free tier limits or learning about pricing? Complete the form below to get in touch"
        buttonText="Contact sales"
        buttonUrl={LINKS.contactSales}
      />
    </Layout>
  );
};

export async function generateStaticParams() {
  const categories = await getAllWpCaseStudiesCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export const revalidate = 60;

export default CaseStudiesPage;
