import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProviderMarks from './provider-marks';

// In vitest, `.inline.svg` imports resolve to asset URLs rather than SVGR
// components, so mock each mark to a plain <svg> we can assert against.
vi.mock('icons/docs/providers/claude.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-claude" {...props} />,
}));
vi.mock('icons/docs/providers/openai.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-openai" {...props} />,
}));
vi.mock('icons/docs/providers/cursor.inline.svg', () => ({
  default: (props) => <svg data-testid="mark-cursor" {...props} />,
}));

describe('ProviderMarks', () => {
  it('renders Claude, OpenAI, and Cursor marks in that order', () => {
    const { container } = render(<ProviderMarks />);
    const marks = container.querySelectorAll('svg');
    expect(marks).toHaveLength(3);
    expect(marks[0]).toHaveAttribute('data-testid', 'mark-claude');
    expect(marks[1]).toHaveAttribute('data-testid', 'mark-openai');
    expect(marks[2]).toHaveAttribute('data-testid', 'mark-cursor');
  });

  it('is decorative: the cluster is hidden from assistive tech', () => {
    const { container } = render(<ProviderMarks />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders 14px marks by default and respects a custom size', () => {
    const { rerender } = render(<ProviderMarks />);
    expect(screen.getByTestId('mark-claude')).toHaveAttribute('width', '14');
    expect(screen.getByTestId('mark-claude')).toHaveAttribute('height', '14');
    rerender(<ProviderMarks size={20} />);
    expect(screen.getByTestId('mark-claude')).toHaveAttribute('width', '20');
  });

  it('applies the default black/white color and merges a color override', () => {
    const { container, rerender } = render(<ProviderMarks />);
    expect(container.firstChild).toHaveClass('text-black-new', 'dark:text-white');

    rerender(<ProviderMarks className="text-white dark:text-black-pure" />);
    // twMerge drops the conflicting default colors in favor of the override.
    expect(container.firstChild).toHaveClass('text-white', 'dark:text-black-pure');
    expect(container.firstChild).not.toHaveClass('text-black-new');
    expect(container.firstChild).not.toHaveClass('dark:text-white');
  });
});
