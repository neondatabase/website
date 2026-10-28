import { fireEvent, render, screen } from '@testing-library/react';
import copyToClipboard from 'copy-to-clipboard';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DocsHomeComposer from './docs-home-composer';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }));
vi.mock('icons/home/copy.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/home/copied.inline.svg', () => ({ default: (props) => <svg {...props} /> }));

// The exact text each tab copies. tests/critical-flows/docs-onboarding.spec.js
// also asserts the agent prompt end to end.
const AGENT_PROMPT =
  'Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.';
const CLI_TEXT = [
  '# Install the Neon CLI (needs Node.js 22.20+)',
  'npm install -g neon@latest',
  '# Create and link a project (walks you through sign-in)',
  'neon init',
].join('\n');

afterEach(() => {
  vi.clearAllMocks();
});

describe('DocsHomeComposer', () => {
  it('shows and copies the agent prompt on the default tab', () => {
    render(<DocsHomeComposer />);

    expect(screen.getByRole('tab', { name: 'Agent prompt' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent(AGENT_PROMPT);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(copyToClipboard).toHaveBeenCalledWith(AGENT_PROMPT);
  });

  it('copies the CLI commands on the CLI tab', () => {
    render(<DocsHomeComposer />);

    fireEvent.click(screen.getByRole('tab', { name: 'CLI' }));
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('CLI');

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(copyToClipboard).toHaveBeenCalledWith(CLI_TEXT);
  });

  it('moves between tabs with the arrow, Home, and End keys', () => {
    render(<DocsHomeComposer />);
    const agentTab = screen.getByRole('tab', { name: 'Agent prompt' });
    const cliTab = screen.getByRole('tab', { name: 'CLI' });

    fireEvent.keyDown(agentTab, { key: 'ArrowRight' });
    expect(cliTab).toHaveAttribute('aria-selected', 'true');
    expect(cliTab).toHaveFocus();
    expect(cliTab).toHaveAttribute('tabindex', '0');
    expect(agentTab).toHaveAttribute('tabindex', '-1');

    // Arrows wrap at both ends.
    fireEvent.keyDown(cliTab, { key: 'ArrowRight' });
    expect(agentTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(agentTab, { key: 'ArrowLeft' });
    expect(cliTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(cliTab, { key: 'Home' });
    expect(agentTab).toHaveAttribute('aria-selected', 'true');
    expect(agentTab).toHaveFocus();
    fireEvent.keyDown(agentTab, { key: 'End' });
    expect(cliTab).toHaveAttribute('aria-selected', 'true');
  });
});
