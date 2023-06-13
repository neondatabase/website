'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import aa from 'search-insights';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';

import SearchModal from '../header/search-modal';

// Initialization of the search-insights library
if (process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY) {
  let userToken = '';
  aa('init', {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
    useCookie: true,
  });
  aa('getUserToken', null, (err, algoliaUserToken) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    userToken = algoliaUserToken;
  });

  aa('setUserToken', userToken);
}

const Layout = ({
  className = null,
  headerTheme,
  footerTheme = 'white',
  withOverflowHidden = false,
  isSignIn = false,
  children,
  isHeaderSticky = false,
  headerWithBottomBorder = false,
  footerWithTopBorder = false,
  isDocPage = false,
}) => {
  const headerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isMobileSearchModalOpen, setIsMobileSearchModalOpen] = useState(false);
  useBodyLockScroll(isMobileSearchModalOpen);

  const openMobileSearchModal = () => {
    setIsMobileSearchModalOpen(true);
  };
  const closeMobileSearchModal = () => {
    setIsMobileSearchModalOpen(false);
  };

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleHeaderBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-44px)] flex-col">
      {/* 44px is the height of the topbar */}
      <Header
        withBottomBorder={headerWithBottomBorder}
        theme={headerTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        ref={headerRef}
        isSignIn={isSignIn}
        isSticky={isHeaderSticky}
        isDocPage={isDocPage}
        onBurgerClick={handleHeaderBurgerClick}
        onSearchClick={openMobileSearchModal}
      />
      <main
        className={clsx(
          withOverflowHidden && 'overflow-hidden',
          'flex h-full flex-1 flex-col dark:bg-black',
          className
        )}
      >
        {children}
      </main>
      <Footer isDocPage={isDocPage} theme={footerTheme} withTopBorder={footerWithTopBorder} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        headerRef={headerRef}
        onOutsideClick={handleMobileMenuOutsideClick}
      />
      <SearchModal isOpen={isMobileSearchModalOpen} closeModal={closeMobileSearchModal} />
    </div>
  );
};

Layout.propTypes = {
  className: PropTypes.string,
  headerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']).isRequired,
  footerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isSignIn: PropTypes.bool,
  isHeaderSticky: PropTypes.bool,
  headerWithBottomBorder: PropTypes.bool,
  footerWithTopBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
};

export default Layout;
