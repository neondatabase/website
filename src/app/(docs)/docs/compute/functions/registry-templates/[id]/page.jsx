import { permanentRedirect } from 'next/navigation';

export const dynamicParams = true;

const LegacyRegistryTemplatePage = async ({ params }) => {
  const { id } = await params;
  permanentRedirect(`/docs/compute/functions/registry/templates/${id}`);
};

export default LegacyRegistryTemplatePage;
