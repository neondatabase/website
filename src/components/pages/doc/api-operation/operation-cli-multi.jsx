'use client';

import PropTypes from 'prop-types';

import { buildCliCommand } from 'utils/api-ref.mjs';

import { findBodyProp } from './operation-cli';
import {
  CliFlagRow,
  CliPositionalRow,
  GlobalFlagsCollapsible,
  GLOBAL_FLAG_NAMES,
  LiveCodeBlock,
  SectionHeader,
  UncoveredList,
  sortCliFlags,
} from './operation-shared';

// Multi-command CLI renderer — used when the spec maps an API operation
// to multiple neonctl subcommands (e.g. updateProjectBranch -> `branches
// rename` + `branches set-expiration`). Each command gets its own
// LiveCodeBlock + flag/positional list with editing keys namespaced per
// command index so opening one row doesn't leak focus into the others.
const MultiCmdSection = ({ operation, state, paramValues, copy, copiedId }) => {
  const cliCommands = operation.cli.commands;
  const cliUncovered = operation.cli?.uncovered ?? [];
  const multiCmdGlobalFlags = (cliCommands[0]?.flags ?? []).filter((f) =>
    GLOBAL_FLAG_NAMES.has(f.name)
  );

  return (
    <div className="mt-9">
      <SectionHeader
        title="CLI commands"
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
      <p className="mb-1 text-[13px] text-gray-new-50 dark:text-gray-new-60">
        This operation maps to separate CLI commands depending on what you want to update.
      </p>
      <p className="mb-4 text-[11px] text-gray-new-60 italic dark:text-gray-new-50">
        Click values to edit · ☑ to include in command
      </p>
      {cliCommands.map((cmd, cmdIdx) => {
        const cmdSpecificFlags = sortCliFlags(
          (cmd.flags ?? []).filter((f) => !GLOBAL_FLAG_NAMES.has(f.name))
        );
        const cmdCode = buildCliCommand(
          cmd.command,
          cmd.positionals ?? [],
          cmd.flags ?? [],
          state.edits,
          state.included,
          paramValues
        );
        // Namespace editing key per command so shared flags (e.g. project-id)
        // don't simultaneously enter edit mode in both command sections.
        const cmdEditKey = (name) => (name ? `${cmdIdx}:${name}` : null);
        const onCmdSetEditing = (name) => state.setEditingFlag(cmdEditKey(name));

        return (
          <div
            key={cmdIdx}
            className={
              cmdIdx > 0
                ? 'mt-6 border-t border-gray-new-90 pt-6 dark:border-gray-new-20'
                : undefined
            }
          >
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-[11px] text-gray-new-50 dark:text-gray-new-60">Covers</span>
              {cmd.covers.map((c) => (
                <code
                  key={c}
                  className="rounded bg-gray-new-94 px-1.5 py-0.5 font-mono text-[11px] text-gray-new-20 dark:bg-gray-new-15 dark:text-gray-new-80"
                >
                  {c}
                </code>
              ))}
            </div>
            <LiveCodeBlock
              label="Terminal"
              code={`$ ${cmdCode}`}
              editCount={state.editCount}
              onCopy={() => copy(`cli-${cmdIdx}`, cmdCode)}
              copied={copiedId === `cli-${cmdIdx}`}
            />
            <div className="mt-2">
              {(cmd.positionals ?? []).map((pos, i) => {
                const key = pos.apiEquiv ?? pos.display;
                const matchedParam = operation.parameters?.find((p) => p.name === pos.apiEquiv);
                const paramDesc = matchedParam?.description ?? '';
                const paramDescHtml = matchedParam?.descriptionHtml ?? '';
                return (
                  <CliPositionalRow
                    key={pos.display}
                    pos={pos}
                    currentVal={state.getValueByName(key)}
                    isEditing={state.editingFlag === cmdEditKey(key)}
                    onEdit={(val) => state.onEdit(key, val)}
                    onSetEditing={onCmdSetEditing}
                    isLast={
                      i === (cmd.positionals?.length ?? 0) - 1 && cmdSpecificFlags.length === 0
                    }
                    description={paramDesc}
                    descriptionHtml={paramDescHtml}
                  />
                );
              })}
              {cmdSpecificFlags.map((flag, i) => (
                <CliFlagRow
                  key={flag.name}
                  flag={flag}
                  isLast={i === cmdSpecificFlags.length - 1}
                  isIncluded={state.isFlagIncluded(flag.name)}
                  isEditing={state.editingFlag === cmdEditKey(flag.name)}
                  currentVal={state.getFlagVal(flag)}
                  isHovered={state.hoveredFlag === flag.name}
                  onSetHovered={state.setHoveredFlag}
                  onToggleInclude={() => state.onToggle(flag.name)}
                  onEdit={(val) => state.onEdit(flag.name, val)}
                  onSetEditing={onCmdSetEditing}
                  showCheckboxes={state.editCount > 0}
                />
              ))}
            </div>
          </div>
        );
      })}
      {cliUncovered.length > 0 && (
        <UncoveredList uncovered={cliUncovered} operation={operation} findBodyProp={findBodyProp} />
      )}
      {multiCmdGlobalFlags.length > 0 && (
        <GlobalFlagsCollapsible flags={multiCmdGlobalFlags} state={state} headerKeyPrefix="g:" />
      )}
    </div>
  );
};

MultiCmdSection.propTypes = {
  operation: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  paramValues: PropTypes.object.isRequired,
  copy: PropTypes.func.isRequired,
  copiedId: PropTypes.string,
};

export default MultiCmdSection;
