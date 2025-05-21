'use client';

// TODO: try to find alternative solution to check whether user has visited homepage or not without using context
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface HomepageVisitProviderProps {
  children: ReactNode;
}

const HomepageVisitContext = createContext<boolean>(false);

export const HomepageVisitProvider: React.FC<HomepageVisitProviderProps> = ({ children }) => {
  const [hasVisitedHomepage, setHasVisitedHomepage] = useState<boolean>(false);
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

export const useHomepageVisit = (): boolean => useContext(HomepageVisitContext);
