'use client';

import PropTypes from 'prop-types';
import { useContext } from 'react';

import { InterfaceTabsContext } from 'contexts/interface-tabs-context';

const INTERFACES = ['api', 'sdk', 'cli', 'mcp'];

const InterfaceTabPanel = ({ id, children }) => {
  const { activeIface } = useContext(InterfaceTabsContext);
  const current = INTERFACES.includes(activeIface) ? activeIface : INTERFACES[0];

  if (current !== id) return null;

  return <div>{children}</div>;
};

InterfaceTabPanel.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default InterfaceTabPanel;
