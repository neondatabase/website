import clsx from 'clsx';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, useRef, useMemo } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import Topbar from 'components/shared/topbar';
import { ThemeContext, useDarkModeInit } from 'hooks/use-dark-mode';

const Layout = ({
  headerTheme,
  withOverflowHidden,
  isSignIn,
  children,
  isHeaderSticky,
  headerWithBottomBorder,
  isDocPage,
}) => {
  const headerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useDarkModeInit();

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleHeaderBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  const themeContextValue = useMemo(() => [isDarkMode, setIsDarkMode], [isDarkMode, setIsDarkMode]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Topbar />
      <div className="relative">
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
        <main className={clsx(withOverflowHidden && 'overflow-hidden')}>{children}</main>
        <Footer isDocPage={isDocPage} />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          headerRef={headerRef}
          onOutsideClick={handleMobileMenuOutsideClick}
        />
      </div>
    </ThemeContext.Provider>
  );
};

Layout.propTypes = {
  headerTheme: PropTypes.oneOf(['white', 'black']).isRequired,
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isSignIn: PropTypes.bool,
  isHeaderSticky: PropTypes.bool,
  headerWithBottomBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
};

Layout.defaultProps = {
  withOverflowHidden: false,
  isSignIn: false,
  isHeaderSticky: false,
  headerWithBottomBorder: false,
  isDocPage: false,
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
