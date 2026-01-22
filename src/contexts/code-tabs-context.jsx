'use client';

import PropTypes from 'prop-types';
import React, { createContext, useMemo } from 'react';

import useLocalStorage from 'hooks/use-local-storage';

const CodeTabsContext = createContext();

const CodeTabsProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useLocalStorage('defaultCodeTab', '');

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab, setActiveTab]);

  return <CodeTabsContext.Provider value={value}>{children}</CodeTabsContext.Provider>;
};

CodeTabsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CodeTabsContext, CodeTabsProvider };
