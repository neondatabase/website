import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import Link from 'next/link';

import { DOCS_BASE_PATH } from 'constants/docs';
import { loadAllTagGroups } from 'utils/api-ref-server';

const CLI_COVERAGE = resolve(process.cwd(), 'scripts/data/cli-coverage.json');

const BASE_ORDER = [
  'neon projects',
  'neon branches',
  'neon databases',
  'neon roles',
  'neon endpoints',
  'neon operations',
  'neon orgs',
  'neon vpc',
  'neon connection-string',
  'neon me',
];

// Strip positionals (<...>, [...]) and flags (--...) from a command string
function stripExtras(cmd) {
  return cmd
    .split(' ')
    .filter((w) => !w.startsWith('<') && !w.startsWith('[') && !w.startsWith('--'))
    .join(' ');
}

function buildGroups() {
  if (!existsSync(CLI_COVERAGE)) return [];

  const coverage = JSON.parse(readFileSync(CLI_COVERAGE, 'utf8'));
  const tagGroups = loadAllTagGroups();

  const opMap = {};
  for (const group of tagGroups) {
    for (const op of group.operations) {
      opMap[op.operationId] = { tag: op.tag, id: op.id };
    }
  }

  // base command ("neon branches") → Map of subcommand text → href
  const groupMap = new Map();

  for (const [operationId, entry] of Object.entries(coverage)) {
    const op = opMap[operationId];
    if (!op) continue;

    const href = `${DOCS_BASE_PATH}reference/api/${op.tag}/${op.id}?iface=cli`;
    const cmds = typeof entry === 'string' ? [entry] : (entry.commands ?? []).map((c) => c.cmd);

    for (const cmd of cmds) {
      const words = stripExtras(cmd).split(' ');
      const base = words.slice(0, 2).join(' ');
      const sub = words.slice(2).join(' ') || null;

      if (!groupMap.has(base)) groupMap.set(base, new Map());
      const subMap = groupMap.get(base);
      // First occurrence wins for duplicate subcommands
      if (sub && !subMap.has(sub)) subMap.set(sub, href);
      else if (!sub && !subMap.has('')) subMap.set('', href);
    }
  }

  const groups = [...groupMap.entries()].map(([base, subMap]) => ({
    base,
    subcommands: [...subMap.entries()].map(([sub, href]) => ({ sub, href })),
  }));

  groups.sort((a, b) => {
    const ai = BASE_ORDER.indexOf(a.base);
    const bi = BASE_ORDER.indexOf(b.base);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return groups;
}

const CliCommandTable = () => {
  const groups = buildGroups();
  if (!groups.length) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>Command</th>
          <th>Subcommands</th>
        </tr>
      </thead>
      <tbody>
        {groups.map(({ base, subcommands }) => (
          <tr key={base}>
            <td>
              <code>{base}</code>
            </td>
            <td>
              {subcommands.length === 1 && !subcommands[0].sub ? (
                <Link href={subcommands[0].href} className="font-mono">
                  {base.split(' ').slice(1).join(' ')}
                </Link>
              ) : (
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  {subcommands.map(({ sub, href }) => (
                    <Link key={sub} href={href} className="font-mono">
                      {sub}
                    </Link>
                  ))}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CliCommandTable;
