import clsx from 'clsx';
import PropTypes from 'prop-types';

import CookieConsent from 'components/shared/cookie-consent';
import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import Topbar from 'components/shared/topbar';

const Layout = async ({
  className = null,
  headerClassName = null,
  headerTheme = 'white',
  footerTheme = 'white',
  withOverflowHidden = false,
  children,
  headerWithBorder = false,
  isHeaderSticky = false,
  isDocPage = false,
  isBlogPage = false,
}) => (
  <>
    <Topbar isThemeBlack={headerTheme === 'black-pure'} />
    {/* 36px is the height of the topbar */}
    <div className="relative flex min-h-[calc(100vh-36px)] flex-col pt-safe">
      <Header
        className={headerClassName}
        theme={headerTheme}
        isSticky={isHeaderSticky}
        isDocPage={isDocPage}
        isBlogPage={isBlogPage}
        withBorder={headerWithBorder}
      />
      <main
        className={clsx(withOverflowHidden && 'overflow-hidden', 'flex flex-1 flex-col', className)}
      >
        {children}
      </main>
      <Footer isDocPage={isDocPage} theme={footerTheme} />
      <CookieConsent />
    </div>
  </>
);

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['white', 'black-pure']).isRequired,
  footerTheme: PropTypes.oneOf(['white', 'black-pure']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  headerWithBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
  isBlogPage: PropTypes.bool,
};

export default Layout;
