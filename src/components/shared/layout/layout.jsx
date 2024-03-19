import clsx from 'clsx';
import PropTypes from 'prop-types';

import CookieConsent from 'components/shared/cookie-consent';
import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import HeaderNew from 'components/shared/header/header-new';

const Layout = async ({
  className = null,
  headerClassName = null,
  headerTheme,
  footerTheme = 'white',
  withOverflowHidden = false,
  children,
  isHeaderSticky = false,
  headerWithBottomBorder = false,
  footerWithTopBorder = false,
  isDocPage = false,
  isBlogPage = false,
  isNewDesign = false,
}) => (
  // 36px is the height of the topbar
  <div className="relative flex min-h-[calc(100vh-36px)] flex-col">
    {isNewDesign ? (
      <HeaderNew className={headerClassName} theme={headerTheme} />
    ) : (
      <Header
        className={headerClassName}
        withBottomBorder={headerWithBottomBorder}
        theme={headerTheme}
        isSticky={isHeaderSticky}
        isDocPage={isDocPage}
        isBlogPage={isBlogPage}
      />
    )}
    <main
      className={clsx(
        withOverflowHidden && 'overflow-hidden',
        'flex flex-1 flex-col dark:bg-black',
        className
      )}
    >
      {children}
    </main>
    <Footer isDocPage={isDocPage} theme={footerTheme} withTopBorder={footerWithTopBorder} />
    <CookieConsent />
  </div>
);

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'black-pure', 'gray-8']).isRequired,
  footerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'black-pure', 'gray-8']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  headerWithBottomBorder: PropTypes.bool,
  footerWithTopBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
  isBlogPage: PropTypes.bool,
  isNewDesign: PropTypes.bool,
};

export default Layout;
