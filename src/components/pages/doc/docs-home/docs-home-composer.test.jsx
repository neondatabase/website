import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DocsHomeComposer from './docs-home-composer';

const sendGtagEvent = vi.fn();

vi.mock('utils/send-gtag-event', () => ({ default: (...args) => sendGtagEvent(...args) }));
vi.mock('icons/home/copy.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/home/copied.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/docs/providers/claude.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-claude" {...props} />,
}));
vi.mock('icons/docs/providers/openai.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-openai" {...props} />,
}));
vi.mock('icons/docs/providers/cursor.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-cursor" {...props} />,
}));

// The exact text each tab copies. The agent prompt is the shared
// BASE_AGENT_PROMPT constant; tests/critical-flows/docs-onboarding.spec.js also
// asserts it end to end.
const AGENT_PROMPT =
  'Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.';
const CLI_TEXT = [
  '# Install the Neon CLI (needs Node.js 22.20+)',
  'npm install -g neon@latest',
  '# Create and link a project (walks you through sign-in)',
  'neon init',
].join('\n');

let writeText;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('DocsHomeComposer', () => {
  it('shows the marks and copies the agent prompt on the default tab', () => {
    render(<DocsHomeComposer />);

    expect(screen.getByRole('tab', { name: 'Agent prompt' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent(AGENT_PROMPT);
    expect(screen.getByTestId('mark-claude')).toBeInTheDocument();

    // On the agent tab the marks replace the copy icon and the label reads "Copy prompt".
    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }));
    expect(writeText).toHaveBeenCalledWith(AGENT_PROMPT);
    expect(sendGtagEvent).toHaveBeenCalledWith('Action Clicked', {
      text: 'Agent setup',
      tag_name: 'DocsHomeComposer',
    });
  });

  it('drops the marks and copies the CLI commands on the CLI tab', () => {
    render(<DocsHomeComposer />);

    fireEvent.click(screen.getByRole('tab', { name: 'CLI' }));
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('CLI');
    // A shell command is not an agent prompt: no vendor marks on this tab.
    expect(screen.queryByTestId('mark-claude')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith(CLI_TEXT);
    expect(sendGtagEvent).toHaveBeenCalledWith('Action Clicked', {
      text: 'CLI setup',
      tag_name: 'DocsHomeComposer',
    });
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
