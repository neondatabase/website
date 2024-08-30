'use client';

// TODO: try to find alternative solution to check whether user has visited homepage or not without using context
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

const HomepageVisitContext = createContext();

export const HomepageVisitProvider = ({ children }) => {
  const [hasVisitedHomepage, setHasVisitedHomepage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/' && !hasVisitedHomepage) {
      setHasVisitedHomepage(true);
    }
  }, [pathname, hasVisitedHomepage]);

  return (
    <HomepageVisitContext.Provider value={hasVisitedHomepage}>
      {children}
    </HomepageVisitContext.Provider>
  );
};

HomepageVisitProvider.propTypes = {
  children: PropTypes.node,
};

export const useHomepageVisit = () => useContext(HomepageVisitContext);
