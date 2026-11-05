import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import sendGtagEvent from 'utils/send-gtag-event';

import PromptCopyButton from './prompt-copy-button';

vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));
vi.mock('components/pages/doc/docs-home/images/index-copy.inline.svg', () => ({
  default: (props) => <svg data-testid="copy-icon" {...props} />,
}));
vi.mock('icons/home/copied.inline.svg', () => ({
  default: (props) => <svg data-testid="copied-icon" {...props} />,
}));

describe('PromptCopyButton', () => {
  let writeText;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('  Prompt body\n'),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('copies inline text without fetching', async () => {
    render(<PromptCopyButton text="Follow this guide." label="React Router" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt for React Router' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('Follow this guide.'));
    expect(global.fetch).not.toHaveBeenCalled();
    expect(sendGtagEvent).toHaveBeenCalledWith('Button Clicked', {
      text: 'Copy prompt - React Router',
      tag_name: 'DocsHomeCopyPrompt',
    });
    expect(screen.getByRole('button', { name: 'Prompt copied for React Router' })).toBeTruthy();
  });

  it('fetches and copies the prompt file', async () => {
    render(<PromptCopyButton src="/prompts/test-prompt.md" label="Next.js" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt for Next.js' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('Prompt body'));
    expect(global.fetch).toHaveBeenCalledWith('/prompts/test-prompt.md');
  });

  it('does not copy when the prompt file fails to load', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, text: () => Promise.resolve('') });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<PromptCopyButton src="/prompts/missing.md" label="Missing" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt for Missing' }));

    await waitFor(() => expect(error).toHaveBeenCalled());
    expect(writeText).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
