import { registryTemplateSourceUrl } from 'utils/function-registry';

const getTemplatePrompt = (template) => {
  const sourceUrl = registryTemplateSourceUrl(template);
  return [
    `Add the ${template.title} template to my existing Neon project.`,
    sourceUrl && `Read the template metadata and source at ${sourceUrl}.`,
    `Use the Neon CLI to run \`neon functions new ${template.id}\`.`,
    'Review the generated function code and neon.ts, select the operations I need, configure the required environment variables, adapt the function to my project, and test it locally with `neon dev`.',
  ]
    .filter(Boolean)
    .join(' ');
};

export default getTemplatePrompt;
