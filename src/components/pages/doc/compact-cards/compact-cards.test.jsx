import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import sendGtagEvent from 'utils/send-gtag-event';

import CompactCards from './compact-cards';

vi.mock('config/docs-icons-config', () => ({
  default: { test: { lightIconPath: '/light.svg', darkIconPath: '/dark.svg' } },
}));
vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));
vi.mock('icons/check.inline.svg', () => ({
  default: (props) => <svg data-testid="check-icon" {...props} />,
}));
vi.mock('icons/chevron-right-sm.inline.svg', () => ({ default: (props) => <svg {...props} /> }));
vi.mock('icons/docs/providers/claude.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-claude" {...props} />,
}));
vi.mock('icons/docs/providers/openai.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-openai" {...props} />,
}));
vi.mock('icons/docs/providers/cursor.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-cursor" {...props} />,
}));

// CompactCards reads each child's props (icon, promptSrc, title) and renders its
// own tile, so the child element type is arbitrary. A stub keeps these as React
// props rather than invalid DOM attributes.
const Item = () => null;

describe('CompactCards prompt tile', () => {
  let writeText;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    global.fetch = vi.fn().mockResolvedValue({ text: () => Promise.resolve('Prompt body') });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the vendor marks and copies the fetched prompt with per-tile analytics', async () => {
    render(
      <CompactCards>
        <Item icon="test" promptSrc="/prompts/tile.md">
          Tile title
        </Item>
      </CompactCards>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/prompts/tile.md'));

    expect(screen.getByTestId('mark-claude')).toBeInTheDocument();
    expect(screen.getByTestId('mark-openai')).toBeInTheDocument();
    expect(screen.getByTestId('mark-cursor')).toBeInTheDocument();

    const button = screen.getByRole('button');
    await waitFor(() => expect(button).not.toBeDisabled());
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith('Prompt body');
    await waitFor(() => expect(screen.getByTestId('check-icon')).toBeInTheDocument());
    expect(sendGtagEvent).toHaveBeenCalledWith('Button Clicked', {
      text: 'Copy prompt - Tile title',
    });
  });
});
