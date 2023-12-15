'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import useMedia from 'react-use/lib/useMedia';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MobileMenu from 'components/shared/mobile-menu';
import LINKS from 'constants/links';
import MENUS from 'constants/menus.js';

import GithubStarCounter from '../github-star-counter';

import Burger from './burger';

const Search = dynamic(() => import('components/shared/search'), { ssr: false });

const Header = ({
  className = null,
  theme,
  isSticky = false,
  withBottomBorder = false,
  isDocPage = false,
  isBlogPage = false,
}) => {
  const isThemeBlack = theme === 'black' || theme === 'black-new' || theme === 'gray-8';
  const headerRef = useRef(null);
  const isMobile = useMedia('(max-width: 1023px)', false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  const findIndexName = () => {
    if (isDocPage) return process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
    if (isBlogPage) return process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME;
    return null;
  };

  return (
    <>
      <header
        className={clsx(
          'safe-paddings absolute left-0 right-0 top-0 z-40 w-full dark:bg-gray-new-8 lg:relative lg:h-14',
          className,
          isSticky && 'sticky top-0 z-50 md:relative',
          withBottomBorder &&
            theme !== 'gray-8' &&
            'border-b border-gray-new-90 dark:border-gray-new-20',
          withBottomBorder && theme === 'gray-8' && 'border-b border-gray-new-20',
          { 'bg-gray-new-8': theme === 'gray-8' },
          { 'lg:bg-black': theme === 'black' },
          { 'lg:bg-black-new': theme === 'black-new' },
          { 'bg-white': theme === 'white' }
        )}
        ref={headerRef}
      >
        <Container className="flex items-center justify-between py-3.5" size="lg">
          <Link to="/">
            <span className="sr-only">Neon</span>
            <Logo isThemeBlack={isThemeBlack} />
          </Link>

          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ul className="flex space-x-12 3xl:space-x-10 2xl:space-x-8 lg:hidden">
              {MENUS.header.map(({ to, text, items }, index) => {
                const Tag = to ? Link : 'button';
                return (
                  <li className={clsx(items?.length > 0 && 'group relative')} key={index}>
                    <Tag
                      className={clsx(
                        'whitespace-pre',
                        items?.length > 0 &&
                          'relative pr-3.5 leading-none transition-colors duration-200 before:absolute before:right-0 before:top-[7px] before:h-0 before:w-0 before:border-4 before:border-transparent before:transition-[border-color] before:duration-200 hover:text-primary-2 group-hover:before:border-t-primary-2 dark:before:border-transparent',
                        items?.length > 0 && isThemeBlack
                          ? 'before:border-t-white'
                          : 'before:border-t-black dark:before:border-t-white',
                        isThemeBlack ? 'text-white' : 'text-black dark:text-white'
                      )}
                      to={to}
                      theme={isThemeBlack && to ? 'white' : 'black'}
                    >
                      {text}
                    </Tag>
                    {items?.length > 0 && (
                      <div className="group-hover:opacity-1 invisible absolute bottom-0 translate-y-full pt-4 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
                        <ul
                          className="min-w-[240px] rounded-2xl bg-white p-3.5"
                          style={{ boxShadow: '0px 4px 10px rgba(26, 26, 26, 0.2)' }}
                        >
                          {items.map(({ icon, text, description, to }, index) => (
                            <li
                              className={clsx(
                                index !== 0 && 'mt-3.5 border-t border-t-gray-6 pt-3.5'
                              )}
                              key={index}
                            >
                              <Link
                                className="flex items-center whitespace-nowrap hover:text-primary-2"
                                to={to}
                              >
                                <img
                                  src={icon}
                                  alt="text"
                                  width={44}
                                  height={44}
                                  className="h-11 w-11 shrink-0"
                                  loading="lazy"
                                  aria-hidden
                                />
                                <span className="ml-3">
                                  <span className="t-xl block font-semibold !leading-none transition-colors duration-200">
                                    {text}
                                  </span>
                                  <span className="mt-1.5 block leading-none text-black">
                                    {description}
                                  </span>
                                </span>
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

          <div className="flex lg:hidden">
            <GithubStarCounter className="mr-5 xl:mr-3" isThemeBlack={isThemeBlack} />
            <Button
              className="mr-3.5 xl:mr-2 px-[22px] h-9 font-semibold text-base duration-200 transition-colors leading-none xl:px-4"
              to={LINKS.login}
              theme={isThemeBlack ? 'gray-dark-outline' : 'gray-dark-outline-black'}
            >
              Log In
            </Button>

            <Button
              className="px-[22px] h-9 font-semibold text-base duration-200 transition-colors leading-none xl:px-4"
              to={LINKS.signup}
              theme="primary"
            >
              Sign Up
            </Button>
          </div>
          {isMobile && (
            <div className="items-center flex gap-x-3 md:gap-x-5">
              {(isDocPage || isBlogPage) && (
                <Search className="mobile-search" indexName={findIndexName()} isBlog={isBlogPage} />
              )}

              <Burger
                className={clsx(isThemeBlack ? 'text-white' : 'text-black dark:text-white')}
                isToggled={isMobileMenuOpen}
                onClick={handleBurgerClick}
              />
            </div>
          )}
        </Container>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        headerRef={headerRef}
        onOutsideClick={handleMobileMenuOutsideClick}
      />
    </>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['white', 'black', 'black-new', 'gray-8']).isRequired,
  withBottomBorder: PropTypes.bool,

  isSticky: PropTypes.bool,
  isDocPage: PropTypes.bool,
  isBlogPage: PropTypes.bool,
};

export default Header;
