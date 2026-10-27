import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AgentSetupButton, { BASE_AGENT_PROMPT } from './agent-setup-button';

vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));
vi.mock('icons/docs/sidebar/ai-agent.inline.svg', () => ({
  default: (props) => <svg {...props} />,
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

    fireEvent.click(screen.getByRole('button', { name: 'Agent setup' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(BASE_AGENT_PROMPT));
    // writeText receives a plain string (text/plain), never an HTML payload or a DOM node.
    expect(typeof writeText.mock.calls[0][0]).toBe('string');
    expect(await screen.findByRole('button', { name: 'Prompt copied' })).toBeInTheDocument();
  });

  it('appends the page-specific prompt with a single leading space', async () => {
    render(<AgentSetupButton agentPrompt="Then connect this Node.js app." />);

    fireEvent.click(screen.getByRole('button', { name: 'Agent setup' }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(`${BASE_AGENT_PROMPT} Then connect this Node.js app.`)
    );
  });

  it('exposes the helper title so readers know what it copies', () => {
    render(<AgentSetupButton />);

    expect(screen.getByRole('button', { name: 'Agent setup' })).toHaveAttribute(
      'title',
      'Copy a prompt that sets up Neon in your coding agent'
    );
  });
});
