import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { AnnotatedField } from 'components/pages/doc/annotated-field';

describe('AnnotatedField', () => {
  const node = {
    key: 'project',
    type: 'object',
    details: {
      description: 'Project details',
    },
    children: [{ key: 'name', type: 'string', value: '(string)' }],
  };

  it('uses the field name area to expand objects and the info control for details', () => {
    const onToggle = vi.fn();
    render(<AnnotatedField node={node} isOpen={() => false} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button', { name: 'Expand project' }));
    expect(onToggle).toHaveBeenCalledWith('project');
    expect(screen.queryByText('Project details')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show project details' }));
    expect(screen.getByText('Project details')).toBeInTheDocument();
  });
});
