import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import SEO from 'components/shared/seo';

const Layout = ({ seo, headerTheme, withOverflowHidden, children }) => {
  const headerRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleHeaderBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  return (
    <>
      <SEO {...seo} />
      <Header
        theme={headerTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        ref={headerRef}
        onBurgerClick={handleHeaderBurgerClick}
      />
      <main className={clsx(withOverflowHidden && 'overflow-hidden')}>{children}</main>
      <Footer />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        headerRef={headerRef}
        onOutsideClick={handleMobileMenuOutsideClick}
      />
    </>
  );
};

Layout.propTypes = {
  seo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    canonicalUrl: PropTypes.string,
  }),
  headerTheme: PropTypes.oneOf(['white', 'black']).isRequired,
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  seo: {},
  withOverflowHidden: false,
};

export default Layout;
