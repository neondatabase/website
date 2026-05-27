'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import { AnnotatedField } from 'components/pages/doc/annotated-field';
import DepthControl from 'components/pages/doc/depth-control';
import { cn } from 'utils/cn';

import { SectionHeader, JsonHighlightValue } from './operation-shared';

// Response section — handles API/SDK Schema vs Example tabs, plus the CLI
// table-output block and the MCP "same as REST" hint.

export function useRespState() {
  const [view, setView] = useState('schema');
  const [groups, setGroups] = useState({});
  const [depth, setDepth] = useState(0);

  const isOpen = useCallback(
    (path) => {
      if (groups[path] !== undefined) return groups[path];
      const parts = path.split('.');
      const d = parts.length - 1;
      return d < depth;
    },
    [groups, depth]
  );

  const toggleOpen = useCallback(
    (path) => {
      setGroups((p) => ({ ...p, [path]: !isOpen(path) }));
    },
    [isOpen]
  );

  const setDepthAndClear = useCallback((d) => {
    setDepth(d);
    setGroups({});
  }, []);

  return {
    view,
    depth,
    setView,
    isOpen,
    toggleOpen,
    setDepth: setDepthAndClear,
  };
}

// ── Section component ───────────────────────────────────────────────────────

export const ResponseSection = ({ operation, respTree, current, state, copy, copiedId }) => (
  <div className="mt-9">
    <SectionHeader
      title={current === 'cli' ? 'Output' : 'Response'}
      badge={
        (current === 'api' || current === 'sdk') && operation.response?.status
          ? String(operation.response.status)
          : undefined
      }
    />

    {/* MCP response hints — plain paragraph, no tabs */}
    {current === 'mcp' && (
      <p className="text-[13px] leading-relaxed text-gray-new-30 dark:text-gray-new-70">
        The MCP client receives the same JSON structure as the REST API response.
      </p>
    )}

    {/* CLI output — table block or placeholder + note */}
    {current === 'cli' && (
      <>
        {operation.cli?.tableOutput ? (
          <div className="overflow-hidden rounded-xl border border-gray-new-90 dark:border-gray-new-20">
            <div className="border-b border-gray-new-90 bg-gray-new-98 px-3.5 py-2 dark:border-gray-new-20 dark:bg-gray-new-10">
              <span className="text-[12px] text-gray-new-50 dark:text-gray-new-60">
                table (default)
              </span>
            </div>
            <pre className="overflow-x-auto bg-gray-new-98 p-4 font-mono text-[12px] leading-relaxed whitespace-pre text-gray-new-30 dark:bg-gray-new-10 dark:text-gray-new-70">
              {operation.cli.tableOutput}
            </pre>
          </div>
        ) : (
          <p className="text-[13px] text-gray-new-50 dark:text-gray-new-60">
            Run{' '}
            <code className="rounded bg-gray-new-95 px-1.5 py-0.5 font-mono text-[12px] dark:bg-gray-new-15">
              neon --help
            </code>{' '}
            to see output format.
          </p>
        )}
        <p className="mt-3 text-[13px] leading-relaxed text-gray-new-50 dark:text-gray-new-60">
          For the full response, use{' '}
          <code className="rounded bg-gray-new-95 px-1.5 py-0.5 font-mono text-[12px] dark:bg-gray-new-15">
            --output json
          </code>
          . The JSON output matches the REST API response.
        </p>
      </>
    )}

    {/* API/SDK response — Schema/Example tabs */}
    {(current === 'api' || current === 'sdk') && (
      <>
        {operation.response?.descriptionHtml && (
          <div
            className="mb-4 text-[13px] leading-relaxed text-gray-new-30 dark:text-gray-new-70 [&_code]:rounded [&_code]:bg-gray-new-95 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:dark:bg-gray-new-15 [&_p+p]:mt-3"
            dangerouslySetInnerHTML={{ __html: operation.response.descriptionHtml }}
          />
        )}
        {respTree.length === 0 && operation.response?.example == null ? (
          <p className="text-[13px] text-gray-new-50 dark:text-gray-new-60">
            No example available.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-new-90 dark:border-gray-new-20">
            {/* Header bar: tabs left, controls right */}
            <div className="flex items-stretch justify-between border-b border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-10">
              <div className="flex">
                {['schema', ...(operation.response?.example != null ? ['example'] : [])].map(
                  (v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => state.setView(v)}
                      className={cn(
                        'px-4 py-2 text-[11px] font-medium capitalize transition-colors',
                        state.view === v
                          ? 'border-b-2 border-b-[#00B87B] bg-[rgba(0,229,153,0.04)] text-[#00B87B] dark:bg-[rgba(0,229,153,0.05)] dark:text-green-45'
                          : 'border-b-2 border-b-transparent text-gray-new-50 hover:bg-gray-new-95 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:bg-gray-new-15'
                      )}
                    >
                      {v}
                    </button>
                  )
                )}
              </div>
              <div className="flex items-center gap-2.5 px-3.5">
                {state.view === 'schema' && (
                  <>
                    <DepthControl value={state.depth} onChange={state.setDepth} />
                    <span className="h-4 w-px bg-gray-new-90 dark:bg-gray-new-20" />
                  </>
                )}
                {operation.response?.example != null && (
                  <button
                    type="button"
                    onClick={() =>
                      copy('resp', JSON.stringify(operation.response.example, null, 2))
                    }
                    className={cn(
                      'rounded border px-2 py-0.5 font-mono text-[11px] transition-all',
                      copiedId === 'resp'
                        ? 'border-green-45/40 text-[#00B87B] dark:border-green-45/40 dark:text-green-45'
                        : 'border-gray-new-90 text-gray-new-50 hover:border-gray-new-60 dark:border-gray-new-20 dark:text-gray-new-60'
                    )}
                  >
                    {copiedId === 'resp' ? '✓ Copied' : 'Copy JSON'}
                  </button>
                )}
              </div>
            </div>

            {/* Schema tab */}
            {state.view === 'schema' && (
              <div className="py-1.5">
                {respTree.length > 0 ? (
                  respTree.map((node) => (
                    <AnnotatedField
                      key={node.key}
                      node={node}
                      indent={0}
                      parentPath=""
                      isOpen={state.isOpen}
                      onToggle={state.toggleOpen}
                    />
                  ))
                ) : (
                  <p className="px-4 py-3 text-[13px] text-gray-new-50 dark:text-gray-new-60">
                    No schema available.
                  </p>
                )}
              </div>
            )}

            {/* Example tab — only rendered when example exists */}
            {state.view === 'example' && operation.response?.example != null && (
              <pre className="max-h-[600px] overflow-auto bg-gray-new-98 p-4 font-mono text-[11px] leading-relaxed dark:bg-gray-new-10">
                <JsonHighlightValue value={operation.response.example} indent={0} />
              </pre>
            )}
          </div>
        )}
      </>
    )}
  </div>
);

ResponseSection.propTypes = {
  operation: PropTypes.object.isRequired,
  respTree: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  state: PropTypes.shape({
    view: PropTypes.string.isRequired,
    depth: PropTypes.number.isRequired,
    setView: PropTypes.func.isRequired,
    isOpen: PropTypes.func.isRequired,
    toggleOpen: PropTypes.func.isRequired,
    setDepth: PropTypes.func.isRequired,
  }).isRequired,
  copy: PropTypes.func.isRequired,
  copiedId: PropTypes.string,
};
