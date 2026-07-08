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
      description:
        'General Error.\n\nThe request may or may not be safe to retry, depending on the HTTP method, response status code,\nand whether a response was received.',
      descriptionHtml:
        '<p>General Error.</p><p>The request may or may not be safe to retry, depending on the HTTP method, response status code,<br />and whether a response was received.</p>',
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
    expect(screen.getByText('General error')).toBeInTheDocument();
    expect(
      screen.getByText('This endpoint can return the standard Neon API error response.')
    ).toBeInTheDocument();
    expect(screen.getByText('request_id')).toBeInTheDocument();
    expect(
      screen.queryByText(/The request may or may not be safe to retry/)
    ).not.toBeInTheDocument();
    expect(screen.getByText('Required. Human-readable error message.')).toBeInTheDocument();
    expect(screen.getByText('Required. Machine-readable error code.')).toBeInTheDocument();
    expect(screen.getByText(/Optional\. Request identifier for debugging/)).toBeInTheDocument();
    expect(
      screen.getByText(/If no response is returned, the request may still have reached the server/)
    ).toBeInTheDocument();
    expect(screen.getByText(/resource is temporarily locked/)).toBeInTheDocument();
    expect(screen.queryByText('REST API', { selector: 'button *' })).not.toBeInTheDocument();

    for (const headingName of ['Parameters', 'Request body', 'Errors']) {
      expect(screen.getByRole('heading', { name: headingName })).toHaveClass(
        'mb-4.5',
        'text-[28px]',
        'lg:text-[24px]',
        'md:text-[20px]'
      );
    }

    const responseHeading = screen.getByRole('heading', { name: 'Response' });
    expect(responseHeading).toHaveClass('text-[28px]', 'lg:text-[24px]', 'md:text-[20px]');
    expect(responseHeading.parentElement).toHaveClass('mb-4.5');

    const parametersSection = screen
      .getByRole('heading', { name: 'Parameters' })
      .closest('section');
    expect(parametersSection.querySelector('h2 + div > div')).toHaveClass(
      'border-b',
      'py-4',
      'last:border-b-0'
    );
  });
});
