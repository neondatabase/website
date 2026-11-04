import { fireEvent, render, screen } from '@testing-library/react';
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
vi.mock('icons/home/copied.inline.svg', () => ({
  default: (props) => <svg data-testid="copied-icon" {...props} />,
}));

const agentSetupModal = MODALS.find((modal) => modal.id === 'docs-agent-setup');

describe('docs agent-setup modal entry', () => {
  beforeEach(() => {
    window.localStorage.clear();
    sendGtagEvent.mockClear();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    // Expanded (not minimized) state so the copy button and link both render.
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
    expect(agentSetupModal.destination.url).toBe('/docs/ai/ai-agents-tools');
  });

  it('copies the base prompt as plain text and reports the copy analytics event', async () => {
    render(<Modal {...agentSetupModal} />);

    // The vendor-mark cluster is the pre-copy affordance on the field.
    expect(await screen.findByTestId('mark-claude')).toBeInTheDocument();

    // The whole field is the copy target; the control is label-only (aria-label on the field).
    fireEvent.click(await screen.findByRole('button', { name: 'Copy agent setup prompt' }));

    expect(writeText).toHaveBeenCalledWith(BASE_AGENT_PROMPT);
    expect(typeof writeText.mock.calls[0][0]).toBe('string');
    // Success state swaps the marks for the green check icon.
    expect(await screen.findByTestId('copied-icon')).toBeInTheDocument();
    // The analytics callback fires after the copy resolves.
    expect(sendGtagEvent).toHaveBeenCalledWith('Action Clicked', {
      text: 'Agent setup',
      tag_name: 'DocsAgentSetupPopup',
    });
  });

  it('links to the agents page and fires the shared modal-link analytics event', async () => {
    render(<Modal {...agentSetupModal} />);

    fireEvent.click(
      await screen.findByRole('link', { name: new RegExp(agentSetupModal.destination.label) })
    );

    expect(sendGtagEvent).toHaveBeenCalledWith('click_docs_modal_link', {
      modal: 'docs-agent-setup',
      link: agentSetupModal.destination.label,
      destination: '/docs/ai/ai-agents-tools',
    });
  });
});
