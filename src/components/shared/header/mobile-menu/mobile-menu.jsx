'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';

import Button from 'components/shared/button';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus';
import { TopbarContext } from 'contexts/topbar-context';
import useMobileMenu from 'hooks/use-mobile-menu';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import Burger from '../burger';

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

const MobileMenuItem = ({ text, to, sections, ...otherProps }) => {
  const [isMenuItemOpen, setIsMenuItemOpen] = useState();
  const Tag = sections ? Button : Link;
  const hasSubmenu = sections?.length > 0;

  const handleMenuItemClick = () => {
    if (sections) {
      setIsMenuItemOpen(!isMenuItemOpen);
    }
  };

  return (
    <li
      className={clsx('shrink-0 overflow-hidden border-b border-gray-new-20 last:border-b-0', {
        'pb-14 sm:pb-7': isMenuItemOpen,
      })}
    >
      <Tag
        className={clsx(
          'relative flex w-full items-center py-7 text-[28px] font-medium leading-none tracking-snug transition-colors duration-200 sm:py-5 sm:text-xl',
          { 'sm:pb-3': isMenuItemOpen }
        )}
        to={to}
        tagName="Mobile Menu"
        handleClick={handleMenuItemClick}
        {...otherProps}
      >
        {text}
        {sections && <ChevronIcon width={24} height={24} className="ml-auto text-white" />}
      </Tag>
      {hasSubmenu && (
        <AnimatePresence>
          {isMenuItemOpen && (
            <m.ul
              initial={{ height: 0, opacity: 0, paddingTop: 0 }}
              animate={{ height: 'auto', opacity: 1, paddingTop: 12 }}
              exit={{ height: 0, opacity: 0, paddingTop: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              className="grid grid-cols-2 gap-x-[104px] gap-y-9 pt-3 sm:grid-cols-1"
            >
              {sections.map(({ title, items }, index) => (
                <li className="min-w-[216px]" key={index}>
                  {title && (
                    <h3 className="mb-5 text-[10px] uppercase leading-none tracking-snug text-gray-new-50">
                      {title}
                    </h3>
                  )}
                  <ul className="flex flex-col gap-5">
                    {items.map(({ title, to, isExternal }) => (
                      <li key={title}>
                        <Link
                          className="block text-lg leading-none tracking-snug text-white sm:text-base"
                          to={to}
                          isExternal={isExternal}
                          tagName="MobileMenu"
                        >
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
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
    target: '_blank',
    rel: 'noopener noreferrer',
  },
];

const MobileMenu = ({ isDocPage = false, docPageType = null }) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  const { hasTopbar } = useContext(TopbarContext);

  return (
    <>
      <div className="absolute right-7 top-3 z-50 hidden gap-5 lg:flex lg:items-center lg:gap-x-4 md:right-4">
        {isDocPage && <InkeepTrigger className="mobile-search" docPageType={docPageType} />}
        <Burger
          className="relative flex text-white"
          isToggled={isMobileMenuOpen}
          isNewDesign
          onClick={toggleMobileMenu}
        />
      </div>
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
              <div
                className={clsx('relative h-full pb-[108px] pt-[60px] sm:pb-[158px]', {
                  'pt-[96px]': hasTopbar,
                })}
              >
                <ul className="no-scrollbars flex h-full flex-col overflow-y-auto px-8 md:px-5">
                  {mobileMenuItems.map((item, index) => (
                    <MobileMenuItem key={index} {...item} />
                  ))}
                </ul>
                <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-6 gap-y-3 bg-black-pure p-8 md:p-5 sm:grid-cols-1">
                  <Button to={LINKS.login} theme="gray-40-outline" tagName="MobileMenu" size="lg">
                    Log In
                  </Button>
                  <Button to={LINKS.signup} theme="white-filled" tagName="MobileMenu" size="lg">
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
  isDocPage: PropTypes.bool,
  docPageType: PropTypes.string,
};

export default MobileMenu;
