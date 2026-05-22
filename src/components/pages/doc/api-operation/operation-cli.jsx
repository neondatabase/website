'use client';

import PropTypes from 'prop-types';
import { useState, useCallback, useMemo } from 'react';

import MultiCmdSection from './operation-cli-multi';
import {
  SectionHeader,
  CliFlagRow,
  CliPositionalRow,
  GlobalFlagsCollapsible,
  GLOBAL_FLAG_NAMES,
  sortCliFlags,
  UncoveredList,
} from './operation-shared';
import { isCrossPageGlobal, useShallow, useStore } from './store';

// CLI section — handles both single-command and multi-command operations.
// Multi-command ops (e.g. updateProjectBranch → `rename` + `set-expiration`)
// have their own renderer in operation-cli-multi.jsx; single-command ops
// render via SingleCmdSection below and the orchestrator's top-level
// live code block.

// ── Pure helper ─────────────────────────────────────────────────────────────

// Depth-first search for a named field in nested requestBody properties.
// Used by the "No CLI equivalent" list to surface field types and descriptions
// from the request body schema.
export function findBodyProp(properties, name) {
  if (!properties) return null;
  for (const [key, val] of Object.entries(properties)) {
    if (key === name) return val;
    const found = findBodyProp(val?.properties, name);
    if (found) return found;
  }
  return null;
}

// ── State hook ──────────────────────────────────────────────────────────────

// Build the set of CLI flag/positional names that route through the global
// Cross-page globals for this operation. A name is global when:
//   - it's a flag with `globalEquiv` set by the generator, OR
//   - it's a positional whose `apiEquiv` is in CROSS_PAGE_PARAMS
// Non-global names land in the per-op cli store.
function buildGlobalNameMap(operation) {
  const map = new Map();
  for (const cmd of cliCommandsOf(operation)) {
    for (const f of cmd.flags ?? []) {
      if (f.globalEquiv) map.set(f.name, f.globalEquiv);
    }
    for (const p of cmd.positionals ?? []) {
      if (p.apiEquiv && isCrossPageGlobal(p.apiEquiv)) {
        map.set(p.apiEquiv, p.apiEquiv);
      }
    }
  }
  return map;
}

// Flatten single-cmd + multi-cmd shapes into one iterable.
function cliCommandsOf(operation) {
  if (!operation?.cli) return [];
  if (Array.isArray(operation.cli.commands)) return operation.cli.commands;
  return [operation.cli];
}

// useCliState(operation)
//
// Reads globals from store.globals (for flags with `globalEquiv` set by
// the generator and for positionals whose `apiEquiv` is in
// CROSS_PAGE_PARAMS). Per-op non-global flags (e.g. --cursor on
// list-projects) live in store.perOp under the `${opId}:${name}` key,
// so they survive reload but don't leak across operations.
export function useCliState(operation) {
  const opId = operation.operationId;
  const globalNames = useMemo(() => buildGlobalNameMap(operation), [operation]);

  // edits = unified view: per-op non-global flags for this op +
  // globalEquiv-mapped flag values from store.globals. Build it via
  // useShallow so the selector returns a stable identity unless an
  // actual value changed.
  const edits = useStore(
    useShallow((s) => {
      const out = {};
      for (const [k, v] of Object.entries(s.perOp)) {
        if (v === undefined) continue;
        const idx = k.indexOf(':');
        if (idx === -1 || k.slice(0, idx) !== opId) continue;
        out[k.slice(idx + 1)] = v;
      }
      for (const [flagName, globalKey] of globalNames) {
        const v = s.globals[globalKey];
        if (v !== undefined) out[flagName] = v;
      }
      return out;
    })
  );

  const [editingFlag, setEditingFlag] = useState(null);
  const [hoveredFlag, setHoveredFlag] = useState(null);
  const [globalFlagsOpen, setGlobalFlagsOpen] = useState(false);

  // localCount = per-op edits only. Mirrors useBodyState.localEditCount;
  // used by the orchestrator's live-block badge to dedup globals.
  // Computed from store.perOp via useStore selector (NOT from `edits`
  // above, which already mixes globals in).
  const localCount = useStore((s) => {
    let n = 0;
    for (const [k, v] of Object.entries(s.perOp)) {
      if (v === undefined) continue;
      if (k.indexOf(':') === -1) continue;
      if (k.slice(0, k.indexOf(':')) === opId) n++;
    }
    return n;
  });
  const globalCount = useStore((s) => {
    let n = 0;
    for (const g of globalNames.values()) {
      if (s.globals[g] !== undefined) n++;
    }
    return n;
  });
  const editCount = localCount + globalCount;

  const isFlagIncluded = (name) => edits[name] !== undefined;

  const getFlagVal = (flag) => {
    if (flag.globalEquiv !== undefined && edits[flag.name] !== undefined) {
      return edits[flag.name];
    }
    if (edits[flag.name] !== undefined) return edits[flag.name];
    return flag.placeholder ?? String(flag.default ?? '');
  };

  // Display value for a CLI editor cell keyed by name (positional key or
  // flag name). Used by positional rows where no placeholder fallback is
  // wanted.
  const getValueByName = (name) => edits[name] ?? '';

  // Capture stable action refs once.
  const { setGlobal, setPerOp, resetGlobals, resetPerOp } = useStore.getState();

  const onEdit = useCallback(
    (name, val) => {
      const g = globalNames.get(name);
      if (g) setGlobal(g, val);
      else setPerOp(opId, name, val);
    },
    [opId, globalNames, setGlobal, setPerOp]
  );

  const onToggle = useCallback(
    (name) => {
      const g = globalNames.get(name);
      if (g) {
        const cur = useStore.getState().globals[g];
        setGlobal(g, cur === undefined ? '' : undefined);
      } else {
        const cur = useStore.getState().perOp[`${opId}:${name}`];
        setPerOp(opId, name, cur === undefined ? '' : undefined);
      }
    },
    [opId, globalNames, setGlobal, setPerOp]
  );

  // Reset clears THIS section's per-op state + globals THIS cli surfaces.
  // NOT all CROSS_PAGE_PARAMS — that's useParamsState.reset's job.
  const reset = useCallback(() => {
    resetPerOp(opId);
    if (globalNames.size > 0) resetGlobals([...globalNames.values()]);
    setEditingFlag(null);
  }, [opId, globalNames, resetPerOp, resetGlobals]);

  return {
    edits,
    // `included` derived from edits — used by buildCliCommand in the
    // orchestrator and multi-command CLI sections.
    included: useMemo(() => new Set(Object.keys(edits)), [edits]),
    editingFlag,
    hoveredFlag,
    globalFlagsOpen,
    editCount,
    localEditCount: localCount,
    isFlagIncluded,
    getFlagVal,
    getValueByName,
    setEditingFlag,
    setHoveredFlag,
    setGlobalFlagsOpen,
    onEdit,
    onToggle,
    reset,
  };
}

// ── Section component ───────────────────────────────────────────────────────

// Renders below the orchestrator's live code block. For single-command ops,
// shows positionals + flags + uncovered + global-flags-collapsible. For
// multi-command ops, shows an independent LiveCodeBlock + flags per command.
export const CliSection = ({ operation, state, paramValues, copy, copiedId }) => {
  const isMultiCmd = Array.isArray(operation.cli?.commands);

  if (isMultiCmd) {
    return (
      <MultiCmdSection
        operation={operation}
        state={state}
        paramValues={paramValues}
        copy={copy}
        copiedId={copiedId}
      />
    );
  }

  return <SingleCmdSection operation={operation} state={state} />;
};

CliSection.propTypes = {
  operation: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  paramValues: PropTypes.object.isRequired,
  copy: PropTypes.func.isRequired,
  copiedId: PropTypes.string,
};

// ── Single-command renderer ─────────────────────────────────────────────────

const SingleCmdSection = ({ operation, state }) => {
  const cliFlagsAll = operation.cli?.flags ?? [];
  const cliPositionals = operation.cli?.positionals ?? [];
  const cliUncovered = operation.cli?.uncovered ?? [];

  const cmdFlags = sortCliFlags(cliFlagsAll.filter((f) => !GLOBAL_FLAG_NAMES.has(f.name)));
  const globalFlags = cliFlagsAll.filter((f) => GLOBAL_FLAG_NAMES.has(f.name));

  return (
    <div className="mt-9">
      <SectionHeader
        title="Flags"
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
        Click values to edit · ☑ to include in command
      </p>
      <div>
        {cliPositionals.map((pos, i) => {
          const key = pos.apiEquiv ?? pos.display;
          const matchedParam = operation.parameters?.find((p) => p.name === pos.apiEquiv);
          const paramDesc = matchedParam?.description ?? '';
          const paramDescHtml = matchedParam?.descriptionHtml ?? '';
          return (
            <CliPositionalRow
              key={pos.display}
              pos={pos}
              currentVal={state.getValueByName(key)}
              isEditing={state.editingFlag === key}
              onEdit={(val) => state.onEdit(key, val)}
              onSetEditing={state.setEditingFlag}
              isLast={
                i === cliPositionals.length - 1 && cmdFlags.length === 0 && globalFlags.length === 0
              }
              description={paramDesc}
              descriptionHtml={paramDescHtml}
            />
          );
        })}
        {cmdFlags.map((flag, i) => (
          <CliFlagRow
            key={flag.name}
            flag={flag}
            isLast={i === cmdFlags.length - 1 && globalFlags.length === 0}
            isIncluded={state.isFlagIncluded(flag.name)}
            isEditing={state.editingFlag === flag.name}
            currentVal={state.getFlagVal(flag)}
            isHovered={state.hoveredFlag === flag.name}
            onSetHovered={state.setHoveredFlag}
            onToggleInclude={() => state.onToggle(flag.name)}
            onEdit={(val) => state.onEdit(flag.name, val)}
            onSetEditing={state.setEditingFlag}
            showCheckboxes={state.editCount > 0}
          />
        ))}
      </div>
      {cliUncovered.length > 0 && (
        <UncoveredList uncovered={cliUncovered} operation={operation} findBodyProp={findBodyProp} />
      )}
      {globalFlags.length > 0 && (
        <GlobalFlagsCollapsible flags={globalFlags} state={state} headerKeyPrefix="" />
      )}
    </div>
  );
};

SingleCmdSection.propTypes = {
  operation: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};
