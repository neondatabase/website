'use client';

import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { createContext, useState, useContext } from 'react';

const ActiveTabContext = createContext();

const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Debounce the setActiveTab function
  const debouncedSetActiveTab = debounce((index) => {
    setActiveTab(index);
  }, 100);

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab: debouncedSetActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = () => useContext(ActiveTabContext);

ActiveTabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ActiveTabProvider;
