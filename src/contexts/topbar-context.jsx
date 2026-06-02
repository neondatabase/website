'use client';

import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

const TopbarContext = createContext({
  hasTopbar: false,
  setHasTopbar: () => {},
});

const TopbarProvider = ({ children }) => {
  const [hasTopbar, setHasTopbar] = useState(false);

  return (
    <TopbarContext.Provider value={{ hasTopbar, setHasTopbar }}>{children}</TopbarContext.Provider>
  );
};

TopbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TopbarContext, TopbarProvider };
