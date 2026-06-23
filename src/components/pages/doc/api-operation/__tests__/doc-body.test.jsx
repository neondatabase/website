import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DocBodySection, getRequiredLeafPaths } from '../doc-body';
import { humanizeFieldName } from '../field-label';

const BODY_TREE = [
  {
    key: 'project',
    type: 'object',
    children: [
      {
        key: 'name',
        type: 'string',
        details: {
          descriptionHtml: '<p>The project name.</p>',
        },
      },
      {
        key: 'pg_version',
        type: 'integer',
        value: '17',
        enum: [14, 15, 16, 17, 18],
        details: {
          descriptionHtml: '<p>The Postgres version.</p>',
        },
      },
      {
        key: 'settings',
        type: 'object',
        children: [{ key: 'hipaa', type: 'boolean' }],
      },
    ],
  },
];

const SECTIONS = [
  {
    id: 'basics',
    label: 'Basics',
    common: true,
    blurb: 'Fields most projects set.',
    collapsed: false,
    schemaPath: 'project.*',
    rows: [
      { path: 'project.name', common: true, outOfObject: false },
      { path: 'project.pg_version', common: true, outOfObject: false },
    ],
  },
  {
    id: 'settings',
    label: 'Project settings',
    blurb: 'Project-level settings.',
    collapsed: false,
    schemaPath: 'project.settings.*',
    rows: [{ path: 'project.settings.hipaa', common: false, outOfObject: false }],
  },
];

describe('humanizeFieldName', () => {
  it('applies acronym and product-name overrides', () => {
    expect(humanizeFieldName('pg_version')).toBe('Postgres version');
    expect(humanizeFieldName('org_id')).toBe('Organization');
    expect(humanizeFieldName('allowed_ips')).toBe('Allowed IPs');
  });
});

describe('DocBodySection', () => {
  it('does not count required children under optional ancestor objects as globally required', () => {
    expect(
      getRequiredLeafPaths([
        {
          key: 'project',
          type: 'object',
          required: true,
          children: [
            {
              key: 'settings',
              type: 'object',
              required: false,
              children: [{ key: 'start_time', type: 'string', required: true }],
            },
          ],
        },
      ])
    ).toEqual([]);
  });

  it('renders grouped read-only cards with labels, defaults, enum pills, and first-open state', () => {
    render(
      <DocBodySection
        bodyTree={BODY_TREE}
        requestBody={{
          requiredFields: [],
          sections: SECTIONS,
          labels: {
            'project.name': { title: 'Project name', defaultLabel: 'auto-generated' },
            'project.pg_version': { title: 'Postgres version' },
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Request body' })).toBeInTheDocument();
    expect(screen.getByText('0 required')).toBeInTheDocument();
    expect(screen.getByText(/No field is required/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Basics' })).toBeInTheDocument();
    expect(screen.getByText('commonly set')).toBeInTheDocument();
    expect(screen.getByText('Project name')).toBeInTheDocument();
    expect(screen.getByText('default auto-generated')).toBeInTheDocument();
    expect(screen.getByText('17')).toHaveClass('text-[#00B87B]');

    // Only the first section is open by default.
    expect(screen.queryByText('Hipaa')).not.toBeInTheDocument();
    const settingsToggle = screen.getByRole('button', { name: 'Toggle Project settings section' });
    expect(settingsToggle).toHaveAttribute('aria-expanded', 'false');
    expect(settingsToggle).toHaveAttribute('aria-controls');
    fireEvent.click(settingsToggle);
    expect(settingsToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hipaa')).toBeInTheDocument();
  });

  it('falls back to a flat read-only tree when sections are absent', () => {
    render(
      <DocBodySection bodyTree={BODY_TREE} requestBody={{ requiredFields: [], sections: null }} />
    );

    expect(screen.getByRole('heading', { name: 'Request body' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Basics' })).not.toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.queryByText('Name')).not.toBeInTheDocument();

    const projectToggle = screen.getByRole('button', { name: 'Toggle Project field' });
    expect(projectToggle).toHaveAttribute('aria-expanded', 'false');
    expect(projectToggle).toHaveAttribute('aria-controls');
    fireEvent.click(projectToggle);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(projectToggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('only says empty body works when the request body itself is optional', () => {
    const { rerender } = render(
      <DocBodySection
        bodyTree={BODY_TREE}
        requestBody={{ required: true, requiredFields: [], sections: null }}
      />
    );

    expect(screen.queryByText(/Send an empty body/)).not.toBeInTheDocument();

    rerender(
      <DocBodySection
        bodyTree={BODY_TREE}
        requestBody={{ required: false, requiredFields: [], sections: null }}
      />
    );

    expect(screen.getByText(/Send an empty body/)).toBeInTheDocument();
  });
});
