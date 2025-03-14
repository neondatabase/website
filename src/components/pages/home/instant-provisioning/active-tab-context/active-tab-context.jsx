'use client';

import PropTypes from 'prop-types';
import { createContext, useState, useContext } from 'react';

const ActiveTabContext = createContext();

const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = () => useContext(ActiveTabContext);

ActiveTabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ActiveTabProvider;
