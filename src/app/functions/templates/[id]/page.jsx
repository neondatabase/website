/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';
import { cache } from 'react';

import TemplateDetail from 'components/pages/functions/templates/template-detail';
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

const getTemplatePage = cache(getFunctionRegistryTemplatePage);

export async function generateStaticParams() {
  const templates = await getFunctionRegistryCatalog();
  return templates.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const page = await getTemplatePage(id);
  if (!page) return notFound();

  return getMetadata({
    title: `${page.template.title} — Function Registry`,
    description: page.template.description,
    pathname: registryTemplatePageHref(page.template.id),
    type: 'article',
  });
}

const FunctionTemplatePage = async ({ params }) => {
  const { id } = await params;
  const page = await getTemplatePage(id);
  if (!page) return notFound();

  const [readme, installs] = await Promise.all([
    getFunctionRegistryTemplateReadme(page.template),
    getFunctionTemplateInstalls(page.template.id),
  ]);
  return (
    <TemplateDetail
      template={page.template}
      templates={page.templates}
      readme={readme}
      installs={installs}
    />
  );
};

export default FunctionTemplatePage;
