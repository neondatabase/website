'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import Burger from 'components/shared/header/burger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus';
import useMobileMenu from 'hooks/use-mobile-menu';
import ChevronIcon from 'icons/chevron-down.inline.svg';

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
    zIndex: 99,
    opacity: 1,
    translateY: 0,
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const MobileMenuItem = ({ text, to, items, setMenuOpen, menuOpen }) => {
  const Tag = items ? 'button' : Link;
  return (
    <li className="block overflow-hidden border-b border-gray-new-10 leading-none">
      <Tag
        className="relative flex w-full items-center py-4 text-sm leading-none text-white after:absolute after:-bottom-4 after:-top-4 after:left-0 after:w-full"
        to={to}
        onClick={() => {
          if (items) {
            if (menuOpen === text) {
              setMenuOpen(null);
            } else {
              setMenuOpen(text);
            }
          }
        }}
      >
        <span>{text}</span>
        {items && (
          <ChevronIcon
            className={clsx(
              'ml-auto inline-block h-2.5 w-2.5 opacity-60 transition-transform duration-200 [&_path]:stroke-2',
              {
                'rotate-180': menuOpen === text,
              }
            )}
          />
        )}
      </Tag>
      {items?.length > 0 && (
        <AnimatePresence>
          {menuOpen === text && (
            <m.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
            >
              {items.map(({ icon, text, description, to }, index) => (
                <li className="group flex" key={index}>
                  <Link
                    className="flex w-full gap-x-3 border-t border-gray-new-10 py-3 pl-5 leading-none"
                    to={to}
                  >
                    <img
                      className="h-3.5 w-3.5 shrink"
                      src={icon.new}
                      width={14}
                      height={14}
                      alt=""
                      loading="lazy"
                    />
                    <span className="flex flex-col gap-y-1.5">
                      <span className="text-sm font-medium text-white">{text}</span>
                      <span className="block text-[13px] font-light text-gray-new-60">
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
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
      to: PropTypes.string,
    })
  ),
  setMenuOpen: PropTypes.func.isRequired,
  menuOpen: PropTypes.string,
};

const mobileMenuItems = [
  ...MENUS.header,
  {
    text: 'GitHub',
    to: LINKS.github,
  },
];

const MobileMenuNew = ({ isThemeBlack }) => {
  const [menuItemOpen, setMenuItemOpen] = useState();
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();

  return (
    <>
      <Burger
        className={clsx(
          'absolute right-8 top-5 z-40 hidden lg:flex md:right-4',
          isThemeBlack ? 'text-white' : 'text-black dark:text-white'
        )}
        isToggled={isMobileMenuOpen}
        isNewDesign
        onClick={toggleMobileMenu}
      />
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.nav
              className="safe-paddings absolute inset-0 top-16 z-[-1] hidden h-[calc(100vh-100px)] flex-col justify-between bg-black-pure px-8 lg:flex md:px-5"
              initial="from"
              animate="to"
              exit="from"
              variants={variants}
            >
              <div className="no-scrollbars max-h-[calc(100%-108px)] overflow-y-auto sm:max-h-[calc(100%-158px)]">
                <ul className="flex flex-col">
                  {mobileMenuItems.map((item, index) => (
                    <MobileMenuItem
                      key={index}
                      {...item}
                      setMenuOpen={setMenuItemOpen}
                      menuOpen={menuItemOpen}
                    />
                  ))}
                </ul>
              </div>
              <div className="fixed inset-x-0 bottom-0 grid grid-cols-2 gap-x-5 gap-y-3.5 bg-black-pure p-8 md:px-5 sm:grid-cols-1 sm:py-7">
                <Button
                  className="h-11 items-center justify-center"
                  to={LINKS.login}
                  theme="gray-15-outline"
                >
                  Log In
                </Button>
                <Button className="h-11 items-center" to={LINKS.signup} theme="primary">
                  Sign up
                </Button>
              </div>
            </m.nav>
          )}
        </AnimatePresence>
      </LazyMotion>
    </>
  );
};

MobileMenuNew.propTypes = {
  isThemeBlack: PropTypes.bool,
};

export default MobileMenuNew;
