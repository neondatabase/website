import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Workflow from './workflow';

vi.mock('./build-animation', () => ({
  default: () => <div data-build-animation />,
}));

describe('Claimable Neon workflow diagrams', () => {
  it('renders the provision and claim diagrams as markup', () => {
    const { container } = render(<Workflow />);

    expect(screen.getByText('New project')).toBeInTheDocument();
    expect(screen.getByText('NEON_DATA_API_URL')).toBeInTheDocument();
    expect(screen.getByText('Claim details')).toBeInTheDocument();
    expect(
      container.querySelector('[data-scramble-text][aria-label="Transfer on claim"]')
    ).toBeInTheDocument();
    expect(container.querySelectorAll('[data-diagram-node]')).toHaveLength(8);
    expect(container.querySelectorAll('[data-animation-step]')).toHaveLength(11);
    expect(container.querySelectorAll('[data-project-row]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-scramble-text]')).toHaveLength(3);
    expect(
      container.querySelector('[data-scramble-text][aria-label="Project"]')
    ).not.toBeInTheDocument();
  });

  it('renders the build animation component instead of an image', () => {
    const { container } = render(<Workflow />);

    expect(container.querySelector('[data-build-animation]')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
