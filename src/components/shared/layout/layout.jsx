import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import SEO from 'components/shared/seo';

const Layout = ({ headerTheme, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHeaderBurgerClick = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <SEO />
      <Header
        theme={headerTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        onBurgerClick={handleHeaderBurgerClick}
      />
      <main className="overflow-hidden">{children}</main>
      <Footer />
      <MobileMenu isOpen={isMobileMenuOpen} />
    </>
  );
};

Layout.propTypes = {
  headerTheme: PropTypes.oneOf(['white', 'black']).isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
