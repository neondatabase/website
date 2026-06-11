import PropTypes from 'prop-types';

import Content from 'components/shared/content';

import { getNode, renderOptions } from './renderers';

// Generated options table for a neonctl command, e.g.
// <CliOptions command="branches create" />. Columns: Option, Description,
// Type, Default, Required. Renders the canonical no-options sentence when
// the command has no visible options. The wrapper class scopes CSS that
// keeps code chips (flags, defaults) from breaking mid-word and starving
// the Option column (see .cli-options-table in doc-content.css).
const CliOptions = ({ command }) => (
  <div className="cli-options-table">
    <Content content={renderOptions(getNode(command))} />
  </div>
);

CliOptions.propTypes = {
  command: PropTypes.string.isRequired,
};

export default CliOptions;
