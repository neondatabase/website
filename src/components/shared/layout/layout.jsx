'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';

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

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleHeaderBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  return (
    // 44px is the height of the topbar
    <div className="relative flex min-h-[calc(100vh-44px)] flex-col">
      <Header
        withBottomBorder={headerWithBottomBorder}
        theme={headerTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        ref={headerRef}
        isSignIn={isSignIn}
        isSticky={isHeaderSticky}
        isDocPage={isDocPage}
        onBurgerClick={handleHeaderBurgerClick}
      />
      <main
        className={clsx(
          withOverflowHidden && 'overflow-hidden',
          'flex flex-1 flex-col dark:bg-black',
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
