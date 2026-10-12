import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import ModelIndexClient from './model-index-client';

const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));
vi.mock('components/pages/doc/sticky-table', () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock('./images/alibaba.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('./images/anthropic.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('./images/google.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('./images/openai.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/shared/code-block-wrapper/images/check.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/shared/code-block-wrapper/images/copy.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('icons/search.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));

const createRow = (overrides) => ({
  id: 'model-id',
  name: 'Model',
  provider: 'openai',
  providerName: 'OpenAI',
  inputs: ['text'],
  inputsLabel: 'text',
  isImageCapable: false,
  contextWindow: 100000,
  contextLabel: '100K',
  releaseDate: '2026-01-01',
  releaseLabel: 'Jan 2026',
  costInput: 1,
  costInputLabel: '$1',
  costOutput: 2,
  costOutputLabel: '$2',
  openWeights: false,
  ...overrides,
});

const rows = [
  createRow({
    id: 'new-image-model',
    name: 'New image model',
    provider: 'google',
    providerName: 'Google',
    inputs: ['text', 'image'],
    inputsLabel: 'text, image',
    isImageCapable: true,
    releaseDate: '2026-02-01',
    releaseLabel: 'Feb 2026',
    costInput: 2,
    costInputLabel: '$2',
  }),
  createRow({
    id: 'old-open-model',
    name: 'Old open model',
    provider: 'anthropic',
    providerName: 'Anthropic',
    inputs: ['text', 'image'],
    inputsLabel: 'text, image',
    isImageCapable: true,
    releaseDate: '2026-01-01',
    releaseLabel: 'Jan 2026',
    costInput: 1,
    costInputLabel: '$1',
    openWeights: true,
  }),
  createRow({
    id: 'unpriced-model',
    name: 'Unpriced model',
    provider: 'google',
    providerName: 'Google',
    releaseDate: null,
    releaseLabel: '—',
    costInput: undefined,
    costInputLabel: '—',
  }),
];

const getVisibleModelNames = () =>
  within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('ModelIndexClient', () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}

      disconnect() {}
    };
  });

  beforeEach(() => {
    router.push.mockReset();
  });

  it('keeps missing values last in both sort directions', () => {
    render(<ModelIndexClient rows={rows} variant="landing" />);

    expect(getVisibleModelNames()).toEqual(['New image model', 'Old open model', 'Unpriced model']);

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Input /M' }));
    expect(getVisibleModelNames()).toEqual(['Old open model', 'New image model', 'Unpriced model']);

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Input /M, currently ascending' }));
    expect(getVisibleModelNames()).toEqual(['New image model', 'Old open model', 'Unpriced model']);
  });

  it('combines model type, provider, and open-weight filters', () => {
    render(<ModelIndexClient rows={rows} variant="landing" />);

    fireEvent.click(screen.getByRole('button', { name: 'Image' }));
    expect(getVisibleModelNames()).toEqual(['New image model', 'Old open model']);

    fireEvent.click(screen.getByRole('button', { name: 'All providers' }));
    fireEvent.click(screen.getByRole('option', { name: 'Anthropic' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Open weights only' }));

    expect(getVisibleModelNames()).toEqual(['Old open model']);
    expect(screen.getByText('Showing 1 model.')).toBeInTheDocument();
  });

  it('closes the provider listbox when focus leaves the control', () => {
    render(<ModelIndexClient rows={rows} variant="landing" />);

    const trigger = screen.getByRole('button', { name: 'All providers' });
    const openWeights = screen.getByRole('checkbox', { name: 'Open weights only' });

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox', { name: 'Model providers' })).toBeInTheDocument();

    fireEvent.blur(trigger, { relatedTarget: openWeights });
    expect(screen.queryByRole('listbox', { name: 'Model providers' })).not.toBeInTheDocument();
  });

  it('searches canonical row fields and returns focus after clearing', () => {
    render(<ModelIndexClient rows={rows} variant="landing" />);

    const searchInput = screen.getByRole('searchbox', { name: 'Search models' });
    fireEvent.change(searchInput, { target: { value: 'google' } });

    expect(getVisibleModelNames()).toEqual(['New image model', 'Unpriced model']);

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(searchInput).toHaveFocus();
    expect(getVisibleModelNames()).toHaveLength(3);
  });

  it('navigates to the model detail page when a row is clicked', () => {
    render(<ModelIndexClient rows={rows} variant="landing" />);

    fireEvent.click(screen.getByRole('link', { name: 'New image model' }).closest('tr'));

    expect(router.push).toHaveBeenCalledWith('/docs/ai-gateway/models/new-image-model');
  });
});
