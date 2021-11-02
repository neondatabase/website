import PropTypes from 'prop-types';
import React from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import SEO from 'components/shared/seo';

const Layout = ({ children }) => (
  <>
    <SEO />
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
