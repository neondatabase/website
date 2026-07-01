// Server wrapper for the interactive CLI command index on the overview
// page. Reads the committed neonctl schema at build time, joins it with the
// editorial group map and curated copy (meta.js), and passes trimmed rows
// to the client component so schema.json never enters the client bundle.
// The llms .md mirror renders the static command tree instead (see
// process-md-for-llms.js).
//
// Pass `group` to render one editorial group's panel; the overview page
// uses one instance per group under a markdown heading so the right-rail
// ToC picks the groups up (it only sees markdown headings).
import PropTypes from 'prop-types';

import { schema } from '../renderers';

import CommandIndexClient from './command-index-client';
import { GROUPS, GROUP_OF, HREF_OVERRIDES } from './groups';
import META from './meta';

const BINARY = 'neon';

// CLI-authored .example() strings from the command's subtree (depth first,
// up to three) — the automatic example source. Curated meta examples
// override these only where the CLI source provides none or worse.
const schemaExamples = (cmd) => {
  const found = [];
  const walk = (node) => {
    for (const ex of node.examples || []) {
      if (found.length < 3) found.push(ex.command.replace(/\$0/g, BINARY));
    }
    for (const sub of Object.values(node.commands || {})) walk(sub);
  };
  walk(cmd);
  return found;
};

const buildRows = () => {
  const rows = [];
  for (const [name, cmd] of Object.entries(schema.commands)) {
    const groupId = GROUP_OF[name];
    if (!groupId) {
      throw new Error(
        `CLI command "${name}" has no entry in cli-command-index/groups.js — add it to a group`
      );
    }
    const meta = META[name] || {};
    const subs = Object.keys(cmd.commands || {});
    // Option chips derive from the schema so they can never go stale; only
    // descriptions and examples are curated. Shown for leaf commands;
    // commands with subcommands show subcommand chips instead.
    const opts =
      subs.length > 0
        ? []
        : Object.entries(cmd.options || {})
            .filter(([, spec]) => !spec.hidden)
            .map(([opt]) => `--${opt}`);
    const positionals = (cmd.positionals || [])
      .map((p) => {
        const token = `${p.name}${p.variadic ? '...' : ''}`;
        return p.required ? `<${token}>` : `[${token}]`;
      })
      .join(' ');
    const sig = cmd.usage
      ? cmd.usage.replace(/\$0/g, BINARY)
      : [BINARY, name, subs.length ? '<sub-command>' : positionals, '[options]']
          .filter(Boolean)
          .join(' ');
    rows.push({
      name,
      aliases: cmd.aliases || [],
      desc: meta.desc || cmd.describe || '',
      sig,
      subs,
      opts,
      // Fallback chain: curated -> CLI-authored .example() from the schema
      // -> bare signature (in the client). Curation only fills source gaps.
      examples: meta.examples || schemaExamples(cmd),
      group: groupId,
      href: HREF_OVERRIDES[name] || `/docs/cli/${name}`,
    });
  }
  return rows;
};

const CliCommandIndex = ({ group = '' }) => {
  const rows = buildRows();
  const groups = GROUPS.filter((g) => !group || g.id === group)
    .map((g) => ({ ...g, commands: rows.filter((row) => row.group === g.id) }))
    .filter((g) => g.commands.length > 0);

  return <CommandIndexClient groups={groups} />;
};

CliCommandIndex.propTypes = {
  group: PropTypes.string,
};

export default CliCommandIndex;
