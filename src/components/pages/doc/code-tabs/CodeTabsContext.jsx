'use client';

import PropTypes from 'prop-types';
import React, { createContext, useState } from 'react';

const ActiveLabelContext = createContext();

const ActiveLabelProvider = ({ children }) => {
  const [activeLabel, setActiveLabel] = useState('');
  return (
    <ActiveLabelContext.Provider value={{ activeLabel, setActiveLabel }}>
      {children}
    </ActiveLabelContext.Provider>
  );
};

ActiveLabelProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export { ActiveLabelContext, ActiveLabelProvider };
