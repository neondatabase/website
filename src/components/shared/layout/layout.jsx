import clsx from 'clsx';
import PropTypes from 'prop-types';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';

const Layout = ({
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
}) => (
  // 44px is the height of the topbar
  <div className="relative flex min-h-[calc(100vh-44px)] flex-col">
    <Header
      className={headerClassName}
      withBottomBorder={headerWithBottomBorder}
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
    <Footer isDocPage={isDocPage} theme={footerTheme} withTopBorder={footerWithTopBorder} />
  </div>
);

Layout.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']).isRequired,
  footerTheme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']),
  withOverflowHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isHeaderSticky: PropTypes.bool,
  headerWithBottomBorder: PropTypes.bool,
  footerWithTopBorder: PropTypes.bool,
  isDocPage: PropTypes.bool,
  isBlogPage: PropTypes.bool,
};

export default Layout;
