/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import { buildFunctionRegistryTemplateContent } from 'components/pages/doc/function-registry-cards/function-registry-template-content';
import FunctionRegistryTemplateIntro from 'components/pages/doc/function-registry-cards/function-registry-template-intro';
import FunctionRegistryWebsiteLink from 'components/pages/doc/function-registry-cards/function-registry-website-link';
import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import LINKS from 'constants/links';
import {
  getFunctionRegistryCatalog,
  getFunctionRegistryTemplate,
  registryTemplateDocsSlug,
} from 'utils/function-registry';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const templates = await getFunctionRegistryCatalog();
  return templates.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const template = await getFunctionRegistryTemplate(id);
  if (!template) return notFound();

  const encodedTitle = Buffer.from(template.title).toString('base64');
  const encodedCategory = Buffer.from('Registry').toString('base64');
  const currentSlug = registryTemplateDocsSlug(template.id);

  return getMetadata({
    title: `${template.title} - Neon Docs`,
    description: template.description,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${currentSlug}`,
    type: 'article',
  });
}

const FunctionRegistryTemplatePage = async ({ params }) => {
  const { id } = await params;
  const [template, templates] = await Promise.all([
    getFunctionRegistryTemplate(id),
    getFunctionRegistryCatalog(),
  ]);

  if (!template) return notFound();

  const currentSlug = registryTemplateDocsSlug(template.id);
  const content = buildFunctionRegistryTemplateContent(template);
  const tableOfContents = getTableOfContents(content);
  const currentIndex = templates.findIndex((item) => item.id === template.id);
  const previous = templates[currentIndex - 1];
  const next = templates[currentIndex + 1];

  return (
    <Post
      data={{ title: template.title, enableTableOfContents: true, hideCopyPage: true }}
      content={content}
      breadcrumbs={[
        { title: 'Functions', slug: 'compute/functions/overview' },
        { title: 'Registry', slug: 'compute/functions/registry' },
        { title: 'Templates', slug: 'compute/functions/registry/templates' },
        { title: template.title },
      ]}
      navigationLinks={{
        previousLink: previous
          ? { title: previous.title, slug: registryTemplateDocsSlug(previous.id) }
          : { title: 'Templates', slug: 'compute/functions/registry/templates' },
        nextLink: next ? { title: next.title, slug: registryTemplateDocsSlug(next.id) } : null,
      }}
      currentSlug={currentSlug}
      gitHubPath="content/docs/compute/functions/registry/templates.md"
      tableOfContents={tableOfContents}
      titleLeading={<FunctionRegistryTemplateIntro template={template} />}
      aboveContent={
        <FunctionRegistryWebsiteLink className="mt-3 inline-block" template={template} />
      }
    />
  );
};

export default FunctionRegistryTemplatePage;
