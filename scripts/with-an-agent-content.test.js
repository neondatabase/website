import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const page = fs.readFileSync(
  path.resolve(process.cwd(), 'content/docs/get-started/with-an-agent.md'),
  'utf8'
);

function section(markdown, heading, nextHeading) {
  const start = markdown.indexOf(`## ${heading}`);
  const end = nextHeading ? markdown.indexOf(`## ${nextHeading}`, start + 1) : markdown.length;

  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);

  return markdown.slice(start, end);
}

describe('with-an-agent quickstart content contract', () => {
  it('keeps the init flow scoped to the new app and configures a starter neon.ts', () => {
    expect(page).toContain(
      'npx create-next-app@latest my-app --yes --app\ncd my-app\nnpx neon@latest init'
    );
    expect(page).toContain(
      'When `neon init` asks "Manage this project\'s Neon setup as code?", choose **Yes**.'
    );
    expect(page).toContain('select **no** optional services for now');
    expect(page).toContain('This scaffolds a starter `neon.ts`');

    const initGuidance = page.indexOf('When `neon init` asks');
    const openAgent = page.indexOf('Open your AI coding agent');
    const buildHeading = page.indexOf('## Build your app with one prompt');

    expect(initGuidance).toBeLessThan(openAgent);
    expect(openAgent).toBeLessThan(buildHeading);
    expect(page).not.toContain('choose **No**');
    expect(page).not.toContain('neon env pull');
  });

  it('keeps exactly three plain-text service prompts in Keep building', () => {
    const keepBuilding = section(page, 'Keep building', 'Try changes safely with branching');
    const promptLabels = [...keepBuilding.matchAll(/filename="Prompt: ([^"]+)"/g)].map(
      ([, label]) => label
    );
    const promptBodies = [...keepBuilding.matchAll(/```text[^\n]*\n([\s\S]*?)\n```/g)].map(
      ([, body]) => body
    );

    expect(promptLabels).toEqual(['add sign-in', 'save posts as files', 'add AI summaries']);
    expect(promptBodies).toHaveLength(3);
    expect(keepBuilding).toContain(
      'Update neon.ts to declare Managed Better Auth, then run neon deploy to apply and provision it.'
    );
    expect(keepBuilding).toContain(
      'Update neon.ts to declare Object Storage, then run neon deploy to apply and provision it.'
    );
    expect(keepBuilding).toContain(
      'Update neon.ts to declare AI Gateway, then run neon deploy to apply and provision it.'
    );
    expect(keepBuilding).not.toContain('branch');
    expect(promptBodies.every((body) => !body.includes('`'))).toBe(true);
    expect(page).not.toContain('Prompt: add image uploads');
    expect(page).not.toContain('Follow the [Next.js auth quickstart]');
    expect(page).not.toContain(
      'Object Storage runs in the AWS US East (Ohio) region. AI Gateway requires a paid Neon plan.'
    );
  });

  it('stops the agent at an empty feed, then gives the reader restore commands', () => {
    const branching = section(page, 'Try changes safely with branching');
    const promptBody = branching.match(/```text[^\n]*\n([\s\S]*?)\n```/)?.[1];
    const terminalRecipe = branching.match(/```bash[^\n]*\n([\s\S]*?)\n```/)?.[1];

    expect(branching).toContain('instant, isolated copy of your database');
    expect(branching).toContain('current data and schema');
    expect(promptBody).toBeDefined();
    expect(promptBody).toContain('npx neon@latest branches create --name my-feature');
    expect(promptBody).toContain('npx neon@latest checkout my-feature');
    expect(promptBody).toContain("Restart the dev server so it uses the branch's DATABASE_URL.");
    expect(promptBody).toContain('delete every post and show me the blog feed is now empty');
    expect(promptBody).not.toContain('checkout main');
    expect(promptBody).not.toContain('branches delete');
    expect(promptBody).not.toContain('Switch back');
    expect(promptBody).not.toContain('`');

    expect(branching).toContain('The feed is empty only on the branch');
    expect(branching).toContain('your production data is untouched');
    expect(branching).toContain('Switching back rewrites `DATABASE_URL` in your local env file');
    expect(branching).toContain('Next.js reads it only at startup');
    expect(branching).toContain('a browser refresh alone is not enough');
    expect(terminalRecipe).toBeDefined();
    expect(terminalRecipe).toContain('npx neon@latest checkout main');
    expect(terminalRecipe).toContain('Restart your dev server, then refresh the page');
    expect(terminalRecipe).toContain('npx neon@latest branches delete my-feature');
    expect(branching).toContain(
      "[Neon's preview deployments guide](/docs/guides/neon-managed-vercel-integration)"
    );
  });
});
