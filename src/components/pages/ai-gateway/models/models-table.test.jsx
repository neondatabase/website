import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ModelsTable from './models-table';

vi.mock('components/pages/doc/ai-gateway-model-index/images/alibaba.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/pages/doc/ai-gateway-model-index/images/anthropic.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/pages/doc/ai-gateway-model-index/images/google.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/pages/doc/ai-gateway-model-index/images/openai.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/shared/code-block-wrapper/images/check.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('components/shared/code-block-wrapper/images/copy.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('icons/chevron-down.inline.svg', () => ({
  default: (props) => <svg {...props} />,
}));
vi.mock('icons/close-small.inline.svg', () => ({
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
    id: 'new-video-model',
    name: 'New video model',
    provider: 'google',
    providerName: 'Google',
    inputs: ['text', 'video'],
    inputsLabel: 'text, video',
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

describe('ModelsTable', () => {
  it('keeps missing values last in both sort directions', () => {
    render(<ModelsTable rows={rows} />);

    expect(getVisibleModelNames()).toEqual(['New video model', 'Old open model', 'Unpriced model']);

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Input' }));
    expect(getVisibleModelNames()).toEqual(['Old open model', 'New video model', 'Unpriced model']);

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Input, currently ascending' }));
    expect(getVisibleModelNames()).toEqual(['New video model', 'Old open model', 'Unpriced model']);
  });

  it('combines modality, provider, and open-weight filters', () => {
    render(<ModelsTable rows={rows} />);

    fireEvent.click(screen.getByRole('button', { name: 'Video' }));
    expect(getVisibleModelNames()).toEqual(['New video model']);

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    fireEvent.click(screen.getByRole('button', { name: 'All Providers' }));
    fireEvent.click(screen.getByRole('button', { name: 'Anthropic' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open weights only' }));

    expect(getVisibleModelNames()).toEqual(['Old open model']);
    expect(screen.getByText('Showing 1 model.')).toBeInTheDocument();
  });

  it('searches canonical row fields and returns focus after clearing', () => {
    render(<ModelsTable rows={rows} />);

    const searchInput = screen.getByRole('searchbox', { name: 'Search models' });
    fireEvent.change(searchInput, { target: { value: 'google' } });

    expect(getVisibleModelNames()).toEqual(['New video model', 'Unpriced model']);

    fireEvent.click(screen.getByRole('button', { name: 'Clear model search' }));

    expect(searchInput).toHaveFocus();
    expect(getVisibleModelNames()).toHaveLength(3);
  });
});
