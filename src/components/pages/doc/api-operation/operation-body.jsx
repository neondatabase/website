'use client';

import PropTypes from 'prop-types';
import { useState, useCallback, useMemo } from 'react';

import { EditableField } from 'components/pages/doc/annotated-field';
import DepthControl from 'components/pages/doc/depth-control';
import { cn } from 'utils/cn';

import { SectionHeader } from './operation-shared';
import { useShallow, useStore } from './store';

// ── Pure helpers ────────────────────────────────────────────────────────────

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Build dot-path value into a nested object (for smart copy).
// Non-string values (null/undefined/number/boolean) pass through unchanged;
// strings get coerced — "true"/"false" → boolean, numeric → number. This lets
// buildSmartJson safely call setPath(result, path, null) for included-but-not-
// edited fields without crashing on null.trim().
export function setPath(obj, path, value) {
  const parts = path.split('.');
  if (parts.some((p) => FORBIDDEN_KEYS.has(p))) return;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (typeof value !== 'string') {
    cur[last] = value;
    return;
  }
  if (value === 'true') cur[last] = true;
  else if (value === 'false') cur[last] = false;
  else if (value.trim() !== '' && !isNaN(value.trim())) cur[last] = Number(value.trim());
  else cur[last] = value;
}

// Resolve a leaf's session-identity global mapping. Returns the
// global name (e.g. 'org_id') when this leaf path is unified, else null.
// - bodyGlobals: [{ path, global }] entries from the generator (already
//   excludes paths containing '[]' — array carveout)
// - idMeaning: per-op resolution for the bare `id` field (e.g. branches op
//   → 'branch_id'). Only applies when the leaf's name is exactly 'id'.
export function effectiveGlobalForLeaf(name, path, bodyGlobals, idMeaning) {
  if (path.includes('[]')) return null;
  if (bodyGlobals) {
    for (const entry of bodyGlobals) {
      if (entry.path === path) return entry.global;
    }
  }
  if (name === 'id' && idMeaning) return idMeaning;
  return null;
}

// buildSmartJson(bodyTree, editedValues, includedFields, paramValues?,
//                bodyGlobals?, idMeaning?)
//
// Globals take precedence over schema defaults: if the leaf has a global
// mapping AND paramStore has a value for it, that value wins. Per-op edits
// still win for non-globals (per-field include toggles).
export function buildSmartJson(
  bodyTree,
  editedValues,
  includedFields,
  paramValues = {},
  bodyGlobals = null,
  idMeaning = null
) {
  const result = {};

  const walk = (nodes, parentPath = '') => {
    for (const node of nodes) {
      const path = parentPath ? `${parentPath}.${node.key}` : node.key;
      const isIncluded = includedFields.has(path);
      const isEdited = editedValues[path] !== undefined;

      const globalName = node.children?.length
        ? null
        : effectiveGlobalForLeaf(node.key, path, bodyGlobals, idMeaning);
      const hasGlobalVal = globalName && paramValues[globalName] !== undefined;

      if (node.required || isIncluded || isEdited || hasGlobalVal) {
        if (node.children?.length) {
          walk(node.children, path);
        } else if (hasGlobalVal) {
          setPath(result, path, paramValues[globalName]);
        } else if (isEdited) {
          setPath(result, path, editedValues[path]);
        } else if (node.value !== undefined) {
          setPath(result, path, node.value);
        } else if (isIncluded) {
          setPath(result, path, null);
        }
      }
    }
  };

  walk(bodyTree);
  return result;
}

export function addWithAncestors(s, path) {
  const parts = path.split('.');
  for (let i = 1; i <= parts.length; i++) {
    s.add(parts.slice(0, i).join('.'));
  }
}

export function getLeafPaths(nodes, prefix = '') {
  const paths = [];
  for (const node of nodes) {
    const path = prefix ? `${prefix}.${node.key}` : node.key;
    if (node.children?.length) {
      paths.push(...getLeafPaths(node.children, path));
    } else {
      paths.push(path);
    }
  }
  return paths;
}

// Leaf paths whose final segment is exactly `id` (no array `[]`).
// Used by useBodyState to apply idMeaning unification at render time.
export function bareIdPaths(nodes, prefix = '') {
  const paths = [];
  for (const node of nodes) {
    const path = prefix ? `${prefix}.${node.key}` : node.key;
    if (node.children?.length) {
      paths.push(...bareIdPaths(node.children, path));
    } else if (node.key === 'id') {
      paths.push(path);
    }
  }
  return paths;
}

// ── State hook ──────────────────────────────────────────────────────────────

// useBodyState(bodyTree, operation?)
//   - bodyTree: tree of body fields (built upstream from schema)
//   - operation: op JSON (provides bodyGlobals + idMeaning annotations)
//
// Globals are read/written directly through the zustand store; no
// `params` argument is needed. When `operation` is omitted, the hook
// degrades to per-path edits only (no global routing) — useful for
// stripped-down tests and any caller that doesn't have generator
// annotations.
export function useBodyState(bodyTree, operation = null) {
  const bodyGlobals = operation?.bodyGlobals ?? null;
  const idMeaning = operation?.idMeaning ?? null;
  const idPaths = useMemo(() => (idMeaning ? bareIdPaths(bodyTree) : []), [idMeaning, bodyTree]);
  const allLeafPaths = useMemo(() => getLeafPaths(bodyTree), [bodyTree]);

  // Raw per-path body edits as a plain object, scoped to this op's leaf
  // paths. We project from store.body so adding an unrelated body path
  // elsewhere doesn't re-render this hook.
  const rawEditedValues = useStore(
    useShallow((s) => {
      const out = {};
      for (const p of allLeafPaths) {
        const v = s.body[p];
        if (v !== undefined) out[p] = v;
      }
      return out;
    })
  );

  // bodyGlobals + idMeaning overlay onto the per-path view. Same selector
  // shape as rawEditedValues but folding in the relevant globals.
  // INVARIANT: a path with a bodyGlobals (or idMeaning) mapping reads
  // from store.globals only. The per-path slot store.body[path] is NEVER
  // written for that path — see the onEdit branching below.
  const editedValues = useStore(
    useShallow((s) => {
      const out = {};
      for (const p of allLeafPaths) {
        const v = s.body[p];
        if (v !== undefined) out[p] = v;
      }
      if (bodyGlobals) {
        for (const { path, global } of bodyGlobals) {
          const v = s.globals[global];
          if (v !== undefined) out[path] = v;
        }
      }
      if (idMeaning && s.globals[idMeaning] !== undefined) {
        for (const p of idPaths) out[p] = s.globals[idMeaning];
      }
      return out;
    })
  );

  // Built OUTSIDE the selector via useMemo so the Set instance is stable
  // on `editedValues` identity. useShallow comparing Set instances by
  // reference would thrash re-renders on every store change.
  const includedFields = useMemo(() => {
    const out = new Set();
    for (const p of Object.keys(editedValues)) addWithAncestors(out, p);
    return out;
  }, [editedValues]);

  const [openGroups, setOpenGroups] = useState({});
  const [depth, setDepth] = useState(1);
  const [pinnedField, setPinnedField] = useState(null);
  const [errors, setErrors] = useState({});

  // localCount = per-path body edits only (no globals). Used by the
  // orchestrator's live-block badge so globals shared with params/cli
  // aren't double-counted.
  const localCount = Object.keys(rawEditedValues).length;
  // globalCount = bodyGlobals paths with a value + idMeaning's
  // contribution. idPaths can be empty when an op has idMeaning set but
  // no body leaves named `id` (a "dead annotation" — e.g. getActiveRegions
  // tagged 'regions' carries idMeaning='region_id' but has no body). In
  // that case this branch contributes 0, which is the intended no-op.
  const globalCount = useStore((s) => {
    let n = 0;
    if (bodyGlobals) {
      for (const { global } of bodyGlobals) {
        if (s.globals[global] !== undefined) n++;
      }
    }
    if (idMeaning && s.globals[idMeaning] !== undefined) n += idPaths.length;
    return n;
  });
  const editCount = localCount + globalCount;

  // json reads globals through useStore (selector) to get a reactive
  // dependency, then defers to the pure buildSmartJson helper.
  const globals = useStore((s) => s.globals);
  const json = useMemo(
    () =>
      buildSmartJson(bodyTree, rawEditedValues, includedFields, globals, bodyGlobals, idMeaning),
    [bodyTree, rawEditedValues, includedFields, globals, bodyGlobals, idMeaning]
  );

  const isOpen = useCallback(
    (path) => {
      if (openGroups[path] !== undefined) return openGroups[path];
      const d = path.split('.').length - 1;
      return d < depth;
    },
    [openGroups, depth]
  );

  const toggleOpen = useCallback(
    (path) => {
      setOpenGroups((p) => ({ ...p, [path]: !isOpen(path) }));
    },
    [isOpen]
  );

  // Capture stable action refs once; zustand action refs don't change
  // after store creation.
  const { setGlobal, setBody, resetGlobals, resetBodyPaths } = useStore.getState();

  const onEdit = useCallback(
    (path, val) => {
      // Route global-mapped paths to store.globals (shared across body,
      // cli, params surfaces). Non-globals go to per-path body slots.
      // Enforces the "never double-write a global-mapped path" invariant.
      const leafName = path.split('.').pop();
      const global = effectiveGlobalForLeaf(leafName, path, bodyGlobals, idMeaning);
      if (global) setGlobal(global, val);
      else setBody(path, val);
    },
    [bodyGlobals, idMeaning, setGlobal, setBody]
  );

  const onToggleInclude = useCallback(
    (path) => {
      const leafName = path.split('.').pop();
      const global = effectiveGlobalForLeaf(leafName, path, bodyGlobals, idMeaning);
      if (global) {
        const cur = useStore.getState().globals[global];
        setGlobal(global, cur === undefined ? '' : undefined);
        return;
      }
      const cur = useStore.getState().body[path];
      setBody(path, cur === undefined ? '' : undefined);
    },
    [bodyGlobals, idMeaning, setGlobal, setBody]
  );

  const setDepthAndClear = useCallback((d) => {
    setDepth(d);
    setOpenGroups({});
  }, []);

  const onFieldError = useCallback((path, err) => {
    setErrors((p) => {
      if (!err) {
        const n = { ...p };
        delete n[path];
        return n;
      }
      return { ...p, [path]: err };
    });
  }, []);

  const reset = useCallback(() => {
    // Clear per-path body slots for paths this op surfaces.
    resetBodyPaths(allLeafPaths);
    // Clear globals this section can touch (bodyGlobals + idMeaning if
    // the op has any bare-id leaves). NOT all CROSS_PAGE_PARAMS — that's
    // useParamsState.reset()'s job.
    const toReset = [];
    for (const { global } of bodyGlobals ?? []) toReset.push(global);
    if (idMeaning && idPaths.length > 0) toReset.push(idMeaning);
    if (toReset.length > 0) resetGlobals(toReset);
    setErrors({});
  }, [allLeafPaths, bodyGlobals, idMeaning, idPaths, resetBodyPaths, resetGlobals]);

  return {
    editedValues,
    includedFields,
    openGroups,
    depth,
    pinnedField,
    errors,
    editCount,
    // Section-local count, without the global contribution. The
    // orchestrator's live-block badge sums localEditCount across sections
    // and dedups globals once, so globals shared with params/cli aren't
    // double-counted.
    localEditCount: localCount,
    json,
    setPinned: setPinnedField,
    isOpen,
    toggleOpen,
    onEdit,
    onToggleInclude,
    setDepth: setDepthAndClear,
    onFieldError,
    reset,
  };
}

// ── Section component ───────────────────────────────────────────────────────

export const BodySection = ({ operation, bodyTree, state, copy, copiedId }) => (
  <div className="mt-9">
    <SectionHeader
      title="Request body"
      badge={operation.requestBody?.required ? 'required' : undefined}
      right={
        bodyTree.length > 0 && (
          <div className="flex items-center gap-2.5">
            <DepthControl value={state.depth} onChange={state.setDepth} />
            <span className="h-4 w-px bg-gray-new-90 dark:bg-gray-new-20" />
            <button
              type="button"
              onClick={() => copy('body', JSON.stringify(state.json, null, 2))}
              className={cn(
                'rounded border px-2 py-0.5 font-mono text-[11px] transition-all',
                copiedId === 'body'
                  ? 'border-green-45/40 text-green-45'
                  : Object.keys(state.errors).length > 0
                    ? 'border-amber-400/40 text-amber-400'
                    : 'border-gray-new-90 text-gray-new-50 hover:border-gray-new-60 dark:border-gray-new-20 dark:text-gray-new-60'
              )}
            >
              {copiedId === 'body'
                ? '✓ Copied'
                : Object.keys(state.errors).length > 0
                  ? `⚠ Copy (${Object.keys(state.errors).length} error${Object.keys(state.errors).length > 1 ? 's' : ''})`
                  : state.editCount > 0
                    ? `Copy (${state.editCount} edited)`
                    : 'Copy JSON'}
            </button>
          </div>
        )
      }
    />
    {bodyTree.length > 0 ? (
      <div className="overflow-hidden rounded-xl border border-gray-new-90 dark:border-gray-new-20">
        <div className="border-b border-gray-new-90 bg-gray-new-98 px-3.5 py-2 dark:border-gray-new-20 dark:bg-gray-new-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-new-60 italic dark:text-gray-new-50">
              Click values to edit · ☑ to include
            </span>
            {state.editCount > 0 && (
              <button
                type="button"
                onClick={state.reset}
                className="rounded border border-gray-new-90 px-1.5 py-0.5 text-[10px] text-gray-new-50 transition-all hover:border-gray-new-60 hover:text-gray-new-30 dark:border-gray-new-20 dark:text-gray-new-60"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="bg-gray-new-98 py-1.5 dark:bg-gray-new-10">
          {bodyTree.map((node) => (
            <EditableField
              key={node.key}
              node={node}
              indent={0}
              parentPath=""
              editedValues={state.editedValues}
              includedFields={state.includedFields}
              onEdit={state.onEdit}
              onToggleInclude={state.onToggleInclude}
              onError={state.onFieldError}
              isOpen={state.isOpen}
              onToggle={state.toggleOpen}
              pinnedField={state.pinnedField}
              onPin={state.setPinned}
              showCheckboxes={state.editCount > 0}
            />
          ))}
        </div>
      </div>
    ) : (
      <p className="text-sm text-gray-new-50 dark:text-gray-new-60">No request body.</p>
    )}
  </div>
);

BodySection.propTypes = {
  operation: PropTypes.shape({
    requestBody: PropTypes.shape({ required: PropTypes.bool }),
  }).isRequired,
  bodyTree: PropTypes.array.isRequired,
  state: PropTypes.shape({
    editedValues: PropTypes.object.isRequired,
    includedFields: PropTypes.instanceOf(Set).isRequired,
    depth: PropTypes.number.isRequired,
    pinnedField: PropTypes.string,
    errors: PropTypes.object.isRequired,
    editCount: PropTypes.number.isRequired,
    json: PropTypes.object.isRequired,
    isOpen: PropTypes.func.isRequired,
    toggleOpen: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleInclude: PropTypes.func.isRequired,
    onFieldError: PropTypes.func.isRequired,
    setDepth: PropTypes.func.isRequired,
    setPinned: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  copy: PropTypes.func.isRequired,
  copiedId: PropTypes.string,
};
