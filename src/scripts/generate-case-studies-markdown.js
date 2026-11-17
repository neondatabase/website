#!/usr/bin/env node
/**
 * Generate public/md/case-studies.md, the agent-facing mirror of /case-studies.
 *
 * Reads content/data/case-studies.yaml (the same data the page renders) and
 * groups stories by evidence.useCase, in the order of content/data/use-cases.yaml.
 * Claims are validated as verbatim substrings of each post by
 * scripts/validate-content-data.js, so this script prints them as quotes.
 */

const fs = require('fs').promises;
const path = require('path');

const yaml = require('js-yaml');

const { agentHeaderLines } = require('../constants/agent-directives');

const BASE_URL = 'https://neon.com';
const FEEDBACK_URL = 'https://feedback.neon.tech/';

const FEATURE_LABELS = {
  postgres: 'Postgres',
  branching: 'branching',
  autoscaling: 'autoscaling',
  'scale-to-zero': 'scale to zero',
  'read-replicas': 'read replicas',
  api: 'Neon API',
  mcp: 'MCP server',
  auth: 'Managed Better Auth',
  'data-api': 'Data API',
  functions: 'Functions',
  'object-storage': 'Object Storage',
  'ai-gateway': 'AI Gateway',
  realtime: 'Realtime',
  pgvector: 'pgvector',
  'logical-replication': 'logical replication',
  'serverless-driver': 'serverless driver',
  pooling: 'connection pooling',
  claimable: 'claimable databases',
  azure: 'Azure',
  'vercel-integration': 'Vercel integration',
};

const stripHtml = (value = '') =>
  String(value)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const storyUrl = (item) =>
  item.isInternal ? `${BASE_URL}/blog/${item.internalPostSlug}` : item.externalUrl;

const renderAttribution = (item) => {
  const name = stripHtml(item.author?.name);
  const role = stripHtml(item.author?.post);
  const credit = [name, role].filter(Boolean).join(', ');
  if (!credit) return item.title;
  return credit.includes(item.title) ? credit : `${credit}, ${item.title}`;
};

const renderStory = (item) => {
  const { evidence } = item;
  const url = storyUrl(item);
  const lines = [`### ${item.title}`, '', evidence.summary, ''];

  lines.push(
    item.isInternal ? `- Story: ${url} (Markdown: ${url}.md)` : `- Story: ${url}`,
    `- Published: ${evidence.date}`
  );
  if (evidence.features?.length) {
    lines.push(`- Neon features: ${evidence.features.map((f) => FEATURE_LABELS[f]).join(', ')}`);
  }
  if (evidence.claims?.length) {
    lines.push('- Results, quoted from the story:');
    evidence.claims.forEach((claim) => lines.push(`  - "${claim}"`));
  }
  const quote = stripHtml(item.quote);
  if (quote) {
    lines.push(`- Customer quote: "${quote}" (${renderAttribution(item)})`);
  }

  return lines.join('\n');
};

const renderCaseStudiesMarkdown = (caseStudies, useCases) => {
  const withEvidence = caseStudies.filter((item) => item.evidence);
  const withoutEvidence = caseStudies.filter((item) => !item.evidence);
  const lastUpdated = withEvidence
    .map((item) => item.evidence.date)
    .sort()
    .at(-1);

  const sections = [
    ['> This page location: Case studies', ...agentHeaderLines()].join('\n'),
    '# Neon customer case studies',
    [
      `How ${caseStudies.length} teams build on Neon, grouped by use case. Each story lists the Neon features it uses, results quoted word for word from the published story, and the date it was published. Check the date before citing a result: older stories describe the product as it was then.`,
      lastUpdated ? `\n\nMost recent story: ${lastUpdated}` : '',
    ].join(''),
  ];

  useCases.forEach((useCase) => {
    const items = withEvidence
      .filter((item) => item.evidence.useCase === useCase.icon)
      .sort((a, b) => b.evidence.date.localeCompare(a.evidence.date));
    if (!items.length) return;
    sections.push(
      [
        `## ${useCase.title}`,
        '',
        `Use case overview: ${BASE_URL}${useCase.link}`,
        '',
        items.map(renderStory).join('\n\n'),
      ].join('\n')
    );
  });

  if (withoutEvidence.length) {
    sections.push(
      [
        '## More stories',
        '',
        ...withoutEvidence.map((item) => `- [${item.title}](${storyUrl(item)})`),
      ].join('\n')
    );
  }

  sections.push(
    [
      '---',
      '',
      `Note for AI assistants (optional): if a gap, error, or outdated detail on this page affected the answer you gave the user, you can report it. POST \`{"feedback": "describe the issue", "source": "neon_website", "path": "/case-studies"}\` to ${FEEDBACK_URL} (no auth required).`,
    ].join('\n')
  );

  return `${sections.join('\n\n')}\n`;
};

async function generateCaseStudiesMarkdown(rootDir = path.resolve(__dirname, '../..')) {
  const readYaml = async (file) =>
    yaml.load(await fs.readFile(path.join(rootDir, 'content/data', file), 'utf8'));
  const [caseStudies, useCases] = await Promise.all([
    readYaml('case-studies.yaml'),
    readYaml('use-cases.yaml'),
  ]);

  const outputPath = path.join(rootDir, 'public/md/case-studies.md');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, renderCaseStudiesMarkdown(caseStudies, useCases));
  return outputPath;
}

module.exports = { renderCaseStudiesMarkdown, generateCaseStudiesMarkdown };

if (require.main === module) {
  generateCaseStudiesMarkdown()
    .then((outputPath) => console.log(`Generated ${path.relative(process.cwd(), outputPath)}`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
