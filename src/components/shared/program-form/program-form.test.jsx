import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProgramForm from './program-form';

vi.mock('components/shared/button', () => ({
  default: ({ children }) => <button>{children}</button>,
}));
vi.mock('icons/check.inline.svg', () => ({ default: () => <svg /> }));

describe('Repeated program forms', () => {
  it('associates each label with its own field, including the GitHub URL', () => {
    render(
      <>
        <ProgramForm type="openSource" />
        <ProgramForm type="openSource" id="open-source-apply" />
      </>
    );

    const inputs = ['Website URL *', 'GitHub Project Link *', 'Contact Email *'].flatMap(
      (label) => {
        const fields = screen.getAllByLabelText(label);
        expect(fields).toHaveLength(2);
        return fields;
      }
    );
    expect(new Set(inputs.map((input) => input.id)).size).toBe(6);

    const emails = screen.getAllByLabelText('Contact Email *');
    fireEvent.change(emails[1], { target: { value: 'alex@example.com' } });
    expect(emails[0]).toHaveValue('');
    expect(emails[1]).toHaveValue('alex@example.com');
  });
});
