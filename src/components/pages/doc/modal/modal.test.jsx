import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BASE_AGENT_PROMPT } from 'components/pages/doc/agent-setup-button';

import MODALS from './data';
import Modal from './modal';

const sendGtagEvent = vi.fn();
const copyToClipboard = vi.fn();

vi.mock('utils/send-gtag-event', () => ({ default: (...args) => sendGtagEvent(...args) }));
vi.mock('copy-to-clipboard', () => ({ default: (...args) => copyToClipboard(...args) }));
vi.mock('icons/docs/sidebar/ai-agent.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('icons/home/copied.inline.svg', () => ({
  default: (props) => <svg data-testid="copied-icon" {...props} />,
}));
vi.mock('icons/home/copy.inline.svg', () => ({
  default: (props) => <svg data-testid="copy-icon" {...props} />,
}));

const agentSetupModal = MODALS.find((modal) => modal.id === 'docs-agent-setup');

describe('docs agent-setup modal entry', () => {
  beforeEach(() => {
    window.localStorage.clear();
    sendGtagEvent.mockClear();
    copyToClipboard.mockClear();
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

    // The whole field is the copy target; the control is icon-only (aria-label on the field).
    fireEvent.click(await screen.findByRole('button', { name: 'Copy agent setup prompt' }));

    expect(copyToClipboard).toHaveBeenCalledWith(BASE_AGENT_PROMPT);
    expect(typeof copyToClipboard.mock.calls[0][0]).toBe('string');
    expect(sendGtagEvent).toHaveBeenCalledWith('Action Clicked', {
      text: 'Agent setup',
      tag_name: 'DocsAgentSetupPopup',
    });
    // Success state swaps the copy icon for the green check icon.
    expect(await screen.findByTestId('copied-icon')).toBeInTheDocument();
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
