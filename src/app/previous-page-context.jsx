'use client';

import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

const PreviousPageContext = createContext();

export const PreviousPageProvider = ({ children }) => {
  const [lastPages, setLastPages] = useState([null, null]);
  const pathname = usePathname();

  useEffect(() => {
    setLastPages((lastPages) => [lastPages[1], pathname]);
  }, [pathname]);

  return (
    <PreviousPageContext.Provider value={lastPages[0]}>{children}</PreviousPageContext.Provider>
  );
};

PreviousPageProvider.propTypes = {
  children: PropTypes.node,
};

export const usePreviousPage = () => useContext(PreviousPageContext);
