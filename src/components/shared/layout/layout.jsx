import clsx from 'clsx';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, useRef, useMemo } from 'react';
import aa from 'search-insights';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import Topbar from 'components/shared/topbar';
import { ThemeContext, useDarkModeInit } from 'hooks/use-dark-mode';

import SearchModal from '../header/search-modal';

// Initialization of the search-insights library
aa('init', {
  appId: process.env.GATSBY_ALGOLIA_APP_ID,
  apiKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  useCookie: true,
});

let userToken = '';
aa('getUserToken', null, (err, algoliaUserToken) => {
  if (err) {
    console.error(err);
    return;
  }

  userToken = algoliaUserToken;
});

aa('setUserToken', userToken);

const Layout = ({
  headerTheme,
  withOverflowHidden,
  isSignIn,
  children,
  isHeaderSticky,
  headerWithBottomBorder,
  footerWithTopBorder,
  isDocPage,
  burgerWithoutBorder,
}) => {
  const headerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useDarkModeInit();
  const [isMobileSearchModalOpen, setIsMobileSearchModalOpen] = useState(false);

  const openMobileSearchModal = () => {
    setIsMobileSearchModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeMobileSearchModal = () => {
    setIsMobileSearchModalOpen(false);
    document.body.style.overflow = '';
  };

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
      <div className="relative flex min-h-screen flex-col">
        <Header
          withBottomBorder={headerWithBottomBorder}
          theme={headerTheme}
          isMobileMenuOpen={isMobileMenuOpen}
          ref={headerRef}
          isSignIn={isSignIn}
          isSticky={isHeaderSticky}
          isDocPage={isDocPage}
          burgerWithoutBorder={burgerWithoutBorder}
          onBurgerClick={handleHeaderBurgerClick}
          onSearchClick={openMobileSearchModal}
        />
        <main className={clsx(withOverflowHidden && 'overflow-hidden', 'flex flex-1 flex-col')}>
          {children}
        </main>
        <Footer isDocPage={isDocPage} withTopBorder={footerWithTopBorder} />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          headerRef={headerRef}
          burgerWithoutBorder={burgerWithoutBorder}
          onOutsideClick={handleMobileMenuOutsideClick}
        />
        <SearchModal isOpen={isMobileSearchModalOpen} closeModal={closeMobileSearchModal} />
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
  footerWithTopBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
  burgerWithoutBorder: PropTypes.bool,
};

Layout.defaultProps = {
  withOverflowHidden: false,
  isSignIn: false,
  isHeaderSticky: false,
  headerWithBottomBorder: false,
  footerWithTopBorder: false,
  isDocPage: false,
  burgerWithoutBorder: false,
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
