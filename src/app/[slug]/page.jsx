/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import { getPostBySlug, getPostSlugs } from 'utils/api-docs';
import { getWpPageBySlug } from 'utils/api-pages';

const getPageType = async (slug) => {
  if (slug === 'wp-draft-post-preview-page') return 'wp-draft';

  const templatePage = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (templatePage) return 'template';

  const wpPage = await getWpPageBySlug(slug);
  if (wpPage) return 'wp';

  return null;
};

const SinglePage = async ({ params, searchParams }) => {
  const { slug } = params;
  const pageType = await getPageType(slug);

  if (pageType === 'template') {
    const { default: TemplatePage } = await import('./pages/template-page');
    return <TemplatePage params={params} />;
  }

  if (pageType === 'wp') {
    const { default: WpPage } = await import('./pages/wp-page');
    return <WpPage params={params} />;
  }

  if (pageType === 'wp-draft') {
    const { default: WpDraftPage } = await import('./pages/wp-draft-page');
    return <WpDraftPage searchParams={searchParams} />;
  }

  return notFound();
};

export async function generateMetadata({ params, searchParams }) {
  const { slug } = params;
  const pageType = await getPageType(slug);

  if (pageType === 'template') {
    const mod = await import('./pages/template-page');
    if (mod.generateMetadata) {
      return mod.generateMetadata({ params });
    }
    return null;
  }

  if (pageType === 'wp') {
    const mod = await import('./pages/wp-page');
    if (mod.generateMetadata) {
      return mod.generateMetadata({ params });
    }
    return null;
  }

  if (pageType === 'wp-draft') {
    const mod = await import('./pages/wp-draft-page');
    if (mod.generateMetadata) {
      return mod.generateMetadata({ searchParams });
    }
    return null;
  }

  return null;
}

export async function generateViewport({ params }) {
  const { slug } = params;
  const pageType = await getPageType(slug);

  if (pageType === 'wp') {
    const mod = await import('./pages/wp-page');
    if (mod.generateViewport) {
      return mod.generateViewport({ params });
    }
  }

  return undefined;
}

export async function generateStaticParams() {
  const templateSlugs = await getPostSlugs(TEMPLATE_PAGES_DIR_PATH);
  const templateParams = templateSlugs.map((slug) => ({
    slug: slug.slice(1),
  }));

  const wpMod = await import('./pages/wp-page');
  const wpParams = (await wpMod.generateStaticParams?.()) || [];

  return [...templateParams, ...wpParams];
}

export const revalidate = 60;

export default SinglePage;
