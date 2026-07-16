import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Tag from './tag';

describe('Tag', () => {
  it('uses theme independently from label text', () => {
    render(<Tag label="Public beta" theme="green" />);

    const tag = screen.getByText('Public beta');
    expect(tag).toHaveClass('text-[#00B87B]', 'bg-[#00B87B]/10');
  });

  it('applies a different color theme to the same label', () => {
    render(<Tag label="Public beta" theme="orange" />);

    const tag = screen.getByText('Public beta');
    expect(tag).toHaveClass('text-[#EC6F09]', 'bg-[#EC6F09]/14');
  });

  it('uses the gray theme by default', () => {
    render(<Tag label="Community" />);

    const tag = screen.getByText('Community');
    expect(tag).toHaveClass('text-gray-new-50', 'bg-gray-new-50/10');
  });
});
