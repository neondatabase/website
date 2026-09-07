import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import copyToClipboard from 'copy-to-clipboard';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Provisioner from './hero/provisioner';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }));
vi.mock('icons/home/copied.inline.svg', () => ({
  default: () => createElement('span', { 'aria-hidden': true }),
}));
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }) =>
    createElement('img', {
      src: typeof src === 'string' ? src : src.src,
      alt,
      width,
      height,
      className,
    }),
}));

vi.mock('components/shared/button', () => ({
  default: ({ children, to, handleClick, disabled, type, target, rel }) =>
    createElement(
      to ? 'a' : 'button',
      { href: to, onClick: handleClick, disabled, type, target, rel },
      children
    ),
}));

const createResult = (services = []) => ({
  project: { id: 'preview-project-only', expires_at: '2026-09-06T18:00:00Z' },
  claim: {
    expires_in: 3600,
    verification_uri_complete: 'https://example.com/claim?user_code=DEMO-ONLY',
  },
  credentials: {
    database_url: 'postgresql://preview:demo-only@ep-preview.example.com/neondb?sslmode=require',
    services: {
      ...(services.includes('data-api')
        ? { data_api: { url: 'https://preview.example.com/rest/v1' } }
        : {}),
      ...(services.includes('auth')
        ? { auth: { base_url: 'https://preview.example.com/auth' } }
        : {}),
    },
  },
  capabilities: [
    { capability: 'postgres', granted: true },
    ...services.map((service) => ({
      capability: service === 'data-api' ? 'data_api' : service,
      granted: true,
    })),
  ],
});

const resolveRequest = (body, { ok = true, status = 200 } = {}) => {
  fetch.mockResolvedValueOnce({ ok, status, json: async () => body });
};

const selectService = (name) => fireEvent.click(screen.getByRole('button', { name }));
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Create a project' }));

describe('Claimable Neon provisioning form', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('renders the current form copy and starts with optional services off', () => {
    render(<Provisioner />);

    expect(screen.getByRole('heading', { name: 'Configure your backend' })).toBeVisible();
    expect(
      screen.getByText(
        'Select the services to include in your project. Postgres is always included.'
      )
    ).toBeVisible();
    expect(screen.getByText('A temporary database is always included.')).toBeVisible();
    expect(screen.getByText('Query over HTTPS. Stays enabled after claim.')).toBeVisible();
    expect(screen.getByText('Add authentication. Stays enabled after claim.')).toBeVisible();
    expect(screen.getByText(/No account or payment details required/)).toHaveTextContent(
      'No account or payment details required. Unclaimed projects expire in 72 hours and are capped at 100 MB storage and 1 GB transfer.'
    );
    expect(screen.getByRole('button', { name: /Data API/ })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    expect(screen.getByRole('button', { name: /Managed Better Auth/ })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    [[], [], 'This project includes Lakebase Postgres.'],
    [['Data API'], ['data-api'], 'This project includes Lakebase Postgres and Data API.'],
    [['Managed Better Auth'], ['auth'], 'This project includes Lakebase Postgres and Auth.'],
    [
      ['Data API', 'Managed Better Auth'],
      ['data-api', 'auth'],
      'This project includes Lakebase Postgres, Data API, and Auth.',
    ],
  ])('submits the existing API contract for %j', async (labels, services, resultSummary) => {
    resolveRequest(createResult(services));
    render(<Provisioner />);
    labels.forEach((label) => selectService(new RegExp(label)));
    submit();

    await screen.findByRole('heading', { name: resultSummary });
    expect(fetch).toHaveBeenCalledExactlyOnceWith('/api/claimable-neon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ services }),
    });
  });

  it('removes a toggled-off service from the request', async () => {
    resolveRequest(createResult(['auth']));
    render(<Provisioner />);
    selectService(/Data API/);
    selectService(/Managed Better Auth/);
    selectService(/Data API/);
    submit();
    await screen.findByText('Project ready');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ services: ['auth'] });
  });

  it('disables repeat submission while the request is pending', async () => {
    let complete;
    fetch.mockReturnValueOnce(
      new Promise((resolve) => {
        complete = resolve;
      })
    );
    render(<Provisioner />);
    submit();
    const pendingButton = screen.getByRole('button', { name: 'Creating project…' });
    expect(pendingButton).toBeDisabled();
    fireEvent.click(pendingButton);
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(async () => complete({ ok: true, json: async () => createResult() }));
    expect(screen.getByText('Project ready')).toBeVisible();
  });

  it('preserves credentials, security warnings, expiry information, and focus on success', async () => {
    const result = createResult(['data-api', 'auth']);
    resolveRequest(result);
    render(<Provisioner />);
    submit();

    const heading = await screen.findByRole('heading', {
      name: 'This project includes Lakebase Postgres, Data API, and Auth.',
    });
    expect(heading).toHaveFocus();
    expect(screen.getByText(result.project.id)).toBeVisible();
    Object.values({
      database: result.credentials.database_url,
      data: result.credentials.services.data_api.url,
      auth: result.credentials.services.auth.base_url,
    }).forEach((value) => expect(screen.getByText(value)).toBeVisible());

    expect(screen.queryByText('Claim link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy Claim link' })).not.toBeInTheDocument();
    const summary = screen.getByText(/Save these values now/);
    expect(summary).toHaveTextContent('This page will not show them again.');
    expect(summary).toHaveTextContent('Claim deadline:');
    expect(summary).toHaveTextContent('Project expires:');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await waitFor(() => {
      fireEvent.focus(screen.getByRole('button', { name: 'More info.' }));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    const warning = await screen.findByRole('tooltip');
    expect(warning).toHaveTextContent(
      'If the claim link expires, create another project from this page.'
    );
    expect(warning).toHaveTextContent('Opening the claim link does not freeze access.');
    expect(warning).toHaveTextContent('Continuing to Neon on the claim page rotates DATABASE_URL.');
    expect(warning).toHaveTextContent(
      'After the transfer finishes, pull a new one from the Neon console.'
    );
    expect(warning).toHaveTextContent('Managed Better Auth and the Data API stay enabled.');
    expect(screen.getByRole('link', { name: 'Open the claim link' })).toHaveAttribute(
      'href',
      result.claim.verification_uri_complete
    );
  });

  it('only renders returned optional credentials and keeps single-service wording', async () => {
    resolveRequest(createResult(['data-api']));
    render(<Provisioner />);
    submit();
    await screen.findByText('Project ready');
    expect(
      screen.getByRole('heading', {
        name: 'This project includes Lakebase Postgres and Data API.',
      })
    ).toBeVisible();
    expect(screen.getByText('NEON_DATA_API_URL')).toBeVisible();
    expect(screen.queryByText('NEON_AUTH_BASE_URL')).not.toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'More info.' }));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    expect(await screen.findByRole('tooltip')).toHaveTextContent('The Data API stays enabled.');
  });

  it('shows denied capabilities without suggesting they were granted', async () => {
    const result = createResult();
    result.capabilities.push({ capability: 'auth', granted: false, reason: 'requires_claim' });
    resolveRequest(result);
    render(<Provisioner />);
    submit();
    await screen.findByText('Project ready');
    expect(
      screen.getByRole('heading', { name: 'This project includes Lakebase Postgres.' })
    ).toBeVisible();
    expect(screen.getByText(/Managed Better Auth was not granted/)).toHaveTextContent(
      'Managed Better Auth was not granted. Claim the project to enable it.'
    );
    expect(screen.queryByText('NEON_AUTH_BASE_URL')).not.toBeInTheDocument();
    await waitFor(() => {
      fireEvent.focus(screen.getByRole('button', { name: 'More info.' }));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    expect(await screen.findByRole('tooltip')).not.toHaveTextContent('stays enabled');
  });

  it('copies the exact credential and displays copied feedback', async () => {
    const result = createResult();
    resolveRequest(result);
    render(<Provisioner />);
    submit();
    await screen.findByText('Project ready');
    fireEvent.click(screen.getByRole('button', { name: 'Copy DATABASE_URL' }));
    expect(copyToClipboard).toHaveBeenCalledWith(result.credentials.database_url);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeVisible();
  });

  it('returns to the form while retaining the existing service selection', async () => {
    resolveRequest(createResult(['auth']));
    render(<Provisioner />);
    selectService(/Managed Better Auth/);
    submit();
    await screen.findByText('Project ready');
    fireEvent.click(screen.getByRole('button', { name: 'Create another project' }));
    expect(screen.getByRole('heading', { name: 'Configure your backend' })).toBeVisible();
    expect(screen.getByRole('button', { name: /Managed Better Auth/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.queryByText('Project ready')).not.toBeInTheDocument();
  });

  it('shows API errors and allows a successful retry', async () => {
    resolveRequest(
      { error: { message: 'Too many projects. Please try again later.' } },
      { ok: false, status: 429 }
    );
    resolveRequest(createResult());
    render(<Provisioner />);
    submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Too many projects. Please try again later.'
    );
    expect(screen.getByRole('button', { name: 'Create a project' })).toBeEnabled();
    submit();
    await screen.findByText('Project ready');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('uses the main fallback message for an HTTP error without a message', async () => {
    resolveRequest({}, { ok: false, status: 503 });
    render(<Provisioner />);
    submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Project creation failed with HTTP 503.'
    );
  });

  it('uses the connection guidance when the request fails', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    render(<Provisioner />);
    submit();
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'The project could not be created. Check your connection and try again.'
      )
    );
  });
});
