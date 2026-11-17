import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PromptBlockCollapse from './prompt-block-collapse';

const groups = (
  <>
    <div data-prompt-group>
      <span data-prompt-line>First line</span>
    </div>
    <div data-prompt-group>
      <span data-prompt-line>Second group</span>
      <span data-prompt-line>More</span>
    </div>
  </>
);

// The hiding itself is CSS keyed off data-collapsed, so the tests check the attribute.
describe('PromptBlockCollapse', () => {
  it('starts collapsed, and expands and collapses', () => {
    render(<PromptBlockCollapse collapsible>{groups}</PromptBlockCollapse>);

    const button = screen.getByRole('button', { name: 'Show full prompt' });
    const content = document.getElementById(button.getAttribute('aria-controls'));
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(content.hasAttribute('data-collapsed')).toBe(true);

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.textContent).toBe('Show less');
    expect(content.hasAttribute('data-collapsed')).toBe(false);
  });

  it('stays open with no button when the prompt fits', () => {
    const { container } = render(
      <PromptBlockCollapse collapsible={false}>{groups}</PromptBlockCollapse>
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(container.querySelector('[data-collapsed]')).toBeNull();
  });
});
