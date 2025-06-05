/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import { getPostBySlug } from 'utils/api-docs';
import { getWpPageBySlug } from 'utils/api-pages';

const SinglePage = async ({ params }) => {
  const { slug } = params;

  // Check if it's a markdown template page
  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (post) {
    // Dynamically import the TemplatePage component
    const { default: TemplatePage } = await import('./pages/template-page');
    return <TemplatePage params={params} />;
  }

  // Check if it's a WP page
  const wpPage = await getWpPageBySlug(slug);
  if (wpPage) {
    // Dynamically import the WpPage component
    const { default: WpPage } = await import('./pages/wp-page');
    return <WpPage params={params} />;
  }

  // Not found
  return notFound();
};

export default SinglePage;
