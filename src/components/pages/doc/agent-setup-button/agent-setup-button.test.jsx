import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AgentSetupButton, { BASE_AGENT_PROMPT } from './agent-setup-button';

vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));
vi.mock('icons/docs/providers/claude.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-claude" {...props} />,
}));
vi.mock('icons/docs/providers/openai.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-openai" {...props} />,
}));
vi.mock('icons/docs/providers/cursor.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-cursor" {...props} />,
}));

describe('AgentSetupButton', () => {
  let writeText;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the exact base prompt text', () => {
    expect(BASE_AGENT_PROMPT).toBe(
      'Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.'
    );
  });

  it('copies the base prompt as plain text when there is no page-specific prompt', async () => {
    render(<AgentSetupButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Set up agent' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(BASE_AGENT_PROMPT));
    // writeText receives a plain string (text/plain), never an HTML payload or a DOM node.
    expect(typeof writeText.mock.calls[0][0]).toBe('string');
    expect(await screen.findByRole('button', { name: 'Prompt copied' })).toBeInTheDocument();
  });

  it('appends the page-specific prompt with a single leading space', async () => {
    render(<AgentSetupButton agentPrompt="Then connect this Node.js app." />);

    fireEvent.click(screen.getByRole('button', { name: 'Set up agent' }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(`${BASE_AGENT_PROMPT} Then connect this Node.js app.`)
    );
  });

  it('exposes the helper title so readers know what it copies', () => {
    render(<AgentSetupButton />);

    expect(screen.getByRole('button', { name: 'Set up agent' })).toHaveAttribute(
      'title',
      'Copy a prompt that sets up Neon in your coding agent'
    );
  });

  it('shows the Claude, OpenAI, and Cursor marks in place of a single icon', () => {
    render(<AgentSetupButton />);

    expect(screen.getByTestId('mark-claude')).toBeInTheDocument();
    expect(screen.getByTestId('mark-openai')).toBeInTheDocument();
    expect(screen.getByTestId('mark-cursor')).toBeInTheDocument();
  });
});
