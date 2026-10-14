import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AgentPrompt from './agent-prompt';
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

describe('CopyPrompt (agent variant)', () => {
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

    render(
      <CopyPrompt variant="agent" title="Create a Neon project">
        Build me a project.
      </CopyPrompt>
    );

    expect(screen.getByText('Create a Neon project')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: /copy prompt/i });
    fireEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledWith('Build me a project.');
    await waitFor(() => expect(copyButton).toHaveTextContent('Copied'));
  });

  it('does not render an expand control for a short prompt', () => {
    setScrollHeight(50);

    render(
      <CopyPrompt variant="agent" title="Short task">
        A short prompt.
      </CopyPrompt>
    );

    expect(screen.queryByRole('button', { name: /expand prompt/i })).not.toBeInTheDocument();
  });

  it('puts the chevron on its own row and toggles expand/collapse', () => {
    setScrollHeight(300); // taller than the ~95px / 4-line threshold

    render(
      <CopyPrompt variant="agent" title="Long task">
        A very long prompt that overflows.
      </CopyPrompt>
    );

    const expandButton = screen.getByRole('button', { name: 'Expand prompt' });
    expect(expandButton.parentElement).toHaveClass('pt-2');
    expect(expandButton).toHaveClass('size-7', 'bg-transparent', 'border-gray-new-80');
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');

    const prompt = screen.getByText('A very long prompt that overflows.');
    expect(expandButton).toHaveAttribute('aria-controls', prompt.getAttribute('id'));
    expect(prompt.className).toContain('overflow-hidden');
    expect(prompt.nextElementSibling).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(expandButton);

    const collapseButton = screen.getByRole('button', { name: 'Collapse prompt' });
    expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    expect(prompt.className).not.toContain('overflow-hidden');
  });

  it('still copies the full prompt while collapsed', async () => {
    setScrollHeight(300);

    render(
      <CopyPrompt variant="agent" title="Long task">
        The entire prompt text.
      </CopyPrompt>
    );

    // Collapsed by default (expand control present).
    expect(screen.getByRole('button', { name: 'Expand prompt' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /copy prompt/i }));
    expect(writeText).toHaveBeenCalledWith('The entire prompt text.');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
    );
  });

  it('renders the agent card through AgentPrompt', () => {
    setScrollHeight(50);

    render(<AgentPrompt title="Agent task">Run this agent prompt.</AgentPrompt>);

    expect(screen.getByText('Agent task')).toBeInTheDocument();
    expect(screen.getByText('Run this agent prompt.')).toHaveClass('font-mono');
  });
});

describe('CopyPrompt (legacy mode)', () => {
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

  it('keeps the legacy layout when title and description are provided', async () => {
    render(
      <CopyPrompt
        src="/prompts/example.md"
        title="AI prompt: Get started with the Neon API"
        description="Copy into your AI assistant."
      />
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/prompts/example.md'));

    expect(screen.getByText('Copy into your AI assistant.')).toBeInTheDocument();
    expect(screen.queryByText('AI prompt: Get started with the Neon API')).not.toBeInTheDocument();
    expect(screen.getByTestId('pattern-image')).toBeInTheDocument();
  });
});
