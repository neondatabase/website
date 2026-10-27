import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Post from './post';

vi.mock('components/pages/changelog/changelog-list', () => ({ default: () => null }));
vi.mock('components/pages/changelog/hero', () => ({ default: () => null }));
vi.mock('components/pages/changelog/subscribe-form', () => ({ default: () => null }));
vi.mock('components/pages/doc/aside', () => ({ default: () => null }));
vi.mock('components/pages/doc/breadcrumbs', () => ({ default: () => null }));
vi.mock('components/pages/doc/modal', () => ({ default: () => null }));
vi.mock('components/pages/doc/modal/data', () => ({ default: [] }));
vi.mock('components/pages/doc/modal/select-modal', () => ({ default: () => null }));
vi.mock('components/shared/content', () => ({ default: () => null }));
vi.mock('components/shared/doc-footer', () => ({ default: () => null }));
vi.mock('components/shared/navigation-links', () => ({ default: () => null }));
vi.mock('../dropdown-menu', () => ({
  default: () => <div data-testid="copy-page-menu" />,
}));
vi.mock('../agent-setup-button', () => ({
  default: () => <div data-testid="agent-setup-button" />,
}));
vi.mock('../tag', () => ({ default: () => null }));

const renderPost = (data, props = {}) =>
  render(
    <Post
      data={{ title: 'Test page', ...data }}
      content="Test content"
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug="test-page"
      gitHubPath="content/docs/test-page.md"
      {...props}
    />
  );

describe('Post hideCopyPage', () => {
  it('hides the copy-page menu on a regular page', () => {
    renderPost({ hideCopyPage: true });

    expect(screen.queryByTestId('copy-page-menu')).not.toBeInTheDocument();
  });

  it('hides the copy-page menu on an FAQ page', () => {
    renderPost({ hideCopyPage: true }, { isFaq: true });

    expect(screen.queryByTestId('copy-page-menu')).not.toBeInTheDocument();
  });

  it('shows the copy-page menu by default', () => {
    renderPost({});

    expect(screen.getByTestId('copy-page-menu')).toBeInTheDocument();
  });

  it('shows the agent-setup button even when the copy-page menu is hidden', () => {
    renderPost({ hideCopyPage: true });

    expect(screen.getByTestId('agent-setup-button')).toBeInTheDocument();
    expect(screen.queryByTestId('copy-page-menu')).not.toBeInTheDocument();
  });
});

describe('Post updated date', () => {
  it('renders the "Updated" stamp in the title row when updatedOn is set', () => {
    renderPost({ updatedOn: '2026-09-16T12:00:00.000Z' });

    expect(screen.getByText(/Updated Sep 16, 2026/)).toBeInTheDocument();
  });

  it('omits the "Updated" stamp when updatedOn is absent', () => {
    renderPost({});

    expect(screen.queryByText(/^Updated /)).not.toBeInTheDocument();
  });
});
