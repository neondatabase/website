'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus';
import useMobileMenu from 'hooks/use-mobile-menu';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import Burger from '../burger';
import MenuBanner from '../menu-banner';

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
          'relative flex w-full items-center py-4 leading-none tracking-snug transition-colors duration-200',
          isMenuItemOpen && 'font-medium',
          {
            'text-white': isMenuItemOpen && isDarkTheme,
            'text-gray-new-80': !isMenuItemOpen && isDarkTheme,
            'text-black-new dark:text-white': isMenuItemOpen && !isDarkTheme,
            'text-gray-new-20 dark:text-gray-new-80': !isMenuItemOpen && !isDarkTheme,
          }
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
                  return <MenuBanner {...banner} key={index} />;
                }

                return (
                  <li className="w-full" key={index}>
                    {title && (
                      <h3 className="mb-4 text-[11px] font-medium uppercase leading-none text-gray-new-40 dark:text-gray-new-50">
                        {title}
                      </h3>
                    )}
                    <ul className="flex flex-col gap-4">
                      {items.map(({ icon: Icon, title, description, to }) => (
                        <li key={title}>
                          <Link
                            className={clsx(
                              'relative flex gap-2',
                              'before:absolute before:-inset-2 before:rounded-lg before:opacity-0'
                            )}
                            to={to}
                          >
                            {Icon && (
                              <Icon
                                className={clsx(
                                  'relative z-10 size-4 shrink-0',
                                  isDarkTheme
                                    ? 'text-gray-new-80'
                                    : 'text-gray-new-30 dark:text-gray-new-80'
                                )}
                              />
                            )}
                            <div className="relative z-10">
                              <span
                                className={clsx(
                                  'block text-sm tracking-snug transition-colors duration-200',
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
    text: 'Discord',
    to: LINKS.discord,
  },
];

const MobileMenu = ({ isDarkTheme, isDocPage = false, docPageType = null }) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();

  return (
    <>
      <div className="absolute right-8 top-5 z-40 hidden gap-x-3 lg:flex lg:gap-x-4 md:right-4">
        {isDocPage && <InkeepTrigger className="mobile-search" docPageType={docPageType} />}
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
              <div className="relative h-full pb-[108px] pt-[102px] sm:pb-[158px]">
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
                    tagName="MobileMenu"
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
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
};

export default MobileMenu;
