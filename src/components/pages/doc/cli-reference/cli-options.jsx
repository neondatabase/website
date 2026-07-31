import PropTypes from 'prop-types';

import Content from 'components/shared/content';

import { getNode, renderOptionsForPath, schema } from './renderers';

// Generated options table for a neonctl command, e.g.
// <CliOptions command="branches create" />. Columns: Option, Description,
// Type, Default, Required. Includes options inherited from parent commands
// (what the command actually accepts); renders nothing when only the
// global options apply. The wrapper class scopes CSS that keeps code chips
// (flags, defaults) from breaking mid-word and starving the Option column
// (see .cli-options-table in doc-content.css).
const CliOptions = ({ command }) => {
  getNode(command); // throw on unknown commands at build time
  const table = renderOptionsForPath(schema, command.trim().split(/\s+/));
  if (!table) return null;
  return (
    <div className="cli-options-table">
      <Content content={table} />
    </div>
  );
};

CliOptions.propTypes = {
  command: PropTypes.string.isRequired,
};

export default CliOptions;
