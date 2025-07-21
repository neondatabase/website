import PropTypes from 'prop-types';

import ModeToggler from 'components/pages/doc/mode-toggler';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import LINKS from 'constants/links';

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
        <div className="flex w-full items-center">
          <span className="w-[350px] shrink-0 xl:w-[302px] lg:hidden" />
          <Container
            className="z-10 grid w-full grid-cols-12 items-center gap-x-8 xl:flex xl:justify-between xl:gap-x-5 lg:pr-36 md:pr-24"
            size="1408"
          >
            <div className="hidden lg:flex lg:items-center lg:gap-x-7">
              <Logo
                className="h-7"
                isDarkTheme={isDarkTheme}
                width={102}
                height={28}
                priority
                isHeader
              />
              <Link
                className="relative text-[15px] font-medium leading-tight tracking-extra-tight text-gray-new-60 transition-colors duration-200 before:absolute before:inset-y-0 before:-left-3.5 before:h-full before:w-px before:bg-gray-new-80 hover:text-black-new dark:text-gray-new-60 before:dark:bg-gray-new-20 dark:hover:text-white"
                to={customType?.link || LINKS.docs}
              >
                {customType?.title || 'Docs'}
              </Link>
            </div>
            {docPageType !== 'postgres' && (
              <div className="col-span-7 col-start-2 -ml-6 flex max-w-[832px] gap-3.5 3xl:ml-0 2xl:col-span-7 2xl:col-start-1 xl:max-w-none md:hidden">
                <ModeToggler isAiChatPage={docPageType === 'aiChat'} />
              </div>
            )}
            <div className="col-span-2 col-start-10 -ml-12 h-full 3xl:-ml-20 2xl:col-span-5 2xl:col-start-8 2xl:ml-0 2xl:flex 2xl:justify-end xl:ml-auto lg:hidden">
              <Sidebar isClient={isClient} />
            </div>
            {/* <div className="col-start-2 col-span-10 flex items-center justify-between 2xl:col-start-1 2xl:col-span-full w-full lg:w-auto">
              {docPageType !== 'postgres' && (
                <ModeToggler className="md:hidden" isAiChatPage={docPageType === 'aiChat'} />
              )}
              <Sidebar className="lg:hidden" isClient={isClient} />
            </div> */}
          </Container>
        </div>
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
  withBorder: PropTypes.bool,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  isClient: PropTypes.bool,
};

export default Header;
