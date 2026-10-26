import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import { describe, expect, it } from 'vitest';

import rehypeTaskListLabels from './rehype-task-list-labels';

describe('Markdown task list accessibility', () => {
  it('names checkboxes from their own text without including nested tasks', async () => {
    const { content } = await compileMDX({
      source: '- [x] Update **schema**\n  - [ ] Run `migrations`\n- [ ] Check the deployment',
      options: {
        mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeTaskListLabels] },
      },
    });
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(content);
    const checkboxes = [...container.querySelectorAll('input')];

    expect(checkboxes.map((input) => input.getAttribute('aria-label'))).toEqual([
      'Update schema',
      'Run migrations',
      'Check the deployment',
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([true, false, false]);
    expect(checkboxes.every((input) => input.disabled)).toBe(true);
  });
});
