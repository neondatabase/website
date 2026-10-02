import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CopyPrompt from './copy-prompt';

// The module imports these at the top; mock them so the file loads under
// happy-dom and so we can assert against the copy behavior.
vi.mock('next/image', () => ({ default: () => <span data-testid="pattern-image" /> }));
vi.mock('components/shared/button', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
vi.mock('components/shared/code-block-wrapper/images/copy.inline.svg', () => ({
  default: (props) => <svg data-testid="copy-icon" {...props} />,
}));
vi.mock('components/shared/code-block-wrapper/images/check.inline.svg', () => ({
  default: (props) => <svg data-testid="check-icon" {...props} />,
}));
vi.mock('images/pages/docs/copy-prompt/pattern.svg', () => ({ default: 'pattern.svg' }));
vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));

const setScrollHeight = (value) => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return value;
    },
  });
};

describe('CopyPrompt (agent-prompt mode via `title`)', () => {
  let writeText;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete HTMLElement.prototype.scrollHeight;
  });

  it('renders the title and copies the prompt, flipping to the copied state', async () => {
    setScrollHeight(50); // short prompt, not collapsible

    render(<CopyPrompt title="Create a Neon project">Build me a project.</CopyPrompt>);

    expect(screen.getByText('Create a Neon project')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: /copy prompt/i });
    fireEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledWith('Build me a project.');
    await waitFor(() => expect(copyButton).toHaveTextContent('Copied'));
  });

  it('does not render an expand control for a short prompt', () => {
    setScrollHeight(50);

    render(<CopyPrompt title="Short task">A short prompt.</CopyPrompt>);

    expect(screen.queryByRole('button', { name: /expand prompt/i })).not.toBeInTheDocument();
  });

  it('clamps a long prompt and toggles expand/collapse', () => {
    setScrollHeight(300); // taller than the ~102px / 4-line threshold

    render(<CopyPrompt title="Long task">A very long prompt that overflows.</CopyPrompt>);

    const expandButton = screen.getByRole('button', { name: 'Expand prompt' });
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');

    const prompt = screen.getByText('A very long prompt that overflows.');
    expect(expandButton).toHaveAttribute('aria-controls', prompt.getAttribute('id'));
    expect(prompt.className).toContain('overflow-hidden');

    fireEvent.click(expandButton);

    const collapseButton = screen.getByRole('button', { name: 'Collapse prompt' });
    expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    expect(prompt.className).not.toContain('overflow-hidden');
  });

  it('still copies the full prompt while collapsed', () => {
    setScrollHeight(300);

    render(<CopyPrompt title="Long task">The entire prompt text.</CopyPrompt>);

    // Collapsed by default (expand control present).
    expect(screen.getByRole('button', { name: 'Expand prompt' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /copy prompt/i }));
    expect(writeText).toHaveBeenCalledWith('The entire prompt text.');
  });
});

describe('CopyPrompt (legacy mode, no `title`)', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ text: () => Promise.resolve('# Prompt body') });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the default description and copy button, with no header title', async () => {
    render(<CopyPrompt src="/prompts/example.md" />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/prompts/example.md'));

    expect(
      screen.getByText('Use this pre-built prompt to get started faster.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy prompt/i })).toBeInTheDocument();
  });
});
