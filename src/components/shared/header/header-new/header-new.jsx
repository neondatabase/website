import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import GithubStarCounter from 'components/shared/github-star-counter';
import Link from 'components/shared/link';
import MobileMenuNew from 'components/shared/mobile-menu/mobile-menu-new';
import LINKS from 'constants/links';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import arrowIcon from 'icons/header/arrow-right.svg';
import logoWhite from 'images/logo-white-28.svg';

const HeaderNew = ({ className = null, theme }) => {
  const isThemeBlack = theme === 'black-pure';

  return (
    <>
      <header
        className={clsx(
          'safe-paddings absolute left-0 right-0 top-0 z-40 h-16 w-full bg-black-pure lg:relative',
          className
        )}
      >
        <Container className="flex items-center justify-between py-4" size="1216">
          <div className="flex items-center gap-x-16">
            <Link to="/">
              <span className="sr-only">Neon</span>
              <Image
                className={clsx('h-7 w-auto', className)}
                src={logoWhite}
                alt=""
                width={102}
                height={28}
                aria-hidden
              />
            </Link>

            <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 xl:relative xl:left-auto xl:top-auto xl:translate-x-0 xl:translate-y-0">
              <ul className="relative flex gap-x-10 xl:gap-x-8 lg:hidden">
                {MENUS.header.map(({ to, text, items }, index) => {
                  const Tag = to ? Link : 'button';
                  return (
                    <li className={clsx(items?.length > 0 && 'group')} key={index}>
                      <Tag
                        className={clsx(
                          'flex items-center gap-x-1 whitespace-pre text-sm',
                          isThemeBlack ? 'text-white' : 'text-black dark:text-white'
                        )}
                        to={to}
                        theme={isThemeBlack && to ? 'white' : 'black'}
                      >
                        {text}
                        {items?.length > 0 && (
                          <ChevronIcon className="-mb-px w-2.5 opacity-60 [&_path]:stroke-2" />
                        )}
                      </Tag>
                      {items?.length > 0 && (
                        <div className="group-hover:opacity-1 invisible absolute -left-5 top-full w-[435px] pt-5 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
                          <ul
                            className={clsx(
                              'relative flex min-w-[248px] flex-col gap-y-1.5 rounded-[10px] bg-gray-new-8 p-3',
                              'before:border-linear before:absolute before:inset-0 before:rounded-[inherit] before:border-image-[linear-gradient(180deg,#1D1E21_0%,rgba(29,30,33,.4)_100%)]'
                            )}
                          >
                            {items.map(({ icon, text, description, to }, index) => (
                              <li key={index}>
                                <Link
                                  className={clsx(
                                    'group/link relative flex items-center overflow-hidden whitespace-nowrap rounded-xl p-2 text-white hover:text-primary-2',
                                    'before:absolute before:inset-0 before:z-10 before:bg-[#1D1E20] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100'
                                  )}
                                  to={to}
                                >
                                  <div className="relative z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-gray-new-30">
                                    <img
                                      src={icon.new}
                                      width={18}
                                      height={18}
                                      className="h-[18px] w-[18px] opacity-80 transition-opacity duration-200 group-hover/link:opacity-100"
                                      loading="lazy"
                                      alt=""
                                      aria-hidden
                                    />
                                  </div>
                                  <span className="relative z-10 ml-2">
                                    <span className="mr-2 block text-sm font-medium leading-none transition-colors duration-200">
                                      {text}
                                    </span>
                                    <span className="mt-1.5 block text-[13px] font-light leading-none text-gray-new-60">
                                      {description}
                                    </span>
                                  </span>
                                  <img
                                    src={arrowIcon}
                                    width={16}
                                    height={14}
                                    className="relative z-10 ml-auto mr-2 h-3.5 w-4 -translate-x-1.5 opacity-0 transition-[opacity,transform] duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                    loading="lazy"
                                    alt=""
                                    aria-hidden
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
          </div>

          <div className="flex items-center gap-x-6 lg:pr-12 md:hidden">
            <GithubStarCounter isThemeBlack isNewDesign />
            <Link
              className="text-[13px] font-semibold leading-none tracking-extra-tight lg:hidden"
              to={LINKS.login}
              theme="white"
            >
              Log In
            </Link>

            <Button
              className="h-8 px-6 text-[13px] font-semibold leading-none tracking-extra-tight transition-colors duration-200 lg:hidden"
              to={LINKS.signup}
              theme="primary"
            >
              Sign Up
            </Button>
          </div>
        </Container>
      </header>
      <MobileMenuNew isThemeBlack={isThemeBlack} />
    </>
  );
};

HeaderNew.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['black-pure']).isRequired,
};

export default HeaderNew;
