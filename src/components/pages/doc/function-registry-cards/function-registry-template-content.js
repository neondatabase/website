import { registryTemplateSourceUrl } from 'utils/function-registry';

const escapeMdx = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');

const escapeMdxCell = (value) => escapeMdx(value).replace(/\|/g, '\\|');

const isInlineCodeSafe = (value) => typeof value === 'string' && value && !/[`\r\n]/.test(value);

const markdownTable = (headers, rows) => {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '--------').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
};

const providerMentionsTitle = (template) => {
  const provider = typeof template.provider === 'string' ? template.provider.trim() : '';
  if (!provider) return false;
  if (provider.toLowerCase() === 'neon') return false;
  return template.title.toLowerCase().includes(provider.toLowerCase());
};

const shouldNameProvider = (template) => {
  const provider = typeof template.provider === 'string' ? template.provider.trim() : '';
  if (!provider) return false;
  if (provider.toLowerCase() === 'neon') return false;
  return !providerMentionsTitle(template);
};

const recommendedTitles = (operations) =>
  operations.filter((item) => item.recommended).map((item) => item.title);

const recommendedSentence = (operations) => {
  const rec = recommendedTitles(operations);
  if (rec.length === 1) {
    return ` The catalog marks ${escapeMdx(rec[0])} as recommended.`;
  }
  if (rec.length > 1) {
    const listed = rec.map((title) => escapeMdx(title));
    const last = listed.pop();
    return ` The catalog marks ${listed.join(', ')} and ${last} as recommended.`;
  }
  return '';
};

export const buildFunctionRegistryTemplateContent = (template) => {
  const sections = [];
  const sourceUrl = registryTemplateSourceUrl(template);
  const operations = Array.isArray(template.operations) ? template.operations : [];
  const environment = Array.isArray(template.environment)
    ? template.environment.filter((item) => isInlineCodeSafe(item.name))
    : [];

  const intro = [escapeMdx(template.description)];
  if (shouldNameProvider(template)) {
    intro.push(`This template is from ${escapeMdx(template.provider)}.`);
  }
  sections.push(intro.join(' '));

  sections.push('## Install');
  sections.push(
    'Install the [Neon CLI](/docs/cli/install) globally if you need it, then add this template. The command copies files into `functions/<slug>/` and declares the function in [`neon.ts`](/docs/reference/neon-ts).'
  );
  sections.push(
    '```bash\nnpm i -g neon@latest\nneon functions new ' + escapeMdx(template.id) + '\n```'
  );
  sections.push(
    '<p className="mt-2! text-[13px] leading-snug text-gray-new-50 dark:text-gray-new-60">Registry commands need CLI 8.11.0 or later.</p>'
  );

  if (operations.length) {
    sections.push('## What this function exposes');
    sections.push(
      `After you deploy, call these paths on the function URL.${recommendedSentence(operations)}`
    );

    operations.forEach((item) => {
      sections.push(`### ${escapeMdx(item.title)}`);
      const body = [escapeMdx(item.description)];
      if (isInlineCodeSafe(item.route)) {
        body.push(`The route is \`${item.route}\`.`);
      }
      if (isInlineCodeSafe(item.slug)) {
        body.push(`The function slug is \`${item.slug}\`.`);
      }
      if (isInlineCodeSafe(item.source)) {
        body.push(`The handler is \`${item.source}\`.`);
      }
      sections.push(body.join(' '));
      if (typeof item.id === 'string' && item.id) {
        sections.push(
          '```bash\nneon functions new ' +
            escapeMdx(template.id) +
            ' --operation ' +
            escapeMdx(item.id) +
            '\n```'
        );
      }
    });
  } else {
    sections.push('## What it does');
    sections.push(
      'This is a starting handler you can replace. Run it locally with [`neon dev`](/docs/cli/dev), send a request, and you get a JSON response. Put it on a branch with [`neon deploy`](/docs/compute/functions/deploy).'
    );
  }

  if (environment.length) {
    sections.push('## Environment variables');
    sections.push(
      'The CLI declares these names in `neon.ts` and adds them, without values, to `.env.example`. Set the values locally. See [environment variables](/docs/compute/functions/environment-variables).'
    );
    sections.push(
      markdownTable(
        ['Variable', 'Description'],
        environment.map((item) => [`\`${item.name}\``, escapeMdxCell(item.description)])
      )
    );
  }

  if (operations.length) {
    sections.push('## Run it');
    sections.push(
      "Installing a template doesn't deploy it. Run it locally with [`neon dev`](/docs/cli/dev), then put it on a branch with [`neon deploy`](/docs/compute/functions/deploy)."
    );
  }

  sections.push('## Related');
  sections.push(
    [
      `- [Template source](${sourceUrl})`,
      '- [All registry templates](/docs/compute/functions/registry/templates)',
      '- [Function Registry](/docs/compute/functions/registry)',
      '- [`neon functions new`](/docs/cli/functions#new)',
    ].join('\n')
  );

  sections.push('<NeedHelp/>');

  return sections.join('\n\n');
};
