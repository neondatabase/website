'use client';

// TODO: try to fing alternative solution to get previous url (using server actions, for example)
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useRef } from 'react';

const PreviousUrlContext = createContext();

export const PreviousUrlProvider = ({ children }) => {
  const previousUrlRef = useRef('');
  const pathname = usePathname();

  useEffect(() => {
    previousUrlRef.current = pathname;
  }, [pathname]);

  return (
    <PreviousUrlContext.Provider value={previousUrlRef.current}>
      {children}
    </PreviousUrlContext.Provider>
  );
};

PreviousUrlProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export const usePreviousUrl = () => useContext(PreviousUrlContext);
