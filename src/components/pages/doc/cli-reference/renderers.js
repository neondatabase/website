// Single import seam between the docs components and the neonctl doc
// generator. schema.json is imported statically (build-time JSON, never
// generate-docs' loadSchema(), whose fs/__dirname read breaks under
// webpack). The same renderer functions also feed the llms .md mirror in
// src/scripts/process-md-for-llms.js, so the HTML page and the
// agent-facing markdown can never disagree.
import generateDocs from '../../../../../scripts/docs-checks/neonctl/generate-docs';
import schema from '../../../../../scripts/docs-checks/neonctl/schema.json';

const {
  renderOptions,
  renderOptionsForPath,
  renderUsage,
  renderSubcommands,
  renderGlobalOptions,
  resolveCommand,
} = generateDocs;

// Resolves a space-separated command path ("branches create") to its schema
// node. Throws at build time so a typo in a doc page fails the build loudly
// instead of rendering an empty section.
const getNode = (command) => {
  const parts = command.trim().split(/\s+/);
  const node = resolveCommand(schema, parts);
  if (!node) {
    throw new Error(
      `Unknown neonctl command "${command}" — check the command prop against scripts/docs-checks/neonctl/schema.json`
    );
  }
  return node;
};

export {
  schema,
  getNode,
  renderOptions,
  renderOptionsForPath,
  renderUsage,
  renderSubcommands,
  renderGlobalOptions,
};
