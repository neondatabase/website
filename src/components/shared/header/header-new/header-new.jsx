'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import useMedia from 'react-use/lib/useMedia';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import GithubStarCounter from 'components/shared/github-star-counter';
import Link from 'components/shared/link';
import MobileMenu from 'components/shared/mobile-menu';
import LINKS from 'constants/links';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import logoWhite from 'images/logo-white-28.svg';

import Burger from '../burger';

const HeaderNew = ({ className = null, theme }) => {
  const isThemeBlack = theme === 'black-pure';
  const headerRef = useRef(null);
  const isMobile = useMedia('(max-width: 1023px)', false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={clsx(
          'safe-paddings absolute left-0 right-0 top-0 z-40 h-16 w-full bg-black-pure lg:relative',
          className
        )}
        ref={headerRef}
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
                    <li className={clsx(items?.length > 0 && 'group relative')} key={index}>
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
                        <div className="group-hover:opacity-1 invisible absolute top-full w-max pt-[18px] opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
                          <ul className="flex min-w-[248px] flex-col gap-y-6 rounded-[10px] border border-gray-new-10 bg-gray-new-8 p-4">
                            {items.map(({ icon, text, description, to }, index) => (
                              <li key={index}>
                                <Link
                                  className="flex items-center whitespace-nowrap text-white hover:text-primary-2"
                                  to={to}
                                >
                                  <img
                                    src={icon}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 shrink-0"
                                    loading="lazy"
                                    alt=""
                                    aria-hidden
                                  />
                                  <span className="ml-2">
                                    <span className="mr-2 block text-[15px] !leading-none transition-colors duration-200">
                                      {text}
                                    </span>
                                    <span className="mt-1 block text-sm font-light leading-none text-gray-new-50">
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
          </div>

          <div className="flex items-center gap-x-6 lg:hidden">
            <GithubStarCounter isThemeBlack isNewDesign />
            <Link
              className="text-[13px] font-semibold leading-none tracking-extra-tight"
              to={LINKS.login}
              theme="white"
            >
              Log In
            </Link>

            <Button
              className="h-8 px-6 text-[13px] font-semibold leading-none tracking-extra-tight transition-colors duration-200"
              to={LINKS.signup}
              theme="primary"
            >
              Sign Up
            </Button>
          </div>
          {isMobile && (
            <div className="flex items-center gap-x-3 md:gap-x-5">
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

HeaderNew.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['black-pure']).isRequired,
};

export default HeaderNew;
