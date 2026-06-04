'use client';

import PropTypes from 'prop-types';
import { useState, useCallback, useMemo } from 'react';

import { SectionHeader, CliFlagRow } from './operation-shared';
import { CROSS_PAGE_PARAMS, isCrossPageGlobal, useShallow, useStore } from './store';

// Param state — path + query parameters editor. Shares the row-renderer
// (`CliFlagRow`) with the CLI section because the visual treatment is
// identical: name, type badge, editable value, description, required marker.

export function useParamsState(operation) {
  const opId = operation.operationId;
  const paramNames = useMemo(
    () => (operation.parameters ?? []).map((p) => p.name),
    // operation is a static server-fetched prop; the component remounts on
    // navigation rather than receiving a new operation in place, so this memo
    // never needs to update.
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // values derives from the store: for each param, read from the right
  // namespace (global vs per-op). Plus surface every cross-page global
  // even if this op doesn't list it as a parameter — the "C1" fix, so
  // typing org_id on listProjects' API tab pre-fills createProject's
  // body project.org_id field on a later navigation.
  //
  // useShallow is essential: the selector returns a fresh object literal,
  // useShallow's key-by-key comparison short-circuits re-renders when
  // nothing this op cares about changed.
  //
  // The `out[n] === undefined` check (not `!out[n]`) is intentional: an
  // empty string is a legitimate "user cleared this" value that must NOT
  // be overwritten by the cross-page-globals overlay pass below. Same
  // pattern as useBodyState: empty string is a valid cleared value.
  const values = useStore(
    useShallow((s) => {
      const out = {};
      for (const n of paramNames) {
        const v = isCrossPageGlobal(n) ? s.globals[n] : s.perOp[`${opId}:${n}`];
        if (v !== undefined) out[n] = v;
      }
      for (const n of CROSS_PAGE_PARAMS) {
        if (out[n] === undefined && s.globals[n] !== undefined) out[n] = s.globals[n];
      }
      return out;
    })
  );

  // Built OUTSIDE the selector via useMemo so the Set instance is stable
  // on `values` identity (useShallow comparing Sets by reference would
  // thrash re-renders).
  const included = useMemo(() => new Set(Object.keys(values)), [values]);

  const [editing, setEditing] = useState(null);
  const [hovered, setHovered] = useState(null);

  // For params, every value IS a param-or-cross-page value; there's no
  // "non-local" subset. localEditCount is kept as a separate return so
  // the orchestrator's contract is symmetric across all 3 section hooks.
  const editCount = Object.keys(values).length;
  const localEditCount = editCount;

  const isIncluded = (name) => values[name] !== undefined;

  const getVal = (param) =>
    values[param.name] !== undefined
      ? values[param.name]
      : param.default !== null && param.default !== undefined
        ? String(param.default)
        : '';

  // Capture stable action refs once; zustand action refs don't change
  // after store creation, so deps are stable.
  const { setGlobal, setPerOp, resetGlobals, resetPerOp } = useStore.getState();

  const onEdit = useCallback(
    (name, val) => {
      if (isCrossPageGlobal(name)) setGlobal(name, val);
      else setPerOp(opId, name, val);
    },
    [opId, setGlobal, setPerOp]
  );

  const onToggle = useCallback(
    (name) => {
      const s = useStore.getState();
      const cur = isCrossPageGlobal(name) ? s.globals[name] : s.perOp[`${opId}:${name}`];
      const next = cur === undefined ? '' : undefined;
      if (isCrossPageGlobal(name)) setGlobal(name, next);
      else setPerOp(opId, name, next);
    },
    [opId, setGlobal, setPerOp]
  );

  const reset = useCallback(() => {
    // Clear all cross-page globals + every per-op slot for this op. Mirrors
    // the pre-migration symmetric trio: params' Reset is the "wipe the
    // session" affordance — body and cli have narrower resets that only
    // clear what their own section surfaces.
    resetGlobals([...CROSS_PAGE_PARAMS]);
    resetPerOp(opId);
    setEditing(null);
  }, [opId, resetGlobals, resetPerOp]);

  return {
    values,
    included,
    editing,
    hovered,
    editCount,
    localEditCount,
    isIncluded,
    getVal,
    setEditing,
    setHovered,
    onEdit,
    onToggle,
    reset,
  };
}

// ── Section component ───────────────────────────────────────────────────────

export const ParamsSection = ({ operation, state }) => (
  <div className="mt-9">
    <SectionHeader
      title="Parameters"
      right={
        state.editCount > 0 && (
          <button
            type="button"
            onClick={state.reset}
            className="rounded border border-gray-new-90 px-1.5 py-0.5 text-[10px] text-gray-new-50 transition-all hover:border-gray-new-60 hover:text-gray-new-30 dark:border-gray-new-20 dark:text-gray-new-60"
          >
            Reset
          </button>
        )
      }
    />
    <p className="mb-2 text-[11px] text-gray-new-60 italic dark:text-gray-new-50">
      Click values to edit · ☑ to include in request
    </p>
    <div>
      {operation.parameters.map((param, i) => {
        const flag = {
          name: param.name,
          type: param.type,
          // Path params are toggleable here: unchecking reverts to {placeholder}
          required: param.in !== 'path' && param.required,
          description: param.description,
          descriptionHtml: param.descriptionHtml,
          default: param.default ?? undefined,
          enum: param.enum ?? null,
        };
        return (
          <CliFlagRow
            key={`${param.name}:${param.in}`}
            flag={flag}
            isLast={i === operation.parameters.length - 1}
            isIncluded={state.isIncluded(param.name)}
            isEditing={state.editing === param.name}
            currentVal={state.getVal(param)}
            isHovered={state.hovered === param.name}
            onSetHovered={state.setHovered}
            onToggleInclude={() => state.onToggle(param.name)}
            onEdit={(val) => state.onEdit(param.name, val)}
            onSetEditing={state.setEditing}
            showCheckboxes
            labelPrefix="parameter"
          />
        );
      })}
    </div>
  </div>
);

ParamsSection.propTypes = {
  operation: PropTypes.shape({
    parameters: PropTypes.array,
  }).isRequired,
  state: PropTypes.shape({
    editCount: PropTypes.number.isRequired,
    isIncluded: PropTypes.func.isRequired,
    getVal: PropTypes.func.isRequired,
    editing: PropTypes.string,
    hovered: PropTypes.string,
    setEditing: PropTypes.func.isRequired,
    setHovered: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
};
