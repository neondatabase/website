import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import GithubStarCounter from 'components/shared/github-star-counter';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import MobileMenu from 'components/shared/mobile-menu';
import LINKS from 'constants/links';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import ArrowIcon from 'icons/header/arrow-right.inline.svg';
import { getGithubStars } from 'utils/get-github-data';

import Logo from '../logo';

import HeaderWrapper from './header-wrapper';

const themePropTypes = {
  isDarkTheme: PropTypes.bool,
};

const Navigation = async ({ isDarkTheme }) => (
  <nav>
    <ul className="flex gap-x-10 xl:gap-x-8 lg:hidden [@media(max-width:1070px)]:gap-x-6">
      {MENUS.header.map(({ to, text, items }, index) => {
        const Tag = to ? Link : 'button';
        return (
          <li
            className={clsx('relative [perspective:2000px]', items?.length > 0 && 'group')}
            key={index}
          >
            <Tag
              className={clsx(
                'flex items-center gap-x-1 whitespace-pre text-sm',
                isDarkTheme ? 'text-white' : 'text-black dark:text-white'
              )}
              to={to}
              theme={isDarkTheme && to ? 'white' : 'black'}
            >
              {text}
              {items?.length > 0 && (
                <ChevronIcon
                  className={clsx(
                    '-mb-px w-2.5 opacity-60 dark:text-white [&_path]:stroke-2',
                    isDarkTheme ? 'text-white' : 'text-black-new'
                  )}
                />
              )}
            </Tag>
            {items?.length > 0 && (
              <div
                className={clsx(
                  'absolute -left-5 top-full w-[300px] pt-5',
                  'pointer-events-none opacity-0',
                  'origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)]',
                  'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                )}
              >
                <ul
                  className={clsx(
                    'relative flex min-w-[248px] flex-col gap-y-0.5 rounded-[14px] border p-2.5 dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]',
                    isDarkTheme
                      ? 'border-[#16181D] bg-[#0B0C0F] shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                      : 'border-gray-new-94 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)]'
                  )}
                >
                  {items.map(({ icon, text, description, to }, index) => (
                    <li key={index}>
                      <Link
                        className={clsx(
                          'group/link relative flex items-center overflow-hidden whitespace-nowrap rounded-[14px] p-2 dark:text-white',
                          'before:absolute before:inset-0 before:z-10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 dark:before:bg-[#16181D]',
                          isDarkTheme
                            ? 'text-white before:bg-[#16181D]'
                            : 'text-black-new before:bg-[#f5f5f5]'
                        )}
                        to={to}
                      >
                        <div
                          className={clsx(
                            'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border dark:border-[#2E3038] dark:bg-[#16181D]',
                            isDarkTheme
                              ? 'border-[#2E3038] bg-[#16181D]'
                              : 'border-gray-new-90 bg-[#F5F5F5]'
                          )}
                        >
                          {isDarkTheme ? (
                            <img
                              className="h-5 w-5"
                              src={icon.dark}
                              width={20}
                              height={20}
                              loading="lazy"
                              alt=""
                              aria-hidden
                            />
                          ) : (
                            <>
                              <img
                                className="h-5 w-5 dark:hidden"
                                src={icon.light}
                                width={20}
                                height={20}
                                loading="lazy"
                                alt=""
                                aria-hidden
                              />
                              <img
                                className="hidden h-5 w-5 dark:block"
                                src={icon.dark}
                                width={20}
                                height={20}
                                loading="lazy"
                                alt=""
                                aria-hidden
                              />
                            </>
                          )}
                        </div>
                        <span className="relative z-10 ml-2.5">
                          <span className="block text-sm leading-dense tracking-[-0.01em] transition-colors duration-200">
                            {text}
                          </span>
                          <span
                            className={clsx(
                              'mt-0.5 block text-[13px] font-light leading-dense tracking-[-0.02em]',
                              isDarkTheme
                                ? 'text-gray-new-50'
                                : 'text-gray-new-40 dark:text-gray-new-50'
                            )}
                          >
                            {description}
                          </span>
                        </span>
                        <ArrowIcon
                          className={clsx(
                            'relative z-10 ml-auto mr-1.5 h-2.5 w-1.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100 dark:text-gray-new-70',
                            isDarkTheme ? 'text-gray-new-70' : 'text-gray-new-40'
                          )}
                        />
                      </Link>
                    </li>
                  ))}
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

const Sidebar = async ({ isDarkTheme }) => {
  const starsCount = await getGithubStars();
  return (
    <div className="flex items-center gap-x-6 lg:hidden">
      <Suspense>
        <GithubStarCounter isDarkTheme={isDarkTheme} starsCount={starsCount} />
      </Suspense>
      <Link
        className="text-[13px] leading-none tracking-extra-tight lg:hidden"
        to={LINKS.login}
        theme={isDarkTheme ? 'white' : 'black'}
      >
        Log In
      </Link>

      <Button
        className="h-8 px-6 text-[13px] font-semibold leading-none tracking-extra-tight transition-colors duration-200 lg:hidden"
        to={LINKS.signup}
        theme="primary"
        tag_name="Header"
        analyticsEvent="header_sign_up_clicked"
      >
        Sign Up
      </Button>
    </div>
  );
};
Sidebar.propTypes = themePropTypes;

const Header = async ({
  className = null,
  theme = null,
  isSticky = false,
  isStickyOverlay = false,
  showSearchInput = false,
  isDocPage = false,
  isPostgresPage = false,
  withBorder = false,
  searchIndexName = null,
  customType = null,
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
          <div className="flex">
            <span className="hidden w-[350px] shrink-0 3xl:block xl:w-[302px] lg:hidden" />
            <Container
              className="z-10 grid w-full grid-cols-12 items-center gap-x-8 xl:flex xl:justify-between xl:gap-x-5 lg:pr-32 md:pr-24"
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
                  className="relative text-[15px] font-medium leading-none tracking-extra-tight text-gray-new-60 transition-colors duration-200 before:absolute before:inset-y-0 before:-left-3.5 before:h-full before:w-px before:bg-gray-new-80 hover:text-black-new dark:text-gray-new-60 before:dark:bg-gray-new-20 dark:hover:text-white"
                  to={customType?.link || LINKS.docs}
                >
                  {customType?.title || 'Docs'}
                </Link>
              </div>
              <div className="col-span-7 col-start-3 -ml-6 flex max-w-[832px] gap-3.5 3xl:col-span-8 3xl:col-start-2 3xl:ml-0 2xl:col-span-8 2xl:col-start-1 xl:max-w-none lg:hidden">
                <InkeepTrigger className="w-[272px]" isPostgresPage={isPostgresPage} showAIButton />
              </div>
              <div className="col-span-2 col-start-11 -ml-12 h-full max-w-64 3xl:col-start-11 3xl:-ml-20 2xl:col-span-4 2xl:col-start-9 2xl:ml-6 xl:ml-0 lg:hidden">
                <Sidebar />
              </div>
            </Container>
          </div>
        ) : (
          <Container className="z-10 flex items-center justify-between md:!px-5" size="1344">
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
            <Sidebar isDarkTheme={isDarkTheme} />
          </Container>
        )}
      </HeaderWrapper>
      <MobileMenu
        isDarkTheme={isDarkTheme}
        showSearchInput={showSearchInput}
        isDocPage={isDocPage}
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
  isPostgresPage: PropTypes.bool,
  withBorder: PropTypes.bool,
  searchIndexName: PropTypes.string,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default Header;
