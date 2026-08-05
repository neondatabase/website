import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DropdownMenu from './dropdown-menu';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));
vi.mock('components/shared/link', () => ({
  default: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));

vi.mock('icons/chevron-down.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/copy-docs.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/docs/chat-gpt.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/docs/claude.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/external.inline.svg', () => ({ default: (props) => <svg {...props} /> }));

describe('DropdownMenu', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = 'https://neon.com';
    global.fetch = vi.fn().mockResolvedValue({ text: () => Promise.resolve('# Model page') });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses a custom Markdown path for copy and AI actions', async () => {
    const markdownPath = '/docs/ai-gateway/models/gemini-3-5-flash.md';

    render(
      <DropdownMenu gitHubPath="content/docs/ai-gateway/models.md" markdownPath={markdownPath} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy page' }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(markdownPath));

    fireEvent.click(screen.getAllByRole('button')[1]);

    for (const name of ['ChatGPT', 'Claude']) {
      expect(screen.getByRole('link', { name: new RegExp(`Open in ${name}`) })).toHaveAttribute(
        'href',
        expect.stringContaining(`https://neon.com${markdownPath}`)
      );
    }
  });
});
