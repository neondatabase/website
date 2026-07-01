'use client';

import PropTypes from 'prop-types';
import { createContext, useMemo } from 'react';

import useLocalStorage from 'hooks/use-local-storage';

const InterfaceTabsContext = createContext();

const InterfaceTabsProvider = ({ children }) => {
  const [activeIface, setActiveIface] = useLocalStorage('neon-api-iface', 'api');

  const value = useMemo(() => ({ activeIface, setActiveIface }), [activeIface, setActiveIface]);

  return <InterfaceTabsContext.Provider value={value}>{children}</InterfaceTabsContext.Provider>;
};

InterfaceTabsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { InterfaceTabsContext, InterfaceTabsProvider };
