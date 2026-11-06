import { registryTemplateSourceUrl } from 'utils/function-registry';

const getTemplatePrompt = (template) =>
  `Add the ${template.title} template to my existing Neon project. Read the template metadata and source at ${registryTemplateSourceUrl(template)}. Use the Neon CLI to run \`neon functions new ${template.id}\`. Review the generated function code and neon.ts, select the operations I need, configure the required environment variables, adapt the function to my project, and test it locally with \`neon dev\`.`;

export default getTemplatePrompt;
