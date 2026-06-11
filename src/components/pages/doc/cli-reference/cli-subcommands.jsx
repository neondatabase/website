import PropTypes from 'prop-types';

import Content from 'components/shared/content';

import { getNode, renderSubcommands } from './renderers';

// Generated subcommand index table, e.g. <CliSubcommands command="projects" />.
// On nested pages pass anchorParts so links target the page's prefixed
// anchors: <CliSubcommands command="neon-auth oauth-provider" anchorParts="oauth-provider" />
// links to #oauth-provider-add instead of a colliding #add.
const CliSubcommands = ({ command, anchorParts = '' }) => (
  <Content
    content={renderSubcommands(getNode(command), anchorParts.trim().split(/\s+/).filter(Boolean))}
  />
);

CliSubcommands.propTypes = {
  command: PropTypes.string.isRequired,
  anchorParts: PropTypes.string,
};

export default CliSubcommands;
