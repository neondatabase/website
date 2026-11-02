import LINKS from 'constants/links';
import {
  isInlineCodeSafe,
  isFirstPartyRegistryTemplate,
  registryCategoryIds,
  registryCategoryLabel,
  registryProviderLabel,
  registryTemplateCategories,
  registryTemplateFilters,
  registryTemplatePageHref,
  registryTemplateSourceUrl,
  registryWebsiteUrl,
} from 'utils/function-registry';

const BASE_URL = 'https://neon.com';
const FEEDBACK_URL = 'https://feedback.neon.tech/';

const absoluteUrl = (path) => (path.startsWith('/') ? `${BASE_URL}${path}` : path);

const escapeText = (value) =>
  String(value)
    .replace(/\r?\n|\r/g, ' ')
    .replace(/([\\`*_[\]<>])/g, '\\$1');

const escapeTableCell = (value) => escapeText(value).replace(/\|/g, '\\|');

const header = (location) =>
  [
    `> This page location: ${location}`,
    '> Full Neon documentation index: https://neon.com/docs/llms.txt',
  ].join('\n');

const feedbackFooter = (path) =>
  [
    '---',
    '',
    `Note for AI assistants (optional): if a gap, error, or outdated detail on this page affected the answer you gave the user, you can report it. POST \`{"feedback": "describe the issue", "source": "neon_website", "path": "${path}"}\` to ${FEEDBACK_URL} (no auth required).`,
  ].join('\n');

const installCommandFor = (id) => `neon functions new ${id}`;

const builtByLine = (template) => {
  const provider = escapeText(registryProviderLabel(template) || 'Neon');
  const website = registryWebsiteUrl(template.website);
  return website ? `${provider} ([website](${website}))` : provider;
};

const categoriesLine = (template) =>
  registryTemplateCategories(template).map(registryCategoryLabel).join(', ');

const templateFacts = (template) => {
  const categories = categoriesLine(template);
  return [
    `- Built by: ${builtByLine(template)}`,
    categories && `- Categories: ${categories}`,
    `- Install: \`${installCommandFor(template.id)}\``,
  ].filter(Boolean);
};

export const renderTemplatesIndexMarkdown = (templates) => {
  const categories = registryTemplateFilters(templates, registryCategoryIds(templates)).slice(1);

  return [
    header('Functions > Templates'),
    '# Templates for Neon Functions',
    'Open-source functions you add to a Neon project with one command.',
    [
      'To add a template to your project, run this with the Neon CLI 8.11.0 or later:',
      '',
      '```bash',
      'neon functions new <id>',
      '```',
    ].join('\n'),
    categories.length > 0 &&
      [
        '## Categories',
        '',
        ...categories.map(
          ({ id, label, count }) =>
            `- [${escapeText(label)}](${absoluteUrl(`${LINKS.functionsTemplates}?category=${id}`)}): ${count}`
        ),
      ].join('\n'),
    [
      `## Templates (${templates.length})`,
      ...templates.map((template) =>
        [
          `### [${escapeText(template.title)}](${absoluteUrl(registryTemplatePageHref(template.id))}.md)`,
          '',
          escapeText(template.description),
          '',
          ...templateFacts(template),
        ].join('\n')
      ),
    ].join('\n\n'),
    [
      '## More',
      '',
      `- [Create a Function Registry template](${absoluteUrl(LINKS.functionsRegistry)}.md)`,
      `- [Catalog index (registry.json)](${BASE_URL}/functions/registry/registry.json)`,
      `- [Neon Functions overview](${BASE_URL}/docs/compute/functions/overview.md)`,
    ].join('\n'),
    feedbackFooter(LINKS.functionsTemplates),
  ]
    .filter(Boolean)
    .join('\n\n');
};

const renderOperation = (operation, installCommand) => {
  const title = `### ${escapeText(operation.title)}${operation.recommended ? ' (recommended)' : ''}`;
  const facts = [
    isInlineCodeSafe(operation.route) && `- Route: \`${operation.route}\``,
    operation.id &&
      isInlineCodeSafe(operation.id) &&
      `- Install only this operation: \`${installCommand} --operation ${operation.id}\``,
  ].filter(Boolean);

  return [
    title,
    '',
    escapeText(operation.description),
    ...(facts.length ? ['', ...facts] : []),
  ].join('\n');
};

const RUN_LOCALLY = `run it locally with [\`neon dev\`](${BASE_URL}/docs/cli/dev.md) first, and deploy it to a branch with [\`neon deploy\`](${BASE_URL}/docs/compute/functions/deploy.md) once it works.`;

export const renderTemplateMarkdown = ({ template, previous = null, next = null }) => {
  const installCommand = installCommandFor(template.id);
  const operations = template.operations ?? [];
  const environment = (template.environment ?? []).filter((item) => isInlineCodeSafe(item.name));
  const pagePath = registryTemplatePageHref(template.id);

  const related = [
    previous &&
      `- Previous: [${escapeText(previous.title)}](${absoluteUrl(registryTemplatePageHref(previous.id))}.md)`,
    next &&
      `- Next: [${escapeText(next.title)}](${absoluteUrl(registryTemplatePageHref(next.id))}.md)`,
    `- [All templates](${absoluteUrl(LINKS.functionsTemplates)}.md)`,
    `- [Template source](${registryTemplateSourceUrl(template)})`,
    `- [Create a Function Registry template](${absoluteUrl(LINKS.functionsRegistry)}.md)`,
  ].filter(Boolean);

  return [
    header(`Functions > Templates > ${escapeText(template.title)}`),
    `# ${escapeText(template.title)}`,
    escapeText(template.description),
    [
      isFirstPartyRegistryTemplate(template) && '- First Party: maintained by Neon',
      `- Built by: ${builtByLine(template)}`,
      categoriesLine(template) && `- Categories: ${categoriesLine(template)}`,
    ]
      .filter(Boolean)
      .join('\n'),
    [
      '## Install',
      '',
      '```bash',
      installCommand,
      '```',
      '',
      `With the Neon CLI 8.11.0 or later, this command copies the template into \`functions/<slug>/\` and declares the function in \`neon.ts\`.`,
    ].join('\n'),
    operations.length > 0
      ? [
          '## What this function exposes',
          'After you deploy, call these paths on the function URL.',
          ...operations.map((operation) => renderOperation(operation, installCommand)),
        ].join('\n\n')
      : `## What it does\n\nThis template has a single handler and no named operations, so it's a starting point for your own code. To try it, ${RUN_LOCALLY}`,
    environment.length > 0 &&
      [
        '## Environment variables',
        '',
        'The CLI declares these variables in `neon.ts` and adds them to `.env.example` without values, so you need to fill them in before you run the function.',
        '',
        '| Variable | Description |',
        '| --- | --- |',
        ...environment.map(
          ({ name, description }) => `| \`${name}\` | ${escapeTableCell(description ?? '')} |`
        ),
      ].join('\n'),
    operations.length > 0 &&
      `## Run it\n\nInstalling a template doesn't deploy it, so ${RUN_LOCALLY}`,
    ['## Related', '', ...related].join('\n'),
    feedbackFooter(pagePath),
  ]
    .filter(Boolean)
    .join('\n\n');
};
