import PropTypes from 'prop-types';

import CookieConsent from 'components/shared/cookie-consent';
import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import Topbar from 'components/shared/topbar';
import { cn } from 'utils/cn';

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
    <a
      className={cn(
        'fixed top-0 left-4 z-100 -translate-y-full rounded-b-sm px-4 py-2.5',
        'text-sm leading-none font-medium tracking-extra-tight',
        'border border-t-0 border-gray-new-90 bg-white text-black-pure',
        'dark:border-gray-new-20 dark:bg-black-pure dark:text-white',
        'focus:translate-y-0'
      )}
      href="#main-content"
    >
      Skip to main content
    </a>
    {!isClient && <Topbar />}
    <div
      className={cn(
        'relative flex flex-col pt-safe',
        isClient ? 'min-h-screen' : 'min-h-[calc(100vh-36px)]',
        isDocPage && 'lg:pb-12!'
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
        className={cn(withOverflowHidden && 'overflow-hidden', 'flex flex-1 flex-col', className)}
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer hasThemesSupport={hasThemesSupport} />
      <CookieConsent isDocPage={isDocPage} />
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
