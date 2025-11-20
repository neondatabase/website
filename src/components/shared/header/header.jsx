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
        <Container
          className="!static z-10 flex w-full items-center justify-between md:px-8 sm:px-5"
          size="1600"
        >
          <div className="flex items-center gap-x-[92px] xl:gap-x-10">
            <Logo width={102} height={28} priority isHeader />
            <Navigation />
          </div>
          <Sidebar isClient={isClient} />
        </Container>
      )}
    </HeaderWrapper>
    <MobileMenu isDocPage={isDocPage} docPageType={docPageType} />
  </>
);

Header.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
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
