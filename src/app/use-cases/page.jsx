import Hero from 'components/pages/use-cases/hero';
import UseCaseCards from 'components/pages/use-cases/use-case-cards';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getAllWpUseCases } from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.useCases);

const getCaseStudyLink = (caseStudyPost) => {
  if (caseStudyPost?.isInternal && caseStudyPost?.post?.slug) {
    return `/blog/${caseStudyPost.post.slug}`;
  }
  return caseStudyPost?.externalUrl;
};

const transformUseCasesData = (items) =>
  items.map((item) => {
    const caseStudy = item.useCase?.linkedCaseStudy?.[0];
    const caseStudyPost = caseStudy?.caseStudyPost;

    if (!caseStudyPost) return null;

    return {
      icon: item.useCase?.icon,
      title: item.title,
      description: item.useCase?.description,
      link: item.useCase?.link?.url,
      logo: caseStudyPost?.logo,
      testimonial: {
        quote: caseStudyPost?.quote?.trim() || '',
        author: `${caseStudyPost.author?.name}${caseStudyPost.author?.post ? ` – ${caseStudyPost.author.post}` : ''}`,
        caseStudyLink: getCaseStudyLink(caseStudyPost),
      },
      tags: item.useCaseTags?.nodes?.map((tag) => ({ title: tag.name, slug: tag.slug })) || [],
    };
  });

const UseCasesPage = async () => {
  const useCases = await getAllWpUseCases();
  const useCasesData = transformUseCasesData(useCases);

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

export const revalidate = 60;

export default UseCasesPage;
