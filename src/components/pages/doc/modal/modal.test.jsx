import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BASE_AGENT_PROMPT } from 'components/pages/doc/agent-setup-button';

import MODALS from './data';
import Modal from './modal';

const sendGtagEvent = vi.fn();
let writeText;

vi.mock('utils/send-gtag-event', () => ({ default: (...args) => sendGtagEvent(...args) }));
vi.mock('icons/docs/sidebar/ai-agent.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('icons/docs/providers/claude.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-claude" {...props} />,
}));
vi.mock('icons/docs/providers/openai.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-openai" {...props} />,
}));
vi.mock('icons/docs/providers/cursor.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-cursor" {...props} />,
}));

const agentSetupModal = MODALS.find((modal) => modal.id === 'docs-agent-setup');

describe('docs agent-setup modal entry', () => {
  beforeEach(() => {
    window.localStorage.clear();
    sendGtagEvent.mockClear();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    // Expanded (not minimized) state so the full card renders.
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false, addEventListener: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is registered in MODALS targeting all docs pages with the base agent prompt', () => {
    expect(agentSetupModal).toBeDefined();
    expect(agentSetupModal.targeting).toEqual({ all: true });
    // Guard against a silent undefined === undefined pass if the named export regresses.
    expect(BASE_AGENT_PROMPT).toMatch(/Set me up for Neon/);
    expect(agentSetupModal.copyPrompt).toBe(BASE_AGENT_PROMPT);
    expect(agentSetupModal.destination).toBeUndefined();
  });

  it('shows the prompt in a single-line read-only field with a supporting line', async () => {
    render(<Modal {...agentSetupModal} />);

    const field = await screen.findByRole('textbox', { name: 'Agent setup prompt' });
    expect(field.tagName).toBe('INPUT');
    expect(field).toHaveAttribute('readonly');
    expect(field).toHaveValue(BASE_AGENT_PROMPT);
    expect(screen.getByText(agentSetupModal.description)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('selects the whole prompt when the field is clicked', async () => {
    render(<Modal {...agentSetupModal} />);

    const field = await screen.findByRole('textbox', { name: 'Agent setup prompt' });
    fireEvent.click(field);

    expect(field.selectionStart).toBe(0);
    expect(field.selectionEnd).toBe(BASE_AGENT_PROMPT.length);
  });

  it('copies the prompt from the button, reports it, and dismisses the card for good', async () => {
    render(<Modal {...agentSetupModal} />);

    // The vendor-mark cluster sits on the copy button, like the other agent-prompt controls.
    const button = await screen.findByRole('button', { name: 'Copy prompt' });
    expect(within(button).getByTestId('mark-claude')).toBeInTheDocument();
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith(BASE_AGENT_PROMPT);
    expect(typeof writeText.mock.calls[0][0]).toBe('string');
    // The card stays up to show the confirmation before it goes away.
    expect(await screen.findByRole('button', { name: 'Prompt copied' })).toBeInTheDocument();
    // The analytics callback fires after the copy resolves.
    expect(sendGtagEvent).toHaveBeenCalledWith('Action Clicked', {
      text: 'Agent setup',
      tag_name: 'DocsAgentSetupPopup',
      method: 'button',
    });
    expect(JSON.parse(window.localStorage.getItem('closedModals'))).toEqual(['docs-agent-setup']);
  });

  it('reports a manual copy from the field and dismisses the card for good', async () => {
    render(<Modal {...agentSetupModal} />);

    fireEvent.copy(await screen.findByRole('textbox', { name: 'Agent setup prompt' }));

    expect(writeText).not.toHaveBeenCalled();
    expect(sendGtagEvent).toHaveBeenCalledWith('Action Clicked', {
      text: 'Agent setup',
      tag_name: 'DocsAgentSetupPopup',
      method: 'manual',
    });
    expect(JSON.parse(window.localStorage.getItem('closedModals'))).toEqual(['docs-agent-setup']);
  });

  it('records a dismissal in localStorage when closed', async () => {
    render(<Modal {...agentSetupModal} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Close' }));

    expect(JSON.parse(window.localStorage.getItem('closedModals'))).toEqual(['docs-agent-setup']);
    expect(sendGtagEvent).not.toHaveBeenCalled();
  });

  it('shows the assigned variant title and reports experiment success on copy', async () => {
    window.localStorage.setItem(
      'experimentAssignments',
      JSON.stringify({ [agentSetupModal.experiment.id]: 'neon-superpowers' })
    );
    render(<Modal {...agentSetupModal} />);

    expect(await screen.findByText('Give your agent Neon superpowers')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }));

    await vi.waitFor(() =>
      expect(sendGtagEvent).toHaveBeenCalledWith('Experiment Success', {
        experiment_id: 'docs-agent-setup-title',
        variant_id: 'neon-superpowers',
        method: 'button',
      })
    );
  });

  it('defines a control and the two title variants', () => {
    expect(agentSetupModal.experiment.variants).toEqual({
      control: {},
      'onboard-your-agent': { title: 'Onboard your agent' },
      'neon-superpowers': { title: 'Give your agent Neon superpowers' },
    });
  });

  it('stays hidden once dismissed', async () => {
    window.localStorage.setItem('closedModals', JSON.stringify(['docs-agent-setup']));
    render(<Modal {...agentSetupModal} />);

    await vi.waitFor(() =>
      expect(screen.queryByRole('textbox', { name: 'Agent setup prompt' })).not.toBeInTheDocument()
    );
  });
});
