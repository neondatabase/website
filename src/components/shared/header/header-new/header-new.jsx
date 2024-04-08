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
              <ul className="flex gap-x-10 xl:gap-x-8 lg:hidden">
                {MENUS.header.map(({ to, text, items }, index) => {
                  const Tag = to ? Link : 'button';
                  return (
                    <li
                      className={clsx(
                        'relative [perspective:1000px]',
                        items?.length > 0 && 'group'
                      )}
                      key={index}
                    >
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
                        <div
                          className={clsx(
                            'absolute -left-5 top-full w-[300px] pt-5',
                            'pointer-events-none opacity-0',
                            'origin-top-left transition-[opacity,transform] duration-300 [transform:rotateX(-45deg)_scale(0.9)]',
                            'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:rotateX(0deg)_scale(1)]'
                          )}
                        >
                          <ul className="relative flex min-w-[248px] flex-col gap-y-0.5 rounded-[14px] border border-gray-new-10 bg-black-new p-2.5">
                            {items.map(({ icon, text, description, to }, index) => (
                              <li key={index}>
                                <Link
                                  className={clsx(
                                    'group/link relative flex items-center overflow-hidden whitespace-nowrap rounded-[14px] p-2 text-white hover:text-primary-2',
                                    'before:absolute before:inset-0 before:z-10 before:bg-gray-new-8 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100'
                                  )}
                                  to={to}
                                >
                                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-new-15 bg-gray-new-8">
                                    <img
                                      src={icon.new}
                                      width={20}
                                      height={20}
                                      className="h-5 w-5 opacity-80 transition-opacity duration-200 group-hover/link:opacity-100"
                                      loading="lazy"
                                      alt=""
                                      aria-hidden
                                    />
                                  </div>
                                  <span className="relative z-10 ml-2.5">
                                    <span className="block text-sm leading-dense tracking-[-0.02em] transition-colors duration-200">
                                      {text}
                                    </span>
                                    <span className="mt-0.5 block text-sm font-light leading-dense tracking-[-0.02em] text-gray-new-50">
                                      {description}
                                    </span>
                                  </span>
                                  <img
                                    src={arrowIcon}
                                    width={6}
                                    height={10}
                                    className="relative z-10 ml-auto mr-1.5 h-2.5 w-1.5 -translate-x-1.5 opacity-0 transition-[opacity,transform] duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
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
