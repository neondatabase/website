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

const MobileMenuItem = ({ text, to, sections, ...otherProps }) => {
  const [isMenuItemOpen, setIsMenuItemOpen] = useState();
  const Tag = sections ? Button : Link;
  const hasSubmenu = sections?.length > 0;
  const isProduct = text === 'Product';

  const handleMenuItemClick = () => {
    if (sections) {
      setIsMenuItemOpen(!isMenuItemOpen);
    }
  };

  return (
    <li
      className={clsx(
        'shrink-0 overflow-hidden border-b border-gray-new-94 last:border-b-0 dark:border-gray-new-20',
        {
          'pb-14 sm:pb-10': isMenuItemOpen,
        }
      )}
    >
      <Tag
        className="relative flex w-full items-center py-7 text-2xl font-medium leading-none tracking-extra-tight sm:py-6 sm:text-xl"
        to={to}
        tagName="Mobile Menu"
        handleClick={handleMenuItemClick}
        {...otherProps}
      >
        {text}
        {sections && (
          <ChevronIcon width={24} height={24} className="ml-auto text-black-pure dark:text-white" />
        )}
      </Tag>
      {hasSubmenu && (
        <AnimatePresence>
          {isMenuItemOpen && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              className="flex gap-x-3.5 md:flex-col md:gap-y-9"
            >
              <ul className="grid grid-cols-[224px,224px] gap-x-5 gap-y-9 pt-3 sm:grid-cols-2 xs:grid-cols-1">
                {sections.map(({ title, items }, index) => (
                  <li key={index}>
                    {title && (
                      <h3 className="mb-5 text-[10px] uppercase leading-none tracking-snug text-gray-new-50">
                        {title}
                      </h3>
                    )}
                    <ul className="flex flex-col gap-5">
                      {items.map(({ title, description, to, isExternal }) => (
                        <li key={title}>
                          <Link
                            className="grid gap-y-2 text-[13px] leading-tight tracking-snug text-gray-new-40 dark:text-gray-new-60"
                            to={to}
                            isExternal={isExternal}
                            tagName="MobileMenu"
                          >
                            <span className="text-lg font-medium leading-none tracking-extra-tight text-black-pure dark:text-white sm:text-base">
                              {title}
                            </span>

                            {description}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              {isProduct && <MenuBanner />}
            </m.div>
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
          isExternal: PropTypes.bool,
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
      <div
        className={clsx(
          'absolute right-7 top-3 z-50 hidden gap-5 lg:flex lg:items-center lg:gap-x-4 sm:right-4',
          { 'right-8 top-4': isDocPage }
        )}
      >
        {isDocPage && <InkeepTrigger className="mobile-search" docPageType={docPageType} />}
        <Burger
          className="relative flex text-black dark:text-white"
          isToggled={isMobileMenuOpen}
          isNewDesign
          onClick={toggleMobileMenu}
        />
      </div>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.nav
              className="safe-paddings fixed inset-0 z-[-1] hidden flex-col justify-between bg-white dark:bg-black-pure lg:flex"
              initial="from"
              animate="to"
              exit="from"
              variants={variants}
            >
              <div
                className={clsx('relative h-full pb-[144px] pt-[60px] sm:pb-[188px]', {
                  'pt-[96px]': hasTopbar,
                })}
              >
                <ul className="no-scrollbars flex h-full flex-col overflow-y-auto px-8 pt-1 sm:px-5 sm:pt-3">
                  {mobileMenuItems.map((item, index) => (
                    <MobileMenuItem key={index} {...item} />
                  ))}
                </ul>
                <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-6 gap-y-3 bg-white p-8 pb-[68px] dark:bg-black-pure sm:grid-cols-1 sm:p-5 sm:pb-[68px]">
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
