/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import { getPostBySlug, getPostSlugs } from 'utils/api-content';

const getPageType = (slug) => {
  const templatePage = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (templatePage) {
    const { template } = templatePage.data || {};
    if (template === 'Static') return 'static';
    if (template === 'Landing') return 'landing';
    return 'template';
  }

  return null;
};

const SinglePage = async (props) => {
  const params = await props.params;
  const { slug } = params;
  const pageType = getPageType(slug);

  if (pageType === 'landing') {
    const { default: LandingPage } = await import('./pages/landing-page');
    return <LandingPage params={params} />;
  }

  if (pageType === 'static') {
    const { default: StaticPage } = await import('./pages/static-page');
    return <StaticPage params={params} />;
  }

  if (pageType === 'template') {
    const { default: TemplatePage } = await import('./pages/template-page');
    return <TemplatePage params={params} />;
  }

  return notFound();
};

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const pageType = getPageType(slug);

  if (pageType === 'landing') {
    const mod = await import('./pages/landing-page');
    if (mod.generateMetadata) {
      return mod.generateMetadata({ params });
    }
    return null;
  }

  if (pageType === 'static') {
    const mod = await import('./pages/static-page');
    if (mod.generateMetadata) {
      return mod.generateMetadata({ params });
    }
    return null;
  }

  if (pageType === 'template') {
    const mod = await import('./pages/template-page');
    if (mod.generateMetadata) {
      return mod.generateMetadata({ params });
    }
    return null;
  }

  return null;
}

export async function generateStaticParams() {
  const templateSlugs = await getPostSlugs(TEMPLATE_PAGES_DIR_PATH);
  // Only top-level pages: nested ones (use-cases/*, programs/*) are built by their own routes.
  return templateSlugs
    .map((slug) => slug.slice(1))
    .filter((slug) => !slug.includes('/'))
    .map((slug) => ({ slug }));
}

// Only serve the slugs above; anything else, like an encoded slash (/use-cases%2Fai-agents), is a 404.
export const dynamicParams = false;

export const revalidate = 60;

export default SinglePage;
