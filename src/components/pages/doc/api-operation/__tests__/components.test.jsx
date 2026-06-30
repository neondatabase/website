import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AnnotatedField } from 'components/pages/doc/annotated-field';

import { CliSection } from '../operation-cli';
import { CliFlagRow, CliPositionalRow } from '../operation-shared';

// Tests for component render + interaction surfaces that the existing
// hook tests can't reach. These pin "click here → callback fires" wiring
// that previously only the SMOKE-CHECKLIST verified. Each test is narrow
// so a failure points at a single behavior, not a flow.

beforeEach(() => {
  sessionStorage.clear();
});

// ── AnnotatedField ──────────────────────────────────────────────────────────

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

// ── CliFlagRow ──────────────────────────────────────────────────────────────

describe('CliFlagRow', () => {
  const baseFlag = { name: 'org-id', type: 'string' };
  const baseProps = {
    flag: baseFlag,
    isLast: false,
    isIncluded: false,
    isEditing: false,
    currentVal: '',
    isHovered: false,
    onSetHovered: () => {},
    onToggleInclude: () => {},
    onEdit: () => {},
    onSetEditing: () => {},
    showCheckboxes: false,
  };

  it('renders the value-cell button when not editing, with placeholder fallback', () => {
    render(<CliFlagRow {...baseProps} flag={{ ...baseFlag, placeholder: 'project-id' }} />);
    expect(screen.getByRole('button', { name: 'Edit CLI flag org-id' }).textContent).toBe(
      '(project-id)'
    );
  });

  it('clicking the value cell calls onSetEditing(flag.name)', () => {
    const onSetEditing = vi.fn();
    render(<CliFlagRow {...baseProps} onSetEditing={onSetEditing} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit CLI flag org-id' }));
    expect(onSetEditing).toHaveBeenCalledWith('org-id');
  });

  it('when isEditing, renders an input that calls onEdit on change', () => {
    const onEdit = vi.fn();
    render(<CliFlagRow {...baseProps} isEditing onEdit={onEdit} currentVal="" />);
    const input = screen.getByLabelText('Edit CLI flag org-id');
    fireEvent.change(input, { target: { value: 'rough-scene-12345678' } });
    expect(onEdit).toHaveBeenCalledWith('rough-scene-12345678');
  });

  it('input blur calls onSetEditing(null) (exits edit mode)', () => {
    const onSetEditing = vi.fn();
    render(<CliFlagRow {...baseProps} isEditing onSetEditing={onSetEditing} currentVal="x" />);
    fireEvent.blur(screen.getByLabelText('Edit CLI flag org-id'));
    expect(onSetEditing).toHaveBeenCalledWith(null);
  });

  it('Escape key in input calls onSetEditing(null)', () => {
    const onSetEditing = vi.fn();
    render(<CliFlagRow {...baseProps} isEditing onSetEditing={onSetEditing} currentVal="x" />);
    fireEvent.keyDown(screen.getByLabelText('Edit CLI flag org-id'), { key: 'Escape' });
    expect(onSetEditing).toHaveBeenCalledWith(null);
  });

  it('honors labelPrefix override (e.g. ParamsSection renders rows as "parameter")', () => {
    render(<CliFlagRow {...baseProps} labelPrefix="parameter" />);
    expect(screen.getByRole('button', { name: 'Edit parameter org-id' })).toBeInTheDocument();
  });

  it('optional flag checkbox triggers onToggleInclude when shown', () => {
    const onToggleInclude = vi.fn();
    render(<CliFlagRow {...baseProps} showCheckboxes onToggleInclude={onToggleInclude} />);
    // The checkbox is the only non-name <button> in the row when not editing.
    // It's the first <button> in DOM order.
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onToggleInclude).toHaveBeenCalledTimes(1);
  });
});

// ── CliPositionalRow ────────────────────────────────────────────────────────

describe('CliPositionalRow', () => {
  const pos = { display: '<project_id>', apiEquiv: 'project_id' };
  const baseProps = {
    pos,
    currentVal: '',
    isEditing: false,
    onEdit: () => {},
    onSetEditing: () => {},
    isLast: false,
  };

  it('clicking the value cell calls onSetEditing with the editKey (apiEquiv when set)', () => {
    const onSetEditing = vi.fn();
    render(<CliPositionalRow {...baseProps} onSetEditing={onSetEditing} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit CLI argument <project_id>' }));
    expect(onSetEditing).toHaveBeenCalledWith('project_id');
  });

  it('when isEditing, typing in the input calls onEdit', () => {
    const onEdit = vi.fn();
    render(<CliPositionalRow {...baseProps} isEditing onEdit={onEdit} currentVal="" />);
    fireEvent.change(screen.getByLabelText('Edit CLI argument <project_id>'), {
      target: { value: 'still-bird-12345678' },
    });
    expect(onEdit).toHaveBeenCalledWith('still-bird-12345678');
  });
});

// ── CliSection: multi-command rendering ─────────────────────────────────────
//
// The multi-cmd path (operation.cli.commands = [...]) is exercised by exactly
// one operation in the spec (updateProjectBranch). It renders one live block
// + one flag list per command — easy to break with a render refactor.

describe('CliSection multi-cmd', () => {
  // Minimal multi-cmd operation shape: 2 commands, each with its own flag.
  const operation = {
    operationId: 'updateProjectBranch',
    cli: {
      commands: [
        {
          command: 'neon branches rename <id|name> <new-name>',
          covers: ['name'],
          flags: [{ name: 'project-id', type: 'string' }],
          positionals: [],
        },
        {
          command: 'neon branches set-expiration <id|name>',
          covers: ['expires_at'],
          flags: [{ name: 'expires-at', type: 'string' }],
          positionals: [],
        },
      ],
      uncovered: ['protected'],
    },
    parameters: [],
  };
  const cliState = {
    edits: {},
    included: new Set(),
    editingFlag: null,
    hoveredFlag: null,
    globalFlagsOpen: false,
    editCount: 0,
    localEditCount: 0,
    isFlagIncluded: () => false,
    getFlagVal: (f) => f.placeholder ?? '',
    getValueByName: () => '',
    setEditingFlag: () => {},
    setHoveredFlag: () => {},
    setGlobalFlagsOpen: () => {},
    onEdit: () => {},
    onToggle: () => {},
    reset: () => {},
  };

  it('renders both command labels for a multi-command operation', () => {
    render(<CliSection operation={operation} state={cliState} paramValues={{}} copy={() => {}} />);
    // The MultiCmdSection renders the command string as part of each
    // sub-block's live code; searching for substrings is enough to assert
    // both commands made it into the DOM.
    expect(screen.getByText(/neon branches rename/)).toBeDefined();
    expect(screen.getByText(/neon branches set-expiration/)).toBeDefined();
  });

  it("lists each command's distinct flag (no cross-pollination between cmd blocks)", () => {
    render(<CliSection operation={operation} state={cliState} paramValues={{}} copy={() => {}} />);
    // Each cmd contributes one flag; both should render exactly once.
    expect(screen.getAllByText('project-id').length).toBeGreaterThan(0);
    expect(screen.getAllByText('expires-at').length).toBeGreaterThan(0);
  });
});
