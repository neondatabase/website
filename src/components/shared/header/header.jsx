import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

import ModeToggler from 'components/pages/doc/mode-toggler';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import GithubStarCounter from 'components/shared/github-star-counter';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MobileMenu from 'components/shared/mobile-menu';
import LINKS from 'constants/links';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import { getGithubStars } from 'utils/get-github-data';

import HeaderWrapper from './header-wrapper';
import menuBanner from './images/menu-banner.png';

const themePropTypes = {
  isDarkTheme: PropTypes.bool,
};

const Navigation = ({ isDarkTheme }) => (
  <nav>
    <ul className="flex gap-x-10 xl:gap-x-8 lg:hidden [@media(max-width:1070px)]:gap-x-6">
      {MENUS.header.map(({ to, text, sections }, index) => {
        const Tag = to ? Link : 'button';
        const hasSubmenu = sections?.length > 0;
        const gridSubmenu = sections?.length > 1;

        return (
          <li className={clsx('relative [perspective:2000px]', hasSubmenu && 'group')} key={index}>
            <Tag
              className={clsx(
                'flex items-center gap-x-1 whitespace-pre text-sm',
                isDarkTheme ? 'text-white' : 'text-black dark:text-white'
              )}
              to={to}
              theme={isDarkTheme && to ? 'white' : 'black'}
            >
              {text}
              {hasSubmenu && (
                <ChevronIcon
                  className={clsx(
                    '-mb-px w-2.5 opacity-60 [&_path]:stroke-2',
                    isDarkTheme ? 'text-white' : 'text-black-new dark:text-white'
                  )}
                />
              )}
            </Tag>
            {/* submenu */}
            {hasSubmenu && (
              <div
                className={clsx(
                  'absolute -left-5 top-full pt-5',
                  'pointer-events-none opacity-0',
                  'origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)]',
                  'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                )}
              >
                <ul
                  className={clsx(
                    'relative rounded-[14px] border p-6',
                    gridSubmenu &&
                      'grid w-max grid-cols-[repeat(2,minmax(0,auto));] gap-x-14 gap-y-9 px-7',
                    isDarkTheme
                      ? 'border-[#16181D] bg-[#0B0C0F] shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                      : 'border-gray-new-94 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)] dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                  )}
                >
                  {sections.map(({ title, items, banner, isExtended }, index) => {
                    if (banner) {
                      const { title, description, to } = banner;

                      return (
                        <li className="lg:-order-1" key={index}>
                          <Link className="group/banner relative rounded-lg" to={to}>
                            <Image src={menuBanner} width={232} height={145} alt="" />
                            <div className="absolute inset-x-4 bottom-3.5 z-10">
                              <h3 className="text-sm leading-none text-white">{title}</h3>
                              <p
                                className={clsx(
                                  'mt-1.5 text-xs font-light leading-none text-gray-new-50',
                                  'transition-colors duration-200 group-hover/banner:text-white'
                                )}
                              >
                                {description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li
                        className={clsx(
                          'min-w-[94px]',
                          gridSubmenu && [isExtended ? 'w-[216px]' : 'w-[196px]']
                        )}
                        key={index}
                      >
                        {title && (
                          <h3 className="mb-5 text-[11px] font-medium uppercase leading-none text-gray-new-40 dark:text-gray-new-50">
                            {title}
                          </h3>
                        )}
                        <ul className={clsx('flex flex-col', isExtended ? 'gap-5' : 'gap-4')}>
                          {items.map(
                            (
                              { icon: Icon, iconGradient: IconGradient, title, description, to },
                              index
                            ) => (
                              <li key={index}>
                                <Link
                                  className={clsx(
                                    'relative flex items-center whitespace-nowrap',
                                    isExtended
                                      ? 'gap-3 before:-inset-2.5 before:rounded-[14px]'
                                      : 'gap-2.5 before:-inset-1.5 before:rounded-lg',
                                    'before:absolute before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100',
                                    isDarkTheme
                                      ? 'before:bg-[#16181D]'
                                      : 'before:bg-[#f5f5f5] dark:before:bg-[#16181D]'
                                  )}
                                  to={to}
                                >
                                  {isExtended && IconGradient && (
                                    <div
                                      className={clsx(
                                        'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg border',
                                        isDarkTheme
                                          ? 'border-[#2E3038] bg-[#16181D]'
                                          : 'border-gray-new-90 bg-[#F5F5F5] dark:border-[#2E3038] dark:bg-[#16181D]'
                                      )}
                                    >
                                      <IconGradient
                                        className={clsx(
                                          'size-4',
                                          isDarkTheme
                                            ? 'text-white'
                                            : 'text-gray-new-20 dark:text-white'
                                        )}
                                      />
                                    </div>
                                  )}
                                  {!isExtended && Icon && (
                                    <div className="relative z-10 shrink-0">
                                      <Icon
                                        className={clsx(
                                          'size-4',
                                          isDarkTheme
                                            ? 'text-gray-new-80'
                                            : 'text-gray-new-30 dark:text-gray-new-80'
                                        )}
                                      />
                                    </div>
                                  )}
                                  <div className="relative z-10">
                                    <span
                                      className={clsx(
                                        'block text-sm leading-none tracking-[-0.01em] transition-colors duration-200',
                                        isDarkTheme
                                          ? 'text-white'
                                          : 'text-black-new dark:text-white'
                                      )}
                                    >
                                      {title}
                                    </span>
                                    {description && (
                                      <span
                                        className={clsx(
                                          'mt-1.5 block text-xs font-light leading-none tracking-extra-tight',
                                          isDarkTheme
                                            ? 'text-gray-new-50'
                                            : 'text-gray-new-40 dark:text-gray-new-50'
                                        )}
                                      >
                                        {description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

Navigation.propTypes = themePropTypes;

const GithubStars = async ({ isDarkTheme }) => {
  const starsCount = await getGithubStars();
  return (
    <Suspense>
      <GithubStarCounter isDarkTheme={isDarkTheme} starsCount={starsCount} />
    </Suspense>
  );
};

GithubStars.propTypes = themePropTypes;

const Sidebar = ({ isDarkTheme, isClient }) => (
  <div className="flex items-center gap-x-6 lg:hidden">
    {!isClient && <GithubStars isDarkTheme={isDarkTheme} />}
    <Link
      className="whitespace-nowrap text-[13px] leading-none tracking-extra-tight lg:hidden"
      to={LINKS.login}
      theme={isDarkTheme ? 'white' : 'black'}
    >
      Log In
    </Link>

    <Button
      className="h-8 whitespace-nowrap px-6 text-[13px] font-semibold leading-none tracking-extra-tight transition-colors duration-200 lg:hidden"
      to={LINKS.signup}
      theme="primary"
      tag_name="Header"
      analyticsEvent="header_sign_up_clicked"
    >
      Sign Up
    </Button>
  </div>
);

Sidebar.propTypes = {
  ...themePropTypes,
  isClient: PropTypes.bool,
};

const Header = ({
  className = null,
  theme = null,
  isSticky = false,
  isStickyOverlay = false,
  showSearchInput = false,
  isDocPage = false,
  docPageType = null,
  withBorder = false,
  searchIndexName = null,
  customType = null,
  isClient = false,
}) => {
  const isDarkTheme = theme === 'dark';

  return (
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
                <div className="col-span-7 col-start-2 -ml-6 flex max-w-[832px] gap-3.5 3xl:ml-0 2xl:col-span-8 2xl:col-start-1 xl:max-w-none md:hidden">
                  <ModeToggler isAiChatPage={docPageType === 'aiChat'} />
                </div>
              )}
              <div className="col-span-2 col-start-10 -ml-12 h-full max-w-64 3xl:-ml-20 2xl:col-span-4 2xl:col-start-9 2xl:ml-6 xl:ml-0 lg:hidden">
                <Sidebar isClient={isClient} />
              </div>
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
      <MobileMenu
        isDarkTheme={isDarkTheme}
        showSearchInput={showSearchInput}
        isDocPage={isDocPage}
        docPageType={docPageType}
        searchIndexName={searchIndexName}
      />
    </>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  isSticky: PropTypes.bool,
  isStickyOverlay: PropTypes.bool,
  showSearchInput: PropTypes.bool,
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
  withBorder: PropTypes.bool,
  searchIndexName: PropTypes.string,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  isClient: PropTypes.bool,
};

export default Header;
