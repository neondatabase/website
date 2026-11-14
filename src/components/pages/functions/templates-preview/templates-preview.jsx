import FunctionRegistryTemplateCard from 'components/pages/functions/templates/registry/template-card';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';
import { getFunctionRegistryCatalog, registryTemplatePageHref } from 'utils/function-registry';

const PREVIEW_COUNT = 6;

const TemplatesPreview = async () => {
  const templates = await getFunctionRegistryCatalog();
  if (templates.length === 0) return null;

  const preview = templates.slice(0, PREVIEW_COUNT);

  return (
    <section
      className="bg-black-pure py-20 text-white lg:py-16 md:py-12"
      aria-labelledby="function-templates-heading"
    >
      <Container size="1344">
        <div className="flex items-end justify-between gap-8 lg:flex-col lg:items-start lg:gap-5">
          <div className="max-w-3xl">
            <h2
              id="function-templates-heading"
              className="text-[2.75rem] leading-[1.15] font-normal tracking-tighter xl:text-[2.5rem] lg:text-[2.125rem] md:text-[1.75rem]"
            >
              Start from a Function Registry template
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-normal tracking-extra-tight text-gray-new-60 md:text-base">
              Open-source functions you add to a Neon project with one command
            </p>
          </div>
          <Button
            className="h-11 shrink-0 px-7 text-base font-medium tracking-extra-tight xl:h-9 xl:px-[18px] xl:text-sm"
            theme="white-filled"
            to={LINKS.functionsTemplates}
            tagName="Functions Templates Preview"
          >
            Browse all templates
          </Button>
        </div>
        <ul className="mt-12 grid grid-cols-3 gap-5 lg:mt-10 md:grid-cols-2 sm:grid-cols-1">
          {preview.map((template, index) => (
            <FunctionRegistryTemplateCard
              variant="catalog"
              key={template.id}
              template={template}
              href={registryTemplatePageHref(template.id)}
              eager={index < 3}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default TemplatesPreview;
