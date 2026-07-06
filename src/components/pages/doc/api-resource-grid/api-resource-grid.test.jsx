import { describe, expect, it } from 'vitest';

import { buildApiResourceList } from './api-resource-grid';

describe('buildApiResourceList', () => {
  it('keeps configured tags in configured order and appends generated tags', () => {
    const resources = buildApiResourceList({
      configuredTags: [
        {
          slug: 'projects',
          display: 'Projects',
          description: 'Manage Neon projects.',
        },
        {
          slug: 'branches',
          display: 'Branches',
          description: 'Manage branches.',
        },
      ],
      discoveredResources: {
        'generated-tag': { display: 'Generated tag', count: 2 },
        branches: { display: 'Branches', count: 3 },
        projects: { display: 'Projects', count: 4 },
      },
    });

    expect(resources.map((resource) => resource.tag)).toEqual([
      'projects',
      'branches',
      'generated-tag',
    ]);
    expect(resources[2]).toMatchObject({
      display: 'Generated tag',
      count: 2,
      description: 'Generated API endpoints for Generated tag.',
    });
  });

  it('uses a fallback description for configured tags without descriptions', () => {
    const resources = buildApiResourceList({
      configuredTags: [{ slug: 'billing', display: 'Billing' }],
      discoveredResources: {
        billing: { display: 'Billing', count: 1 },
      },
    });

    expect(resources[0]).toMatchObject({
      tag: 'billing',
      description: 'Generated API endpoints for Billing.',
    });
  });
});
