import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import DocQuickStart from '../doc-quick-start';

const operation = {
  operationId: 'createProject',
  method: 'POST',
  path: '/projects',
  requestBody: {
    required: true,
    requiredFields: [],
    seed: {
      'project.name': 'my-production-db',
      'project.region_id': 'aws-us-east-2',
      'project.pg_version': 17,
    },
  },
  examples: {
    curl: 'curl "https://console.neon.tech/api/v2/projects"',
    representative: {
      curl: 'curl "https://console.neon.tech/api/v2/projects" \\\n  -X POST \\\n  -H "Authorization: Bearer $NEON_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"project":{"name":"my-production-db","region_id":"aws-us-east-2","pg_version":17}}\'',
      typescript:
        'const { data } = await api.createProject({\n  "project": {\n    "name": "my-production-db"\n  }\n});',
    },
    typescript: 'const { data } = await api.createProject({});',
  },
  cli: {
    command: 'neon projects create',
    flags: [
      { name: 'name', type: 'string' },
      { name: 'region-id', type: 'string' },
      { name: 'pg-version', type: 'integer' },
    ],
  },
  mcp: {
    tool: 'create_project',
    arguments: [
      { name: 'project_id', required: true },
      { name: 'limit', required: false, default: 10 },
      { name: 'region_id', required: false },
    ],
  },
  console: { breadcrumb: 'Projects > New project' },
};

describe('DocQuickStart', () => {
  it('keeps REST curl in Quick start and swaps a separate non-REST example card', () => {
    render(<DocQuickStart operation={operation} />);

    expect(screen.getByRole('heading', { name: 'Quick start' })).toHaveClass('sr-only');
    expect(screen.getByText(/REST API/)).toBeInTheDocument();
    expect(screen.getAllByText(/my-production-db/).length).toBeGreaterThan(0);

    expect(screen.getByRole('button', { name: 'CLI' })).toBeInTheDocument();
    expect(screen.getAllByText('CLI').length).toBeGreaterThan(0);
    expect(screen.getByText(/neon projects create/)).toBeInTheDocument();
    expect(screen.getByText(/--region-id aws-us-east-2/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'SDK' }));

    expect(screen.getByText(/api.createProject/)).toBeInTheDocument();
    expect(screen.getByText(/REST API/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'MCP' }));

    expect(screen.getByText(/"tool": "create_project"/)).toBeInTheDocument();
    expect(screen.getByText(/"project_id": "\$PROJECT_ID"/)).toBeInTheDocument();
    expect(screen.getByText(/"region_id": "aws-us-east-2"/)).toBeInTheDocument();
  });

  it('only says an empty body works when the request body itself is optional', () => {
    const { rerender } = render(<DocQuickStart operation={operation} requiredLeafCount={0} />);

    expect(screen.queryByText(/An empty body works/)).not.toBeInTheDocument();

    rerender(
      <DocQuickStart
        operation={{ ...operation, requestBody: { ...operation.requestBody, required: false } }}
        requiredLeafCount={0}
      />
    );

    expect(screen.getByText(/An empty body works/)).toBeInTheDocument();
  });

  it('renders every CLI command for multi-command coverage entries', () => {
    render(
      <DocQuickStart
        operation={{
          ...operation,
          cli: {
            commands: [
              {
                command: 'neon neon-auth domain allow-localhost enable',
                flags: [],
                positionals: [],
              },
              {
                command: 'neon neon-auth domain allow-localhost disable',
                flags: [],
                positionals: [],
              },
            ],
          },
        }}
      />
    );

    expect(screen.getByText(/# enable/)).toBeInTheDocument();
    expect(screen.getByText(/neon neon-auth domain allow-localhost enable/)).toBeInTheDocument();
    expect(screen.getByText(/# disable/)).toBeInTheDocument();
    expect(screen.getByText(/neon neon-auth domain allow-localhost disable/)).toBeInTheDocument();
  });
});
