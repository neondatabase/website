// Server wrapper for the interactive AI Gateway model catalog. Reads the
// committed /models.json data (the catalog we publish and own) and
// derives table rows, and hands trimmed data to the client component — so the
// raw catalog JSON never has to be authored by hand in the page.
//
// The llms .md mirror renders the same rows as static grouped tables (see the
// AiGatewayModelIndex handler in src/scripts/process-md-for-llms.js), so the web
// table and the agent-facing markdown can never disagree.
import PropTypes from 'prop-types';

import capabilities from '../../../../app/models/capabilities.json';
import modelsData from '../../../../app/models.json/data.json';

import ModelIndexClient from './model-index-client';
import * as modelRows from './model-rows';

const AiGatewayModelIndex = ({ variant = 'docs' }) => {
  const provider = modelsData.neon;
  const rows = modelRows.buildRows(provider, capabilities);

  return <ModelIndexClient rows={rows} variant={variant} />;
};

AiGatewayModelIndex.propTypes = {
  variant: PropTypes.oneOf(['docs', 'landing']),
};

export default AiGatewayModelIndex;
