import { describe, it, expect } from 'vitest';

import { buildOperationToc } from '../operation-toc';

describe('buildOperationToc', () => {
  it('builds nested request-body section items and omits absent sections', () => {
    const toc = buildOperationToc({
      requestBody: {
        sections: [
          { id: 'basics', label: 'Basics' },
          { id: 'settings', label: 'Project settings' },
        ],
      },
      parameters: [{ name: 'org_id' }],
      response: { status: '201' },
      errors: [{ status: 'default' }],
    });

    expect(toc).toEqual([
      { title: 'Quick start', id: 'quick-start', level: 1, index: 0 },
      { title: 'Parameters', id: 'parameters', level: 1, index: 1 },
      {
        title: 'Request body',
        id: 'request-body',
        level: 1,
        index: 2,
        items: [
          { title: 'Basics', id: 'body-basics', level: 2, index: 3 },
          { title: 'Project settings', id: 'body-settings', level: 2, index: 4 },
        ],
      },
      { title: 'Response', id: 'response', level: 1, index: 5 },
      { title: 'Errors', id: 'errors', level: 1, index: 6 },
    ]);
  });

  it('omits request-body anchors when the body section will not render', () => {
    const toc = buildOperationToc(
      {
        requestBody: {
          sections: [{ id: 'basics', label: 'Basics' }],
        },
        response: { status: '200' },
      },
      { hasRequestBody: false }
    );

    expect(toc).toEqual([
      { title: 'Quick start', id: 'quick-start', level: 1, index: 0 },
      { title: 'Response', id: 'response', level: 1, index: 1 },
    ]);
  });
});
