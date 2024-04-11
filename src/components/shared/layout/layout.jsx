import clsx from 'clsx';
import PropTypes from 'prop-types';

import CookieConsent from 'components/shared/cookie-consent';
import Footer from 'components/shared/footer';
import Header from 'components/shared/header';

const Layout = async ({
  className = null,
  headerClassName = null,
  headerTheme,
  footerTheme = 'white',
  withOverflowHidden = false,
  children,
  isHeaderSticky = false,
  isDocPage = false,
  isBlogPage = false,
}) => (
  // 36px is the height of the topbar
  <div className="relative flex min-h-[calc(100vh-36px)] flex-col">
    <Header
      className={headerClassName}
      theme={headerTheme}
      isSticky={isHeaderSticky}
      isDocPage={isDocPage}
      isBlogPage={isBlogPage}
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
    <Footer isDocPage={isDocPage} theme={footerTheme} />
    <CookieConsent />
  </div>
);

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['white', 'black-pure']).isRequired,
  footerTheme: PropTypes.oneOf(['white', 'black-pure']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  isDocPage: PropTypes.bool,
  isBlogPage: PropTypes.bool,
};

export default Layout;
