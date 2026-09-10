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

  it('keeps exactly three independent capability prompts in Add more to your backend', () => {
    const addMore = section(page, 'Add more to your backend', 'Try changes safely with branching');
    const promptLabels = [...addMore.matchAll(/filename="Prompt: ([^"]+)"/g)].map(
      ([, label]) => label
    );
    const promptBodies = [...addMore.matchAll(/```text[^\n]*\n([\s\S]*?)\n```/g)].map(
      ([, body]) => body
    );

    expect(addMore).toContain(
      'You now have a working backend. Each prompt below adds another Neon capability. They are independent, so add whichever you want, in any order.'
    );
    expect(addMore).toContain(
      '**Add authentication** so readers sign in to publish while anyone can still read:'
    );
    expect(addMore).toContain(
      '**Save each post as a file** in object storage, with a download link:'
    );
    expect(addMore).toContain('**Generate an AI summary** for every post:');
    expect(promptLabels).toEqual(['add sign-in', 'save posts as files', 'add AI summaries']);
    expect(promptBodies).toHaveLength(3);
    expect(addMore).toContain(
      'Update neon.ts to declare Managed Better Auth, then run neon deploy to apply and provision it.'
    );
    expect(addMore).toContain(
      'Update neon.ts to declare Object Storage, then run neon deploy to apply and provision it.'
    );
    expect(addMore).toContain(
      'Update neon.ts to declare AI Gateway, then run neon deploy to apply and provision it.'
    );
    expect(addMore).not.toContain('branch');
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
    const terminalRecipes = [...branching.matchAll(/```bash[^\n]*\n([\s\S]*?)\n```/g)].map(
      ([, body]) => body
    );

    expect(branching).toContain('instant, isolated copy of your backend');
    expect(branching).toContain('including your data and its stored files');
    expect(branching).toContain('without affecting your main branch');
    expect(branching).toContain(
      '```text shouldWrap filename="Prompt: make a change on a branch (this one deletes every post)"'
    );
    expect(branching).not.toContain(
      '**Prompt: make a change on a branch (this one deletes every post)**'
    );
    expect(promptBody).toBeDefined();
    expect(promptBody).toContain('npx neon@latest branches create --name my-feature');
    expect(promptBody).toContain('npx neon@latest checkout my-feature');
    expect(promptBody).toContain("Restart the dev server so it uses the branch's DATABASE_URL.");
    expect(promptBody).toContain(
      'delete every post and its stored Markdown file, and show me the blog feed is now empty'
    );
    expect(promptBody).not.toContain('checkout main');
    expect(promptBody).not.toContain('branches delete');
    expect(promptBody).not.toContain('Switch back');
    expect(promptBody).not.toContain('`');

    expect(branching).toContain(
      'Reload the page and the feed is now empty. Your app is pointed at the branch where you deleted every post, but your main branch still has all the posts and their files. Switch back to verify:'
    );
    expect(terminalRecipes).toEqual([
      'npx neon@latest checkout main',
      'npx neon@latest branches delete my-feature',
    ]);
    expect(branching).toContain(
      "Reload the page and you'll now see your posts are back (restart the dev server if you don't see them). Your main branch was unaffected by changes to your feature branch."
    );
    expect(branching).toContain('You can delete the feature branch when done:');
    expect(branching).toContain(
      "If you want each code branch to get its own preview URL with a matching database branch, see [Neon's preview deployments guide](/docs/guides/neon-managed-vercel-integration)."
    );
    expect(page).not.toContain('—');
  });
});
