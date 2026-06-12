import PropTypes from 'prop-types';

import Content from 'components/shared/content';

import { getNode, renderUsage } from './renderers';

// Generated synopsis code block for a neonctl command, e.g.
// <CliUsage command="branches create" />. Never emits headings — the
// right-rail ToC only sees markdown headings in the page source.
const CliUsage = ({ command }) => (
  <Content content={renderUsage(getNode(command), command.trim().split(/\s+/))} />
);

CliUsage.propTypes = {
  command: PropTypes.string.isRequired,
};

export default CliUsage;
