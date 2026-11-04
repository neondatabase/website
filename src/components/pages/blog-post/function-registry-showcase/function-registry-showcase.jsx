import FunctionRegistryTemplateCard from 'components/pages/functions/templates/registry/template-card';
import LINKS from 'constants/links';
import { getFunctionRegistryCatalog, registryTemplatePageHref } from 'utils/function-registry';

const SHOWCASE_IDS = ['chat-sdk', 'mastra', 'context-dev', 'workos-sync', 'aiinbx'];

const pickShowcaseTemplates = (templates) => {
  const byId = new Map(templates.map((template) => [template.id, template]));
  return SHOWCASE_IDS.map((id) => byId.get(id)).filter(Boolean);
};

const FunctionRegistryShowcase = async () => {
  const templates = pickShowcaseTemplates(await getFunctionRegistryCatalog());

  if (templates.length === 0) {
    return (
      <p className="not-prose my-10 text-base text-gray-new-60">
        The catalog is temporarily unavailable.{' '}
        <a
          className="text-white underline underline-offset-2 transition-colors hover:text-green-45"
          href={LINKS.functionsTemplates}
        >
          Browse all function templates
        </a>
        .
      </p>
    );
  }

  return (
    <div className="not-prose my-10">
      <ul className="my-0! grid grid-cols-2 gap-4 pl-0! sm:grid-cols-1 [&>li]:my-0! [&>li]:before:content-none!">
        {templates.map((template, index) => (
          <FunctionRegistryTemplateCard
            key={template.id}
            template={template}
            href={registryTemplatePageHref(template.id)}
            eager={index < 2}
          />
        ))}
      </ul>
      <p className="mt-5 text-sm leading-snug text-gray-new-60">
        <a
          className="text-white underline underline-offset-2 transition-colors hover:text-green-45"
          href={LINKS.functionsTemplates}
        >
          Browse all templates
        </a>
      </p>
    </div>
  );
};

export default FunctionRegistryShowcase;
