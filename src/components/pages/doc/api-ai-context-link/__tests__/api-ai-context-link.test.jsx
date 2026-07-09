import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ApiAiContextLink from '../api-ai-context-link';

vi.mock('components/shared/tooltip', () => ({
  default: (props) => <div data-testid={`tooltip-${props.id}`}>{props.children}</div>,
}));

describe('ApiAiContextLink', () => {
  it('renders the markdown link and puts operation context in the tooltip', () => {
    render(
      <ApiAiContextLink
        to="/docs/reference/api/projects/create-project.md"
        tooltipId="api-ai-context-create-project"
        tooltipLabel="POST /projects"
        tooltipLabelVariant="mono"
        tooltipDescription="parameters, examples, and available interfaces."
      />
    );

    const link = screen.getByRole('link', { name: /Markdown for AI context/ });
    expect(link).toHaveAttribute('href', '/docs/reference/api/projects/create-project.md');
    expect(link).toHaveAttribute('data-tooltip-id', 'api-ai-context-create-project');
    expect(link).toHaveAttribute('aria-describedby', 'api-ai-context-create-project');
    expect(link).not.toHaveTextContent('parameters');

    expect(screen.getByTestId('tooltip-api-ai-context-create-project')).toHaveTextContent(
      'POST /projects: parameters, examples, and available interfaces.'
    );
  });

  it('supports description-only tooltips for index pages', () => {
    render(
      <ApiAiContextLink
        to="/docs/reference/api.md"
        tooltipId="api-ai-context-index"
        tooltipDescription="API overview and all endpoints."
      />
    );

    expect(screen.getByRole('link', { name: /Markdown for AI context/ })).toHaveAttribute(
      'data-tooltip-id',
      'api-ai-context-index'
    );
    expect(screen.getByTestId('tooltip-api-ai-context-index')).toHaveTextContent(
      'API overview and all endpoints.'
    );
  });
});
