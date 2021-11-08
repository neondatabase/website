import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import SEO from 'components/shared/seo';

const Layout = ({ children }) => {
  useEffect(() => {
    if (window && window.screen.width < 500) {
      const viewportTag = document.querySelector('meta[name="viewport"]');
      viewportTag.setAttribute('content', 'width=414, shrink-to-fit=yes, viewport-fit=cover');
    }
  }, []);

  return (
    <>
      <SEO />
      <Header />
      <main className="overflow-hidden">{children}</main>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
