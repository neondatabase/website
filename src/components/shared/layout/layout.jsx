import clsx from 'clsx';
import PropTypes from 'prop-types';

import CookieConsent from 'components/shared/cookie-consent';
import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import Topbar from 'components/shared/topbar';

const Layout = ({
  className = null,
  headerClassName = null,
  headerTheme = null,
  footerTheme = null,
  withOverflowHidden = false,
  children,
  headerWithBorder = false,
  isHeaderSticky = false,
  isHeaderStickyOverlay = false,
  hasThemesSupport = false,
  isDocPage = false,
  docPageType = null,
  customType = null,
  isClient = false,
}) => (
  <>
    <Topbar isDarkTheme={headerTheme === 'dark'} />
    {/* 36px is the height of the topbar */}
    <div className="relative flex min-h-[calc(100vh-36px)] flex-col pt-safe">
      <Header
        className={headerClassName}
        theme={headerTheme}
        isDarkTheme={headerTheme === 'dark'}
        isSticky={isHeaderSticky}
        isStickyOverlay={isHeaderStickyOverlay}
        hasThemesSupport={hasThemesSupport}
        isDocPage={isDocPage}
        docPageType={docPageType}
        withBorder={headerWithBorder}
        customType={customType}
        isClient={isClient}
      />
      <main
        className={clsx(withOverflowHidden && 'overflow-hidden', 'flex flex-1 flex-col', className)}
      >
        {children}
      </main>
      <Footer hasThemesSupport={hasThemesSupport} theme={footerTheme} />
      <CookieConsent />
    </div>
  </>
);

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['light', 'dark']),
  footerTheme: PropTypes.oneOf(['light', 'dark']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  isHeaderStickyOverlay: PropTypes.bool,
  headerWithBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
  hasThemesSupport: PropTypes.bool,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  isClient: PropTypes.bool,
};

export default Layout;
