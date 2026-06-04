'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useContext, useState, useCallback, useMemo } from 'react';

import ApiParam from 'components/pages/doc/api-param';
import ApiResponse from 'components/pages/doc/api-response';
import InterfaceStrip from 'components/pages/doc/interface-strip';
import { InterfaceTabsContext } from 'contexts/interface-tabs-context';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import { buildCurl, buildCliCommand, buildTs } from 'utils/api-ref.mjs';
import { cn } from 'utils/cn';

import { useBodyState, BodySection } from './operation-body';
import { useCliState, CliSection } from './operation-cli';
import { McpDescription } from './operation-mcp';
import { useParamsState, ParamsSection } from './operation-params';
import { useRespState, ResponseSection } from './operation-response';
import { SectionHeader, LiveCodeBlock } from './operation-shared';
import { isCrossPageGlobal } from './store';
import StoreHydrator from './store-hydrator';

const LABELS = { api: 'REST API', cli: 'CLI', sdk: 'SDK', mcp: 'MCP', console: 'Console' };

// Count distinct session-identity globals that currently have a
// non-empty value in paramStore for this operation. The same global may be
// surfaced by multiple sections (api param + body field + cli flag), so
// per-section editCounts double-count it when summed. This helper dedups
// by walking every surface a global can appear on and unioning the names.
// Used by the orchestrator's live-block edit-count badge.
function countActiveGlobals(operation, paramValues) {
  const globals = new Set();
  // CLI side — both single-cmd and multi-cmd shapes.
  const cliCmds = [];
  if (operation.cli?.flags || operation.cli?.positionals) cliCmds.push(operation.cli);
  if (Array.isArray(operation.cli?.commands)) cliCmds.push(...operation.cli.commands);
  for (const cmd of cliCmds) {
    for (const f of cmd.flags ?? []) if (f.globalEquiv) globals.add(f.globalEquiv);
    for (const p of cmd.positionals ?? []) {
      if (p.apiEquiv && isCrossPageGlobal(p.apiEquiv)) globals.add(p.apiEquiv);
    }
  }
  // Param side.
  for (const p of operation.parameters ?? []) {
    if (isCrossPageGlobal(p.name)) globals.add(p.name);
  }
  // Body side.
  for (const { global } of operation.bodyGlobals ?? []) globals.add(global);
  if (operation.idMeaning) globals.add(operation.idMeaning);

  let n = 0;
  for (const g of globals) if (paramValues[g] !== undefined) n++;
  return n;
}

// Re-export pure helpers that lived in this file before the module split, so
// existing imports and tests keep working without churn.
export {
  setPath,
  buildSmartJson,
  addWithAncestors,
  getLeafPaths,
  bareIdPaths,
  effectiveGlobalForLeaf,
} from './operation-body';
export { findBodyProp } from './operation-cli';
export { splitMcpContent, parseMcpDescription } from './operation-mcp';
export { isCrossPageGlobal } from './store';
export { formatParamsArg } from 'utils/api-ref.mjs';

// ── Orchestrator ────────────────────────────────────────────────────────────
//
// Owns tab routing, cross-section memos (curl/TS/CLI live code), the
// unavailable-fallback card, the MCP tool card, and the errors section.
// Section hooks adapt the Zustand store per surface (params, body, CLI, response).
// The orchestrator reads them together for cross-section memos (curl, CLI, TS),
// then passes each hook's return value back down to its section component.

const OperationClient = ({ operation, interfaces, bodyTree, respTree }) => {
  const { activeIface, setActiveIface } = useContext(InterfaceTabsContext);
  const current =
    activeIface && interfaces.some((x) => x.id === activeIface)
      ? activeIface
      : (interfaces.find((x) => x.available)?.id ?? 'api');
  const currentTab = interfaces.find((x) => x.id === current);
  const currentAvailable = currentTab?.available ?? true;
  const availableIds = interfaces.filter((x) => x.available).map((x) => x.id);

  // Section state — hooks read/write the shared store; the orchestrator
  // composes them for cross-section memos (curlCode/tsCode/cliCode).
  // Order matters: params is created before cli + body so global-ID writes
  // can route through params.onEdit/onToggle and all three sections share
  // the same paramValues source of truth.
  const params = useParamsState(operation);
  const body = useBodyState(bodyTree, operation);
  const cli = useCliState(operation);
  const resp = useRespState();

  // Multi-target copy. The orchestrator has several copy buttons (live
  // block, body JSON, response JSON, MCP tool name, per-cmd CLI blocks)
  // and shows "Copied" feedback on the one that was just clicked.
  // useCopyToClipboard is the codebase-wide hook (built on the
  // copy-to-clipboard library — works on non-HTTPS origins and older
  // browsers, unlike a raw navigator.clipboard.writeText call); we wrap
  // it to track which target most recently fired.
  const { handleCopy } = useCopyToClipboard(1800);
  const [copiedId, setCopiedId] = useState(null);
  const copy = useCallback(
    (id, text) => {
      handleCopy(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    },
    [handleCopy]
  );

  // ── Cross-section live code ──
  const curlCode = useMemo(
    () => buildCurl(operation, params.values, params.included, body.json),
    [operation, params.values, params.included, body.json]
  );
  const tsCode = useMemo(
    () => buildTs(operation, params.values, params.included, body.json),
    [operation, params.values, params.included, body.json]
  );
  // Multi-command ops have null `operation.cli.command`, so cliCode below is null
  // and the orchestrator's live block doesn't render — CliSection renders per-cmd
  // live blocks instead.
  const cliFlagsAll = useMemo(() => operation.cli?.flags ?? [], [operation.cli]);
  const cliPositionals = useMemo(() => operation.cli?.positionals ?? [], [operation.cli]);
  const cliCode = useMemo(
    () =>
      operation.cli?.command
        ? buildCliCommand(
            operation.cli.command,
            cliPositionals,
            cliFlagsAll,
            cli.edits,
            cli.included,
            params.values
          )
        : null,
    [operation.cli, cliPositionals, cliFlagsAll, cli.edits, cli.included, params.values]
  );

  const liveCode =
    current === 'api' ? curlCode : current === 'sdk' ? tsCode : current === 'cli' ? cliCode : null;
  const liveLabel =
    current === 'api'
      ? 'curl'
      : current === 'sdk'
        ? 'TypeScript'
        : current === 'cli'
          ? 'Terminal'
          : null;
  // For api/sdk, count globals exactly once (not once per section that
  // surfaces them). CLI tab keeps cli.editCount as-is because it already
  // counts globals once per cli (not across sections).
  const liveEditCount =
    current === 'cli'
      ? cli.editCount
      : body.localEditCount + params.localEditCount + countActiveGlobals(operation, params.values);

  const mcpArgDefs = operation.mcp?.arguments ?? [];

  return (
    <>
      <StoreHydrator />
      <InterfaceStrip interfaces={interfaces} />

      {/* ── Unavailable fallback card ── */}
      {!currentAvailable && (
        <div className="mt-8 rounded-xl border border-gray-new-90 bg-gray-new-98 p-6 dark:border-gray-new-20 dark:bg-gray-new-10">
          <p className="text-[13px] font-semibold text-black-pure dark:text-white">
            Not available via {LABELS[current] ?? current}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
            {current === 'mcp'
              ? "The Neon MCP server doesn't expose a tool for this operation. You can call it directly from your agent using the REST API:"
              : current === 'console'
                ? 'This operation is not available through the Neon Console UI.'
                : `This operation is not available via ${LABELS[current] ?? current}.`}
          </p>
          {current !== 'console' && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-new-90 dark:border-gray-new-20">
              <div className="border-b border-gray-new-90 bg-gray-new-94 px-3.5 py-2 text-[12px] text-gray-new-50 dark:border-gray-new-20 dark:bg-gray-new-15 dark:text-gray-new-60">
                {current === 'mcp' ? 'curl — use from agent via shell tool' : 'curl equivalent'}
              </div>
              <pre className="overflow-x-auto bg-gray-new-98 p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-gray-new-50 dark:bg-gray-new-10 dark:text-gray-new-60">
                {curlCode}
              </pre>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {availableIds
              .filter((id) => id !== current)
              .map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveIface(id)}
                  className="text-[13px] text-[#00B87B] hover:underline dark:text-green-45"
                >
                  Use {LABELS[id] ?? id} →
                </button>
              ))}
            {(current === 'cli' || current === 'mcp') && (
              <a
                href="https://github.com/neondatabase/neon/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[12px] text-gray-new-50 hover:underline dark:text-gray-new-60"
              >
                Request {LABELS[current] ?? current} support →
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Console ── */}
      {current === 'console' && operation.console?.breadcrumb && (
        <div className="mt-8 border border-gray-new-90 bg-gray-new-98 p-5 dark:border-gray-new-20 dark:bg-gray-new-10">
          <p className="text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70">
            In the Neon Console, go to{' '}
            <strong className="text-black-pure dark:text-white">
              {operation.console.breadcrumb}
            </strong>
            .
          </p>
          <a
            href="https://console.neon.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-block text-[13px] text-[#00B87B] hover:underline dark:text-green-45"
          >
            Open Neon Console →
          </a>
        </div>
      )}

      {/* ── MCP tool card ── */}
      {current === 'mcp' && operation.mcp?.tool && (
        <div className="mt-8 overflow-hidden border border-gray-new-90 dark:border-gray-new-20">
          <div className="flex items-center justify-between border-b border-gray-new-90 bg-gray-new-98 px-3.5 py-2.5 dark:border-gray-new-20 dark:bg-gray-new-10">
            <span className="text-[10px] font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-60">
              MCP Tool
            </span>
            <button
              type="button"
              onClick={() => copy('mcp-tool', operation.mcp.tool)}
              className={cn(
                'rounded border px-2 py-0.5 font-mono text-[11px] transition-all',
                copiedId === 'mcp-tool'
                  ? 'border-green-45/40 text-[#00B87B] dark:border-green-45/40 dark:text-green-45'
                  : 'border-gray-new-90 text-gray-new-50 hover:border-gray-new-60 hover:text-gray-new-30 dark:border-gray-new-20 dark:text-gray-new-60'
              )}
            >
              {copiedId === 'mcp-tool' ? '✓ Copied' : 'Copy name'}
            </button>
          </div>
          <div className="bg-gray-new-98 px-4.5 py-4 dark:bg-gray-new-10">
            <code className="font-mono text-lg font-semibold text-black-pure dark:text-white">
              {operation.mcp.tool}
            </code>
            {operation.mcp.description && (
              <McpDescription description={operation.mcp.description} />
            )}
          </div>
        </div>
      )}

      {/* ── Live code block (api/sdk/cli single-command) ── */}
      {liveCode && (
        <div className="mt-8">
          <LiveCodeBlock
            label={liveLabel}
            code={current === 'cli' ? `$ ${liveCode}` : liveCode}
            editCount={liveEditCount}
            onCopy={() => copy('code', liveCode)}
            copied={copiedId === 'code'}
          />
        </div>
      )}

      {/* ── Request body (api/sdk) ── */}
      {(current === 'api' || current === 'sdk') && (
        <BodySection
          operation={operation}
          bodyTree={bodyTree}
          state={body}
          copy={copy}
          copiedId={copiedId}
        />
      )}

      {/* ── Parameters (api/sdk) ── */}
      {(current === 'api' || current === 'sdk') && operation.parameters?.length > 0 && (
        <ParamsSection operation={operation} state={params} />
      )}

      {/* ── CLI flags / commands ── */}
      {current === 'cli' && currentAvailable && (
        <CliSection
          operation={operation}
          state={cli}
          paramValues={params.values}
          copy={copy}
          copiedId={copiedId}
        />
      )}

      {/* ── MCP arguments ── */}
      {current === 'mcp' && mcpArgDefs.length > 0 && (
        <div className="mt-9">
          <SectionHeader title="Arguments" />
          <div>
            {mcpArgDefs.map((arg) => (
              <ApiParam
                key={arg.name}
                name={arg.name}
                type={arg.type}
                required={arg.required}
                default={arg.default}
              >
                {arg.description && <p>{arg.description}</p>}
              </ApiParam>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-gray-new-50 dark:text-gray-new-60">
            Works with Cursor, Claude Desktop, Windsurf, and any MCP client.{' '}
            <Link
              href="/docs/ai/neon-mcp-server"
              className="text-[#00B87B] hover:underline dark:text-green-45"
            >
              Setup guide →
            </Link>
          </p>
        </div>
      )}

      {/* ── Response / Output ── */}
      {current !== 'console' && currentAvailable && (
        <ResponseSection
          operation={operation}
          respTree={respTree}
          current={current}
          state={resp}
          copy={copy}
          copiedId={copiedId}
        />
      )}

      {/* ── Errors ── */}
      {current === 'api' && currentAvailable && operation.errors?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-base leading-tight font-semibold tracking-tight">Errors</h2>
          <div>
            {operation.errors.map((err) => (
              <ApiResponse
                key={err.status}
                status={err.status}
                description={err.description}
                descriptionHtml={err.descriptionHtml}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

OperationClient.propTypes = {
  operation: PropTypes.shape({
    method: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    operationId: PropTypes.string.isRequired,
    requestBody: PropTypes.shape({
      required: PropTypes.bool,
      properties: PropTypes.objectOf(PropTypes.shape({})),
    }),
    response: PropTypes.shape({
      status: PropTypes.any,
      description: PropTypes.string,
      descriptionHtml: PropTypes.string,
      example: PropTypes.any,
    }),
    errors: PropTypes.arrayOf(PropTypes.shape({})),
    parameters: PropTypes.arrayOf(PropTypes.shape({})),
    cli: PropTypes.oneOfType([
      PropTypes.shape({
        command: PropTypes.string,
        flags: PropTypes.array,
        positionals: PropTypes.array,
        tableOutput: PropTypes.string,
      }),
      PropTypes.shape({
        commands: PropTypes.arrayOf(
          PropTypes.shape({
            command: PropTypes.string,
            covers: PropTypes.arrayOf(PropTypes.string),
            flags: PropTypes.array,
            positionals: PropTypes.array,
          })
        ),
        uncovered: PropTypes.arrayOf(PropTypes.string),
        tableOutput: PropTypes.string,
      }),
    ]),
    mcp: PropTypes.shape({
      tool: PropTypes.string,
      description: PropTypes.string,
      arguments: PropTypes.array,
    }),
    console: PropTypes.shape({ breadcrumb: PropTypes.string }),
  }).isRequired,
  interfaces: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, code: PropTypes.string, available: PropTypes.bool })
  ).isRequired,
  bodyTree: PropTypes.array.isRequired,
  respTree: PropTypes.array.isRequired,
};

export default OperationClient;
