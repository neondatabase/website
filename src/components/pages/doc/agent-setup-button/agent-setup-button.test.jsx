import { fireEvent, render, screen } from '@testing-library/react';
import copyToClipboard from 'copy-to-clipboard';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AgentSetupButton, { BASE_AGENT_PROMPT } from './agent-setup-button';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));
vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));

describe('AgentSetupButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('copies the base prompt when there is no page-specific prompt', () => {
    render(<AgentSetupButton />);

    const button = screen.getByRole('button', { name: 'Agent setup' });
    fireEvent.click(button);

    expect(copyToClipboard).toHaveBeenCalledWith(BASE_AGENT_PROMPT);
    expect(screen.getByRole('button', { name: 'Prompt copied' })).toBeInTheDocument();
  });

  it('appends the page-specific prompt with a single leading space', () => {
    render(<AgentSetupButton agentPrompt="Then connect this Node.js app." />);

    fireEvent.click(screen.getByRole('button', { name: 'Agent setup' }));

    expect(copyToClipboard).toHaveBeenCalledWith(
      `${BASE_AGENT_PROMPT} Then connect this Node.js app.`
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
