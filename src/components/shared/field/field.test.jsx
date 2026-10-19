import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Field from './field';

describe('Field accessibility', () => {
  it('links custom field IDs and validation errors while preserving existing descriptions', () => {
    const props = {
      name: 'email',
      id: 'application-email',
      label: 'Contact email',
      'aria-describedby': 'email-help',
    };
    const { rerender } = render(
      <Field {...props} error="Enter a valid email" errorTag="section" />
    );
    const input = screen.getByLabelText('Contact email');
    const error = screen.getByRole('alert');

    expect(input).toHaveAttribute('id', 'application-email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', `email-help ${error.id}`);
    expect(error).toHaveTextContent('Enter a valid email');
    expect(error.tagName).toBe('SECTION');

    rerender(<Field {...props} />);

    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
