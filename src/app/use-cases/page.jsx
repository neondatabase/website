import Hero from 'components/pages/use-cases/hero';
import UseCaseCards from 'components/pages/use-cases/use-case-cards';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getUseCasesCards } from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.useCases);
export const revalidate = 60;

// Get case study link based on isInternal flag
const getCaseStudyLink = (caseStudyPost) => {
  if (!caseStudyPost) return null;
  if (caseStudyPost.isInternal && caseStudyPost.post?.slug) {
    return `/blog/${caseStudyPost.post.slug}`;
  }
  return caseStudyPost.externalUrl || null;
};

// Transform WP data to match component props
const transformUseCasesData = (wpData) =>
  wpData.map((item) => {
    const caseStudy = item.linkedCaseStudy?.[0];
    const caseStudyPost = caseStudy?.caseStudyPost;

    return {
      icon: item.icon,
      title: item.title,
      description: item.description,
      link: item.link?.url,
      logo: caseStudyPost?.logo,
      testimonial: caseStudyPost
        ? {
            quote: caseStudyPost.quote,
            author: `${caseStudyPost.author?.name}${caseStudyPost.author?.post ? ` – ${caseStudyPost.author.post}` : ''}`,
            caseStudyLink: getCaseStudyLink(caseStudyPost),
          }
        : null,
      tags: item.tags?.map((tag) => ({ title: tag, icon: 'incognito' })) || [],
    };
  });

const UseCasesPage = async () => {
  const wpUseCases = await getUseCasesCards();
  const useCasesData = transformUseCasesData(wpUseCases);

  return (
    <Layout>
      <Hero />
      <UseCaseCards
        className="pb-48 pt-24 lg:pb-32 lg:pt-20 md:pb-24 md:pt-16"
        items={useCasesData}
      />
    </Layout>
  );
};

export default UseCasesPage;
