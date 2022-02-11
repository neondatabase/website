import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import SEO from 'components/shared/seo';

const Layout = ({ headerTheme, children, pageMetadata }) => {
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
      <SEO data={pageMetadata} />
      <Header
        theme={headerTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        ref={headerRef}
        onBurgerClick={handleHeaderBurgerClick}
      />
      <main className="overflow-hidden">{children}</main>
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
  headerTheme: PropTypes.oneOf(['white', 'black']).isRequired,
  children: PropTypes.node.isRequired,
  pageMetadata: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

Layout.defaultProps = {
  pageMetadata: {},
};

export default Layout;
