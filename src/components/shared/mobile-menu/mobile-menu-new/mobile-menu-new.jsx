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
    zIndex: 39,
    opacity: 1,
    translateY: 0,
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const MobileMenuItem = ({ text, to, items }) => {
  const [isMenuItemOpen, setIsMenuItemOpen] = useState();
  const Tag = items ? 'button' : Link;

  const handleMenuItemClick = () => {
    if (items) {
      setIsMenuItemOpen(!isMenuItemOpen);
    }
  };

  return (
    <li className="block shrink-0 overflow-hidden border-b border-gray-new-10 leading-none">
      <Tag
        className={clsx(
          isMenuItemOpen ? 'font-medium text-white' : 'text-gray-new-80',
          'relative flex w-full items-center py-4 leading-none tracking-[-0.01em] transition-colors duration-200'
        )}
        to={to}
        onClick={handleMenuItemClick}
      >
        <span>{text}</span>
        {items && (
          <ChevronIcon
            className={clsx(
              'ml-auto inline-block h-2.5 w-2.5 text-white transition-transform duration-200 [&_path]:stroke-2',
              {
                'rotate-180': isMenuItemOpen,
              }
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
              className="flex flex-col gap-y-0.5 border-t border-gray-new-10 py-2"
            >
              {items.map(({ icon, text, description, to }, index) => (
                <li className="group flex" key={index}>
                  <Link className="flex w-full gap-x-3 py-2 leading-none" to={to}>
                    <img
                      className="h-[17px] w-[17px] shrink"
                      src={icon.new}
                      width={17}
                      height={17}
                      alt=""
                      loading="lazy"
                    />
                    <span className="flex flex-col gap-y-1">
                      <span className="text-[15px] leading-dense tracking-[-0.01em] text-white">
                        {text}
                      </span>
                      <span className="text-[13px] font-light leading-dense tracking-extra-tight text-gray-new-50">
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
};

const mobileMenuItems = [
  ...MENUS.header,
  {
    text: 'GitHub',
    to: LINKS.github,
  },
];

const MobileMenuNew = ({ isThemeBlack }) => {
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
              className="safe-paddings fixed inset-0 z-[-1] hidden flex-col justify-between bg-black-pure lg:flex"
              initial="from"
              animate="to"
              exit="from"
              variants={variants}
            >
              <div className="relative h-full pb-[108px] pt-[97px] sm:pb-[158px]">
                <ul className="no-scrollbars flex h-full flex-col overflow-y-auto px-8 md:px-5">
                  {mobileMenuItems.map((item, index) => (
                    <MobileMenuItem key={index} {...item} />
                  ))}
                </ul>
                <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-5 gap-y-3.5 bg-black-pure p-8 md:px-5 sm:grid-cols-1 sm:py-7">
                  <Button
                    className="h-11 items-center justify-center !font-semibold tracking-tight"
                    to={LINKS.login}
                    theme="gray-15-outline"
                  >
                    Log In
                  </Button>
                  <Button
                    className="h-11 items-center !font-semibold tracking-tight"
                    to={LINKS.signup}
                    theme="primary"
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

MobileMenuNew.propTypes = {
  isThemeBlack: PropTypes.bool,
};

export default MobileMenuNew;
