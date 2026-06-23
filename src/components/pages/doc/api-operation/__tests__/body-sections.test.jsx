import { render, screen, renderHook } from '@testing-library/react';
import PropTypes from 'prop-types';
import { describe, it, expect, beforeEach } from 'vitest';

import { BodySection, useBodyState, buildSmartJson } from '../operation-body';

import { resetTestStore } from './test-utils';

// Tests for the dormant interactive request-body renderer. The shipped API
// operation page now uses the read-only DocBodySection, so this file pins only
// the preserved flat interactive behavior.

beforeEach(() => {
  resetTestStore();
});

// Body tree mirroring a project-wrapped op: a couple of scalars plus a nested
// `settings` object whose children the "settings" section expands.
const BODY_TREE = [
  {
    key: 'project',
    type: 'object',
    required: false,
    children: [
      // No `value` key: schemaToTree only sets node.value when the schema has a
      // default, so a field like `name` (no default) has an undefined value —
      // which is what lets the curated seed apply.
      { key: 'name', type: 'string', placeholder: 'My project' },
      { key: 'region_id', type: 'string' },
      {
        key: 'settings',
        type: 'object',
        children: [
          { key: 'hipaa', type: 'boolean', value: 'false' },
          { key: 'audit_log_level', type: 'string' },
        ],
      },
      { key: 'history_retention_seconds', type: 'integer' },
    ],
  },
];

const opWith = (extra = {}) => ({
  operationId: 'createProject',
  requestBody: { required: false, ...extra },
});

function Harness({ operation, bodyTree = BODY_TREE }) {
  const state = useBodyState(bodyTree, operation);
  return (
    <BodySection
      operation={operation}
      bodyTree={bodyTree}
      state={state}
      copy={() => {}}
      copiedId={null}
    />
  );
}

Harness.propTypes = {
  operation: PropTypes.object.isRequired,
  bodyTree: PropTypes.array,
};

describe('BodySection', () => {
  it('renders the flat tree and ignores read-only grouping metadata', () => {
    render(
      <Harness operation={opWith({ sections: [{ id: 'unused', label: 'Unused', rows: [] }] })} />
    );
    expect(screen.queryByRole('heading', { name: 'Basics' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Unused' })).toBeNull();
    // Top-level project object still renders.
    expect(screen.getByText('"project"')).toBeTruthy();
  });
});

describe('buildSmartJson', () => {
  it('buildSmartJson output is unchanged whether or not sections exist (parity)', () => {
    // buildSmartJson never reads sections; same inputs → same output.
    const included = new Set(['project', 'project.name']);
    const a = buildSmartJson(BODY_TREE, { 'project.name': 'x' }, included);
    const b = buildSmartJson(BODY_TREE, { 'project.name': 'x' }, included);
    expect(a).toEqual(b);
    expect(a.project.name).toBe('x');
  });

  it('does not apply representative seeds in the dormant interactive renderer', () => {
    const { result } = renderHook(() =>
      useBodyState(BODY_TREE, opWith({ seed: { 'project.name': 'my-production-db' } }))
    );
    expect(result.current.json.project).toBeUndefined();
    expect(result.current.editCount).toBe(0);
  });
});
