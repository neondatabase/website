import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useBodyState } from '../operation-body';
import { useCliState } from '../operation-cli';
import { useParamsState } from '../operation-params';
import { useStore } from '../store';

import { resetTestStore } from './test-utils';

// Tests for the section state hooks. Counterpart to helpers.test.js which
// covers the pure helpers — this file exercises the React lifecycle pieces
// (hydration, onEdit routing, reset cascade, edit-count derivation) that
// regressed silently when session globals change. Each test is intentionally narrow so a
// failure points at a single fact, not a flow.

beforeEach(() => {
  resetTestStore();
});

// ── useParamsState ──────────────────────────────────────────────────────────

describe('useParamsState', () => {
  it("reads the op's own parameters from the store on mount", () => {
    useStore.setState({ perOp: { 'listProjects:limit': '50' } });

    const { result } = renderHook(() =>
      useParamsState({
        operationId: 'listProjects',
        parameters: [{ name: 'limit', in: 'query', schema: {} }],
      })
    );

    expect(result.current.values.limit).toBe('50');
    expect(result.current.included.has('limit')).toBe(true);
  });

  // Regression: a cross-page global set on one op must surface on a
  // different op that does NOT list it as a parameter (the createProject
  // case — org_id is only a body field, not a path/query param).
  it('surfaces cross-page globals not in op.parameters', () => {
    useStore.setState({ globals: { org_id: 'rough-scene-12345678' } });

    const { result } = renderHook(() =>
      useParamsState({ operationId: 'createProject', parameters: [] })
    );

    expect(result.current.values.org_id).toBe('rough-scene-12345678');
    expect(result.current.included.has('org_id')).toBe(true);
  });

  it('onEdit on a cross-page global routes to store.globals', () => {
    const { result } = renderHook(() =>
      useParamsState({
        operationId: 'getProject',
        parameters: [{ name: 'project_id', in: 'path', schema: {} }],
      })
    );

    act(() => result.current.onEdit('project_id', 'still-bird-12345678'));

    expect(result.current.values.project_id).toBe('still-bird-12345678');
    expect(result.current.included.has('project_id')).toBe(true);
    expect(useStore.getState().globals.project_id).toBe('still-bird-12345678');
    // Non-global slot stays empty.
    expect(useStore.getState().perOp['getProject:project_id']).toBeUndefined();
  });

  it('onEdit on a non-global param routes to store.perOp', () => {
    const { result } = renderHook(() =>
      useParamsState({
        operationId: 'listProjects',
        parameters: [{ name: 'limit', in: 'query', schema: {} }],
      })
    );

    act(() => result.current.onEdit('limit', '100'));

    expect(result.current.values.limit).toBe('100');
    expect(useStore.getState().perOp['listProjects:limit']).toBe('100');
    expect(useStore.getState().globals.limit).toBeUndefined();
  });

  // Regression: reset must clear cross-page globals too, otherwise
  // navigating to another op re-surfaces the "ghost" value the user just
  // cleared. Params' Reset is the "wipe the session" affordance — see
  // operation-params.jsx reset comment.
  it('reset clears both this op-perOp AND all cross-page globals', () => {
    useStore.setState({
      perOp: { 'listProjects:limit': '50' },
      globals: { org_id: 'rough-scene-12345678' },
    });

    const { result } = renderHook(() =>
      useParamsState({
        operationId: 'listProjects',
        parameters: [{ name: 'limit', in: 'query', schema: {} }],
      })
    );

    act(() => result.current.reset());

    expect(result.current.values).toEqual({});
    expect(result.current.included.size).toBe(0);
    expect(useStore.getState().perOp['listProjects:limit']).toBeUndefined();
    expect(useStore.getState().globals.org_id).toBeUndefined();
  });
});

// ── useCliState ─────────────────────────────────────────────────────────────

describe('useCliState', () => {
  it('reads per-op non-global edits (e.g. --cursor) from store.perOp', () => {
    useStore.setState({ perOp: { 'listProjects:cursor': 'abc123' } });

    const operation = {
      operationId: 'listProjects',
      cli: { flags: [{ name: 'cursor' }, { name: 'limit' }], positionals: [] },
    };
    const { result } = renderHook(() => useCliState(operation));

    expect(result.current.edits.cursor).toBe('abc123');
    expect(result.current.isFlagIncluded('cursor')).toBe(true);
  });

  // Regression: the section-level editCount counts (local + global)
  // without double-counting when the same global appears as both a CLI
  // flag globalEquiv and an API param. Orchestrator dedup happens
  // separately; this test pins the cli hook's own contract.
  it('editCount counts local + global without double-counting', () => {
    // Operation where org_id is both a CLI flag (globalEquiv) and an API
    // parameter (so it would be counted twice if cli.editCount naively
    // summed both surfaces).
    const operation = {
      operationId: 'createProject',
      cli: {
        flags: [{ name: 'org-id', globalEquiv: 'org_id' }],
        positionals: [],
      },
      parameters: [],
    };

    useStore.setState({ globals: { org_id: 'rough-scene-12345678' } });

    const { result } = renderHook(() => useCliState(operation));

    // org_id is counted once (as a global the cli surfaces). Local edits
    // are zero (no per-op flag was typed). Hence editCount === 1.
    expect(result.current.editCount).toBe(1);
    expect(result.current.localEditCount).toBe(0);
  });
});

// ── useBodyState ────────────────────────────────────────────────────────────

describe('useBodyState', () => {
  it('json overlay: store.globals for a global-mapped leaf wins over schema default', () => {
    // Body tree shape mirrors what the generator emits — required node so
    // it's included in json without an explicit user toggle.
    const bodyTree = [
      {
        key: 'project',
        required: true,
        children: [{ key: 'org_id', required: true, value: 'default-from-schema' }],
      },
    ];
    const operation = {
      operationId: 'createProject',
      bodyGlobals: [{ path: 'project.org_id', global: 'org_id' }],
      parameters: [],
    };

    useStore.setState({ globals: { org_id: 'rough-scene-12345678' } });

    const { result } = renderHook(() => useBodyState(bodyTree, operation));

    expect(result.current.json).toEqual({
      project: { org_id: 'rough-scene-12345678' },
    });
  });

  // INVARIANT: a body path with a bodyGlobals mapping reads from
  // store.globals only — the per-path slot store.body[path] is never
  // written for that path. Without this, cross-surface
  // unification breaks (cli/params see one value, body shows another).
  it('onEdit on a global-mapped leaf writes to store.globals only (never double-writes the body slot)', () => {
    const bodyTree = [
      {
        key: 'project',
        required: true,
        children: [{ key: 'org_id', value: '' }],
      },
    ];
    const operation = {
      operationId: 'createProject',
      bodyGlobals: [{ path: 'project.org_id', global: 'org_id' }],
      parameters: [],
    };

    const { result } = renderHook(() => useBodyState(bodyTree, operation));

    act(() => result.current.onEdit('project.org_id', 'rough-scene-12345678'));

    expect(useStore.getState().globals.org_id).toBe('rough-scene-12345678');
    expect(useStore.getState().body['project.org_id']).toBeUndefined();
  });

  it('onEdit on a non-global path writes to store.body (no global side-effect)', () => {
    const bodyTree = [
      {
        key: 'project',
        required: true,
        children: [{ key: 'name', value: '' }],
      },
    ];
    const operation = {
      operationId: 'createProject',
      bodyGlobals: [], // name is NOT a global
      parameters: [],
    };

    const { result } = renderHook(() => useBodyState(bodyTree, operation));

    act(() => result.current.onEdit('project.name', 'my-project'));

    expect(useStore.getState().body['project.name']).toBe('my-project');
    expect(useStore.getState().globals).toEqual({});
  });
});
