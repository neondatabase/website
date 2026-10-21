import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import RaffleForm from './raffle-form';

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('images/pages/contact-sales/form-pattern.png', () => ({ default: 'pattern.png' }));
vi.mock('icons/close.inline.svg', () => ({ default: () => null }));
vi.mock('components/shared/button', () => ({
  default: ({ children, type, disabled }) => (
    <button type={type} disabled={disabled}>
      {children}
    </button>
  ),
}));
vi.mock('components/shared/link', () => ({
  default: ({ children, to }) => <a href={to}>{children}</a>,
}));
vi.mock('components/shared/field', async () => {
  const { forwardRef } = await import('react');
  return {
    default: forwardRef(function MockField(
      { label, name, onChange, onBlur, type, isDisabled },
      ref
    ) {
      return (
        <label>
          {label}
          <input
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            type={type}
            disabled={isDisabled}
            ref={ref}
          />
        </label>
      );
    }),
  };
});

const fillForm = () => {
  fireEvent.change(screen.getByLabelText('First Name*'), { target: { value: 'Alex' } });
  fireEvent.change(screen.getByLabelText('Last Name*'), { target: { value: 'Lopez' } });
  fireEvent.change(screen.getByLabelText('Email*'), { target: { value: 'alex@example.com' } });
};
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Enter the raffle' }));

describe('Raffle form submission', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the same request ID when retrying unchanged data after a network failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Connection lost'));
    fetch.mockResolvedValueOnce(Response.json({ success: true }));
    render(<RaffleForm />);
    fillForm();
    submit();
    await screen.findByRole('alert');
    const first = JSON.parse(fetch.mock.calls[0][1].body);
    expect(first.requestId).toMatch(/^[a-f0-9-]{36}$/);
    fireEvent.click(screen.getByRole('button', { name: 'Close error message' }));
    submit();
    await screen.findByText('Thanks for entering the raffle');
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual(first);
  });

  it('generates a new request ID if the user changes fields before retrying', async () => {
    fetch.mockResolvedValueOnce(Response.json({ error: 'Submission failed' }, { status: 502 }));
    fetch.mockResolvedValueOnce(Response.json({ success: true }));
    render(<RaffleForm />);
    fillForm();
    submit();
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Close error message' }));
    fireEvent.change(screen.getByLabelText('First Name*'), { target: { value: 'Dana' } });
    submit();
    await screen.findByText('Thanks for entering the raffle');
    const first = JSON.parse(fetch.mock.calls[0][1].body);
    const second = JSON.parse(fetch.mock.calls[1][1].body);
    expect(second.requestId).not.toBe(first.requestId);
    expect(second.firstname).toBe('Dana');
  });

  it('does not show success when the API returns HTTP 200 without confirmation', async () => {
    fetch.mockResolvedValueOnce(Response.json({ success: false }));
    render(<RaffleForm />);
    fillForm();
    submit();
    await screen.findByRole('alert');
    expect(screen.queryByText('Thanks for entering the raffle')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'enter using Google Forms' }).getAttribute('href')
    ).toBe('https://forms.gle/C7TgUq7nPLA2L5d76');
  });

  it('disables submission while the request is in flight', async () => {
    let resolveResponse;
    fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResponse = resolve;
        })
    );
    render(<RaffleForm />);
    fillForm();
    submit();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Submitting…' }).disabled).toBe(true)
    );
    resolveResponse(Response.json({ success: true }));
    await screen.findByText('Thanks for entering the raffle');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
