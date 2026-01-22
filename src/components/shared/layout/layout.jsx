import clsx from 'clsx';
import PropTypes from 'prop-types';

import CookieConsent from 'components/shared/cookie-consent';
import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import Topbar from 'components/shared/topbar';

const Layout = ({
  className = null,
  headerClassName = null,
  withOverflowHidden = false,
  children,
  isHeaderSticky = false,
  isHeaderStickyOverlay = false,
  hasThemesSupport = false,
  isDocPage = false,
  docPageType = null,
  docsNavigation = null,
  docsBasePath = null,
  customType = null,
  isClient = false,
}) => (
  <>
    {!isClient && <Topbar />}
    <div
      className={clsx(
        'relative flex flex-col pt-safe',
        isClient ? 'min-h-screen' : 'min-h-[calc(100vh-36px)]',
        isDocPage && 'lg:!pb-12'
      )}
    >
      <Header
        className={headerClassName}
        isSticky={isHeaderSticky}
        isStickyOverlay={isHeaderStickyOverlay}
        hasThemesSupport={hasThemesSupport}
        isDocPage={isDocPage}
        docPageType={docPageType}
        docsNavigation={docsNavigation}
        docsBasePath={docsBasePath}
        customType={customType}
        isClient={isClient}
      />
      <main
        className={clsx(withOverflowHidden && 'overflow-hidden', 'flex flex-1 flex-col', className)}
      >
        {children}
      </main>
      <Footer hasThemesSupport={hasThemesSupport} />
      <CookieConsent />
    </div>
  </>
);

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  isHeaderStickyOverlay: PropTypes.bool,
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
  docsNavigation: PropTypes.array,
  docsBasePath: PropTypes.string,
  hasThemesSupport: PropTypes.bool,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  isClient: PropTypes.bool,
};

export default Layout;
