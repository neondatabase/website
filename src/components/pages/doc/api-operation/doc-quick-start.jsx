'use client';

import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';

import { buildCliCommand } from 'utils/api-ref.mjs';
import { cn } from 'utils/cn';

import ApiCodeBlock from './api-code-block';

const LABELS = {
  cli: 'CLI',
  sdk: 'SDK',
  mcp: 'MCP',
  console: 'Console',
};

function seedToCliEdits(seed, flags) {
  const edits = {};
  const included = new Set();
  if (!seed || !flags?.length) return { edits, included };

  const byName = new Map(flags.map((flag) => [flag.name, flag]));
  for (const [path, value] of Object.entries(seed)) {
    const leaf = path.slice(path.lastIndexOf('.') + 1);
    const flagName = leaf.replaceAll('_', '-');
    if (!byName.has(flagName)) continue;
    edits[flagName] = String(value);
    included.add(flagName);
  }
  return { edits, included };
}

function buildCliSnippet(operation) {
  const cli = operation.cli;
  const commands = cli?.commands?.length
    ? cli.commands
    : cli?.command
      ? [{ command: cli.command, flags: cli.flags ?? [], positionals: cli.positionals ?? [] }]
      : [];
  if (commands.length === 0) return null;

  const snippets = commands.map(({ command, flags = [], positionals = [] }) => {
    const { edits, included } = seedToCliEdits(operation.requestBody?.seed, flags);
    return buildCliCommand(command, positionals, flags, edits, included, {});
  });

  if (snippets.length === 1) return snippets[0];
  return snippets
    .map((snippet, index) => {
      const label = commands[index].command?.split(/\s+/).pop()?.replaceAll('-', ' ');
      return `# ${label || `Command ${index + 1}`}\n${snippet}`;
    })
    .join('\n\n');
}

function seedValueForArgument(seed, name) {
  if (!seed) return undefined;
  for (const [path, value] of Object.entries(seed)) {
    if (path.slice(path.lastIndexOf('.') + 1) === name) return value;
  }
  return undefined;
}

function buildMcpSnippet(operation) {
  const mcp = operation.mcp;
  if (!mcp?.tool) return null;
  const input = {};
  for (const arg of mcp.arguments ?? []) {
    const seedValue = seedValueForArgument(operation.requestBody?.seed, arg.name);
    if (seedValue !== undefined) input[arg.name] = seedValue;
    else if (arg.default !== undefined) input[arg.name] = arg.default;
    else if (arg.required) input[arg.name] = `$${arg.name.toUpperCase()}`;
  }
  return JSON.stringify({ tool: mcp.tool, input }, null, 2);
}

function availableExamples(operation) {
  const examples = [];
  const cliCode = buildCliSnippet(operation);
  if (cliCode) {
    examples.push({ id: 'cli', label: 'CLI', descriptor: null, code: cliCode, copyPrefix: '' });
  }
  const sdkCode = operation.examples?.representative?.typescript ?? operation.examples?.typescript;
  if (sdkCode) examples.push({ id: 'sdk', label: 'SDK', descriptor: null, code: sdkCode });
  const mcpCode = buildMcpSnippet(operation);
  if (mcpCode) {
    examples.push({
      id: 'mcp',
      label: 'MCP',
      descriptor: null,
      code: mcpCode,
    });
  }
  if (operation.console?.breadcrumb) {
    examples.push({
      id: 'console',
      label: 'Console',
      descriptor: null,
      code: operation.console.breadcrumb,
    });
  }
  return examples;
}

const DocQuickStart = ({ operation, requiredLeafCount = null }) => {
  const examples = useMemo(() => availableExamples(operation), [operation]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (examples.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && !examples.some((example) => example.id === selectedId)) {
      setSelectedId(null);
    }
  }, [examples, selectedId]);

  const restCode = operation.examples?.representative?.curl ?? operation.examples?.curl ?? '';
  const selected = examples.find((example) => example.id === selectedId) ?? null;
  const noRequired =
    requiredLeafCount === null
      ? (operation.requestBody?.requiredFields ?? []).length === 0
      : requiredLeafCount === 0;
  const emptyBodyAllowed = noRequired && !operation.requestBody?.required;

  return (
    <section className="mt-8">
      <h2 id="quick-start" className="sr-only scroll-mt-20">
        Quick start
      </h2>

      <ApiCodeBlock label="REST API" descriptor="curl" code={restCode} />

      {operation.examples?.representative && (
        <p className="mt-3 text-sm leading-relaxed text-gray-new-50 dark:text-gray-new-60">
          A representative request with common fields prefilled.
          {emptyBodyAllowed ? ' An empty body works too; every field below is optional.' : ''}
        </p>
      )}

      {examples.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-gray-new-50 dark:text-gray-new-60">
              Also available in
            </span>
            {examples.map((example) => {
              const selectedPill = selected?.id === example.id;
              return (
                <button
                  key={example.id}
                  type="button"
                  onClick={() =>
                    setSelectedId((currentId) => (currentId === example.id ? null : example.id))
                  }
                  aria-pressed={selectedPill}
                  aria-label={
                    example.descriptor ? `${example.label} ${example.descriptor}` : example.label
                  }
                  className={cn(
                    'flex items-center gap-1 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors',
                    selectedPill
                      ? 'border-[#00B87B]/30 bg-[#00B87B]/10 text-[#00B87B] dark:text-white'
                      : 'border-gray-new-90 text-gray-new-40 hover:border-gray-new-70 dark:border-gray-new-20 dark:text-gray-new-70'
                  )}
                >
                  <span>{LABELS[example.id] ?? example.label}</span>
                  {example.descriptor && (
                    <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
                      {example.descriptor}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selected && (
            <ApiCodeBlock
              label={selected.label}
              descriptor={selected.descriptor}
              code={selected.code}
            />
          )}
        </div>
      )}
    </section>
  );
};

DocQuickStart.propTypes = {
  operation: PropTypes.shape({
    operationId: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    requestBody: PropTypes.shape({
      required: PropTypes.bool,
      requiredFields: PropTypes.arrayOf(PropTypes.string),
      seed: PropTypes.object,
    }),
    examples: PropTypes.shape({
      curl: PropTypes.string,
      typescript: PropTypes.string,
      representative: PropTypes.shape({
        curl: PropTypes.string,
        typescript: PropTypes.string,
      }),
    }),
    cli: PropTypes.oneOfType([
      PropTypes.shape({
        command: PropTypes.string,
        flags: PropTypes.array,
        positionals: PropTypes.array,
      }),
      PropTypes.shape({
        commands: PropTypes.array,
      }),
    ]),
    mcp: PropTypes.shape({
      tool: PropTypes.string,
      arguments: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          required: PropTypes.bool,
          default: PropTypes.any,
        })
      ),
    }),
    console: PropTypes.shape({ breadcrumb: PropTypes.string }),
  }).isRequired,
  requiredLeafCount: PropTypes.number,
};

export default DocQuickStart;
