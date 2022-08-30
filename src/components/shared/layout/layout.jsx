import clsx from 'clsx';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import SEO from 'components/shared/seo';
import Topbar from 'components/shared/topbar';

const Layout = ({ seo, headerTheme, withOverflowHidden, isSignIn, children, isHeaderSticky }) => {
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
      <Topbar />
      <div className="relative">
        <Header
          theme={headerTheme}
          isMobileMenuOpen={isMobileMenuOpen}
          ref={headerRef}
          isSignIn={isSignIn}
          isSticky={isHeaderSticky}
          onBurgerClick={handleHeaderBurgerClick}
        />
        <main className={clsx(withOverflowHidden && 'overflow-hidden')}>{children}</main>
        <Footer />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          headerRef={headerRef}
          onOutsideClick={handleMobileMenuOutsideClick}
        />
      </div>
    </>
  );
};

Layout.propTypes = {
  seo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  headerTheme: PropTypes.oneOf(['white', 'black']).isRequired,
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isSignIn: PropTypes.bool,
  isHeaderSticky: PropTypes.bool,
};

Layout.defaultProps = {
  seo: {},
  withOverflowHidden: false,
  isSignIn: false,
  isHeaderSticky: false,
};

export const query = graphql`
  fragment wpPageSeo on WpPage {
    seo {
      title
      metaDesc
      metaKeywords
      metaRobotsNoindex
      opengraphTitle
      opengraphDescription
      opengraphUrl
      twitterImage {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 1200, height: 630, formats: JPG)
          }
        }
      }
    }
  }

  fragment wpPostSeo on WpPost {
    seo {
      title
      metaDesc
      metaKeywords
      metaRobotsNoindex
      opengraphTitle
      opengraphDescription
      opengraphUrl
      twitterImage {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 1200, height: 630, formats: JPG)
          }
        }
      }
    }
  }
`;

export default Layout;
