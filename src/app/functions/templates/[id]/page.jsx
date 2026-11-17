/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import TemplateDetail from 'components/pages/functions/templates/template-detail';
import VERCEL_URL from 'constants/base';
import { getFunctionTemplateInstalls } from 'utils/api-function-template-installs';
import {
  getFunctionRegistryCatalog,
  getFunctionRegistryTemplatePage,
  getFunctionRegistryTemplateReadme,
  registryTemplatePageHref,
} from 'utils/function-registry';
import getMetadata from 'utils/get-metadata';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const templates = await getFunctionRegistryCatalog();
  return templates.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const page = await getFunctionRegistryTemplatePage(id);
  if (!page) return notFound();

  const pathname = registryTemplatePageHref(page.template.id);

  return getMetadata({
    title: `${page.template.title} — Function Registry`,
    description: page.template.description,
    imagePath: `${VERCEL_URL}${pathname}/og`,
    pathname,
    type: 'article',
  });
}

const FunctionTemplatePage = async ({ params }) => {
  const { id } = await params;
  const page = await getFunctionRegistryTemplatePage(id);
  if (!page) return notFound();
  const [readme, installs] = await Promise.all([
    getFunctionRegistryTemplateReadme(page.template),
    getFunctionTemplateInstalls(page.template.id),
  ]);
  return <TemplateDetail {...page} readme={readme} installs={installs} />;
};

export default FunctionTemplatePage;
