'use client';

// TODO: try to fing alternative solution to get previous url (using server actions, for example)
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useRef } from 'react';

const PreviousUrlsContext = createContext();

export const PreviousUrlsProvider = ({ children }) => {
  const previousUrlsRef = useRef([]);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== previousUrlsRef.current[0]) {
      previousUrlsRef.current = [
        pathname,
        ...previousUrlsRef.current.filter((url) => url !== pathname),
      ];
    }
  }, [pathname]);

  return (
    <PreviousUrlsContext.Provider value={previousUrlsRef.current}>
      {children}
    </PreviousUrlsContext.Provider>
  );
};

PreviousUrlsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export const usePreviousUrls = () => useContext(PreviousUrlsContext);
