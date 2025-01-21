'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import Burger from 'components/shared/header/burger';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus';
import useMobileMenu from 'hooks/use-mobile-menu';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const AlgoliaSearch = dynamic(() => import('components/shared/algolia-search'), {
  ssr: false,
});

const ANIMATION_DURATION = 0.2;

const variants = {
  from: {
    opacity: 0,
    translateY: 30,
    transition: {
      duration: ANIMATION_DURATION,
    },
    transitionEnd: {
      zIndex: -1,
    },
  },
  to: {
    zIndex: 39,
    opacity: 1,
    translateY: 0,
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const getItemTitleStyles = (isDarkTheme, isMenuItemOpen) => {
  if (isMenuItemOpen && isDarkTheme) return 'text-white';
  if (!isMenuItemOpen && isDarkTheme) return 'text-gray-new-80';
  if (isMenuItemOpen && !isDarkTheme) return 'text-black-new dark:text-white';
  if (!isMenuItemOpen && !isDarkTheme) return 'text-gray-new-20 dark:text-gray-new-80';
};

const MobileMenuItem = ({ text, to, items, isDarkTheme }) => {
  const [isMenuItemOpen, setIsMenuItemOpen] = useState();
  const Tag = items ? 'button' : Link;

  const handleMenuItemClick = () => {
    if (items) {
      setIsMenuItemOpen(!isMenuItemOpen);
    }
  };

  return (
    <li
      className={clsx(
        'block shrink-0 overflow-hidden border-b leading-none dark:border-gray-new-10',
        isDarkTheme ? 'border-gray-new-10' : 'border-gray-new-94'
      )}
    >
      <Tag
        className={clsx(
          isMenuItemOpen && 'font-medium',
          getItemTitleStyles(isDarkTheme, isMenuItemOpen),
          'relative flex w-full items-center py-4 leading-none tracking-[-0.01em] transition-colors duration-200'
        )}
        to={to}
        onClick={handleMenuItemClick}
      >
        <span>{text}</span>
        {items && (
          <ChevronIcon
            className={clsx(
              'ml-auto inline-block h-2.5 w-2.5 transition-transform duration-200 dark:text-white [&_path]:stroke-2',
              isDarkTheme ? 'text-white' : 'text-grayn-new-40',
              isMenuItemOpen && 'rotate-180'
            )}
          />
        )}
      </Tag>
      {items?.length > 0 && (
        <AnimatePresence>
          {isMenuItemOpen && (
            <m.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              className={clsx(
                'flex flex-col gap-y-0.5 border-t py-2 dark:border-gray-new-10',
                isDarkTheme ? 'border-gray-new-10' : 'border-gray-new-94'
              )}
            >
              {items.map(({ icon, text, description, to }, index) => (
                <li className="group flex" key={index}>
                  <Link className="flex w-full gap-x-3 py-2 leading-none" to={to}>
                    <img
                      className="h-[17px] w-[17px] shrink dark:hidden"
                      src={icon.light}
                      width={17}
                      height={17}
                      loading="lazy"
                      alt=""
                      aria-hidden
                    />
                    <img
                      className="hidden h-[17px] w-[17px] shrink dark:block"
                      src={icon.dark}
                      width={17}
                      height={17}
                      loading="lazy"
                      alt=""
                      aria-hidden
                    />
                    <span className="flex flex-col gap-y-1">
                      <span
                        className={clsx(
                          'text-[15px] leading-dense tracking-[-0.01em] dark:text-white',
                          isDarkTheme ? 'text-white' : 'text-black-new'
                        )}
                      >
                        {text}
                      </span>
                      <span
                        className={clsx(
                          'text-[13px] font-light leading-dense tracking-extra-tight dark:text-gray-new-50',
                          isDarkTheme ? 'text-gray-new-50' : 'text-gray-new-40'
                        )}
                      >
                        {description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </m.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
};

MobileMenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  isDarkTheme: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
      to: PropTypes.string,
    })
  ),
};

const mobileMenuItems = [
  ...MENUS.header,
  {
    text: 'GitHub',
    to: LINKS.github,
  },
];

// TODO: need to refactor this component
const MobileMenu = ({
  isDarkTheme,
  showSearchInput = false,
  isDocPage = false,
  docPageType = null,
  searchIndexName = null,
}) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();

  return (
    <>
      <div className="absolute right-8 top-5 z-40 hidden gap-x-3 lg:flex lg:gap-x-4 md:right-4">
        {showSearchInput &&
          (isDocPage ? (
            <InkeepTrigger className="mobile-search" docPageType={docPageType} />
          ) : (
            <AlgoliaSearch
              className="mobile-search"
              isDarkTheme={isDarkTheme}
              indexName={searchIndexName}
            />
          ))}
        <Burger
          className={clsx(
            'relative flex',
            isDarkTheme ? 'text-white' : 'text-black dark:text-white'
          )}
          isToggled={isMobileMenuOpen}
          isNewDesign
          onClick={toggleMobileMenu}
        />
      </div>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.nav
              className={clsx(
                'safe-paddings fixed inset-0 z-[-1] hidden flex-col justify-between dark:bg-black-pure lg:flex',
                isDarkTheme ? 'bg-black-pure' : 'bg-white'
              )}
              initial="from"
              animate="to"
              exit="from"
              variants={variants}
            >
              <div className="relative h-full pb-[108px] pt-[97px] sm:pb-[158px]">
                <ul className="no-scrollbars flex h-full flex-col overflow-y-auto px-8 md:px-5">
                  {mobileMenuItems.map((item, index) => (
                    <MobileMenuItem key={index} {...item} isDarkTheme={isDarkTheme} />
                  ))}
                </ul>
                <div
                  className={clsx(
                    'absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-5 gap-y-3.5 p-8 dark:bg-black-pure md:px-5 sm:grid-cols-1 sm:py-7',
                    isDarkTheme ? 'bg-black-pure' : 'bg-white'
                  )}
                >
                  <Button
                    className={clsx(
                      'h-11 items-center justify-center text-[15px] !font-semibold tracking-tight dark:!border-gray-new-15 dark:!text-white',
                      !isDarkTheme && '!border-gray-new-90 !text-black-new'
                    )}
                    to={LINKS.login}
                    theme="gray-15-outline"
                  >
                    Log In
                  </Button>
                  <Button
                    className="h-11 items-center text-[15px] !font-semibold tracking-tight"
                    to={LINKS.signup}
                    theme="primary"
                    tag_name="MobileMenu"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </m.nav>
          )}
        </AnimatePresence>
      </LazyMotion>
    </>
  );
};

MobileMenu.propTypes = {
  isDarkTheme: PropTypes.bool,
  showSearchInput: PropTypes.bool,
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
  searchIndexName: PropTypes.string,
};

export default MobileMenu;
