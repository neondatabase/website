'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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

import menuBanner from './images/menu-banner.png';

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

const MobileMenuItem = ({ text, to, sections, isDarkTheme }) => {
  const [isMenuItemOpen, setIsMenuItemOpen] = useState();
  const Tag = sections ? 'button' : Link;
  const hasSubmenu = sections?.length > 0;

  const handleMenuItemClick = () => {
    if (sections) {
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
        {sections && (
          <ChevronIcon
            className={clsx(
              'ml-auto inline-block h-2.5 w-2.5 transition-transform duration-200 dark:text-white [&_path]:stroke-2',
              isDarkTheme ? 'text-white' : 'text-grayn-new-40',
              isMenuItemOpen && 'rotate-180'
            )}
          />
        )}
      </Tag>
      {hasSubmenu && (
        <AnimatePresence>
          {isMenuItemOpen && (
            <m.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              className={clsx(
                'flex flex-col gap-y-5 border-t py-4 dark:border-gray-new-10',
                isDarkTheme ? 'border-gray-new-10' : 'border-gray-new-94'
              )}
            >
              {sections.map(({ title, items, banner }, index) => {
                if (banner) {
                  const { title, description, to } = banner;

                  return (
                    <li className="-order-1" key={index}>
                      <Link
                        className="relative block w-fit overflow-hidden rounded-lg xs:w-full"
                        to={to}
                      >
                        <Image
                          className="xs:h-20 xs:w-full xs:object-cover"
                          src={menuBanner}
                          width={252}
                          height={80}
                          alt=""
                        />
                        <div className="absolute inset-0 z-10 flex flex-col justify-center p-3">
                          <h3 className="text-sm text-white">{title}</h3>
                          <p className="mt-1.5 text-xs font-light text-gray-new-50">
                            {description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                }

                return (
                  <li className="w-full" key={index}>
                    {title && (
                      <h3 className="mb-4 text-[11px] font-medium uppercase leading-none text-gray-new-40 dark:text-gray-new-50">
                        {title}
                      </h3>
                    )}
                    <ul className="flex flex-col gap-4">
                      {items.map(({ icon: Icon, title, description, to }, index) => (
                        <li key={index}>
                          <Link className="relative flex gap-2 whitespace-nowrap" to={to}>
                            {Icon && (
                              <Icon
                                className={clsx(
                                  'size-4 shrink-0',
                                  isDarkTheme
                                    ? 'text-gray-new-80'
                                    : 'text-gray-new-30 dark:text-gray-new-80'
                                )}
                              />
                            )}
                            <div className="relative z-10">
                              <span
                                className={clsx(
                                  'block text-sm tracking-[-0.01em] transition-colors duration-200',
                                  description ? 'leading-none' : 'leading-dense',
                                  isDarkTheme ? 'text-white' : 'text-black-new dark:text-white'
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
                      ))}
                    </ul>
                  </li>
                );
              })}
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
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      theme: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.shape({
            light: PropTypes.string,
            dark: PropTypes.string,
          }),
          text: PropTypes.string,
          description: PropTypes.string,
          to: PropTypes.string,
        })
      ),
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
