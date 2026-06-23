import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import OperationDoc from '../operation-doc';

const operation = {
  operationId: 'createProject',
  method: 'POST',
  path: '/projects',
  requestBody: {
    requiredFields: [],
    sections: null,
    labels: {},
  },
  parameters: [{ name: 'org_id', type: 'string', required: false }],
  examples: {
    curl: 'curl "https://console.neon.tech/api/v2/projects"',
  },
  response: {
    status: '201',
    descriptionHtml: '<p>Created.</p>',
    example: { id: 'project-id' },
  },
  errors: [
    {
      status: 'default',
      description: 'General Error.',
      descriptionHtml: '<p>General Error.</p>',
    },
  ],
};

const bodyTree = [{ key: 'project', type: 'object', children: [{ key: 'name', type: 'string' }] }];
const respTree = [{ key: 'id', type: 'string' }];

describe('OperationDoc', () => {
  it('renders read-only API-first sections including response and errors', () => {
    render(<OperationDoc operation={operation} bodyTree={bodyTree} respTree={respTree} />);

    expect(screen.getByRole('heading', { name: 'Quick start' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Request body' })).toBeInTheDocument();
    expect(
      screen
        .getByRole('heading', { name: 'Parameters' })
        .compareDocumentPosition(screen.getByRole('heading', { name: 'Request body' })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Response' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Errors' })).toBeInTheDocument();
    expect(screen.getByText('General Error.')).toBeInTheDocument();
    expect(screen.queryByText('REST API', { selector: 'button *' })).not.toBeInTheDocument();
  });
});
