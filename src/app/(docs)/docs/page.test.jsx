import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DocsIndexPage, { generateMetadata } from './page';

vi.mock('components/pages/doc/docs-home', () => ({
  default: () => <div data-testid="docs-home" />,
}));

// getMetadata builds absolute URLs from the site URL.
process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = 'https://neon.com';

describe('/docs front page', () => {
  it('renders the docs home', () => {
    render(<DocsIndexPage />);

    expect(screen.getByTestId('docs-home')).toBeInTheDocument();
  });

  it('uses /docs as its canonical URL', async () => {
    const metadata = await generateMetadata();

    expect(metadata.alternates.canonical).toBe('https://neon.com/docs');
  });
});
