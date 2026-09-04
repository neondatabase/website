import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import copyToClipboard from 'copy-to-clipboard';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';

import CodeTabs from './code-tabs';
import { CODE_EXAMPLES, INTERFACES } from './data';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }));
vi.mock('components/shared/code-block-wrapper/images/copy.inline.svg', () => ({
  default: () => <span aria-hidden="true" />,
}));
vi.mock('components/shared/code-block-wrapper/images/check.inline.svg', () => ({
  default: () => <span aria-hidden="true" />,
}));

const renderCodeTabs = () =>
  render(
    <CodeTabs>
      {INTERFACES.map(({ id }) => (
        <CodeBlockWrapper key={id} copyCode={CODE_EXAMPLES[id]}>
          <pre>
            <code>{CODE_EXAMPLES[id]}</code>
          </pre>
        </CodeBlockWrapper>
      ))}
    </CodeTabs>
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Claimable Neon interface examples', () => {
  it('shows the original auth.md sample by default and labels its tab panel', () => {
    renderCodeTabs();

    expect(screen.getByRole('tab', { name: 'auth.md' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('tabpanel', { name: 'auth.md' }).querySelector('code').textContent
    ).toBe(CODE_EXAMPLES.agent);
    expect(screen.queryByText(/is not a command/)).not.toBeInTheDocument();
  });

  it('switches examples and keeps the CLI fallback guidance', () => {
    renderCodeTabs();

    fireEvent.click(screen.getByRole('tab', { name: 'Neon CLI' }));
    expect(
      screen.getByRole('tabpanel', { name: 'Neon CLI' }).querySelector('code').textContent
    ).toBe(CODE_EXAMPLES.cli);
    expect(screen.getByText(/is not a command/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'neon.ts' }));
    expect(
      screen.getByRole('tabpanel', { name: 'neon.ts' }).querySelector('code').textContent
    ).toBe(CODE_EXAMPLES.config);
    expect(screen.queryByText(/is not a command/)).not.toBeInTheDocument();
  });

  it('supports arrow keys, Home, and End with a single tabbable tab', () => {
    renderCodeTabs();

    const authTab = screen.getByRole('tab', { name: 'auth.md' });
    act(() => authTab.focus());
    fireEvent.keyDown(authTab, { key: 'ArrowRight' });

    const cliTab = screen.getByRole('tab', { name: 'Neon CLI' });
    expect(cliTab).toHaveFocus();
    expect(cliTab).toHaveAttribute('aria-selected', 'true');
    expect(authTab).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(cliTab, { key: 'End' });
    const configTab = screen.getByRole('tab', { name: 'neon.ts' });
    expect(configTab).toHaveFocus();
    expect(configTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(configTab, { key: 'Home' });
    expect(authTab).toHaveFocus();
    expect(authTab).toHaveAttribute('aria-selected', 'true');
  });

  it('copies the active sample exactly and confirms the copy', () => {
    renderCodeTabs();

    fireEvent.click(screen.getByRole('tab', { name: 'Neon CLI' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(copyToClipboard).toHaveBeenCalledWith(CODE_EXAMPLES.cli);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeDisabled();

    fireEvent.click(screen.getByRole('tab', { name: 'neon.ts' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(copyToClipboard).toHaveBeenLastCalledWith(CODE_EXAMPLES.config);
  });
});
