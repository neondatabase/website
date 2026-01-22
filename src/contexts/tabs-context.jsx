'use client';

import PropTypes from 'prop-types';
import React, { createContext, useMemo } from 'react';

import useLocalStorage from 'hooks/use-local-storage';

const TabsContext = createContext();

const TabsProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useLocalStorage('defaultTab', '');

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab, setActiveTab]);

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

TabsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TabsContext, TabsProvider };
