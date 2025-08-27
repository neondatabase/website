import PropTypes from 'prop-types';

import DocsHeader from 'components/pages/doc/docs-header';
import Container from 'components/shared/container';
import Logo from 'components/shared/logo';

import HeaderWrapper from './header-wrapper';
import MobileMenu from './mobile-menu';
import Navigation from './navigation';
import Sidebar from './sidebar';

const Header = ({
  className = null,
  theme = null,
  isDarkTheme = false,
  isSticky = false,
  isStickyOverlay = false,
  isDocPage = false,
  docPageType = null,
  docsNavigation = null,
  docsBasePath = null,
  withBorder = false,
  customType = null,
  isClient = false,
}) => (
  <>
    <HeaderWrapper
      className={className}
      isSticky={isSticky}
      isStickyOverlay={isStickyOverlay}
      theme={theme}
      withBorder={withBorder}
    >
      {isDocPage ? (
        <DocsHeader
          customType={customType}
          docPageType={docPageType}
          isClient={isClient}
          navigation={docsNavigation}
          basePath={docsBasePath}
        />
      ) : (
        <Container className="z-10 flex w-full items-center justify-between md:!px-5" size="1344">
          <div className="flex items-center gap-x-[90px] xl:gap-x-16">
            <Logo
              className="h-7"
              isDarkTheme={isDarkTheme}
              width={102}
              height={28}
              priority
              isHeader
            />
            <Navigation isDarkTheme={isDarkTheme} />
          </div>
          <Sidebar isDarkTheme={isDarkTheme} isClient={isClient} />
        </Container>
      )}
    </HeaderWrapper>
    <MobileMenu isDarkTheme={isDarkTheme} isDocPage={isDocPage} docPageType={docPageType} />
  </>
);

Header.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  isDarkTheme: PropTypes.bool,
  isSticky: PropTypes.bool,
  isStickyOverlay: PropTypes.bool,
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
  docsNavigation: PropTypes.array,
  docsBasePath: PropTypes.string,
  withBorder: PropTypes.bool,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  isClient: PropTypes.bool,
};

export default Header;
