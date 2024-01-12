import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus';
import useClickOutside from 'hooks/use-click-outside';
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
    <li className="border-b border-b-gray-7 py-4">
      <Tag
        className="relative flex w-full items-center text-lg font-medium leading-none after:absolute after:-bottom-4 after:-top-4 after:left-0 after:w-full"
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
            className={clsx('ml-auto inline-block transition-transform duration-200', {
              '-rotate-90': menuOpen !== text,
            })}
          />
        )}
      </Tag>
      {items?.length > 0 && (
        <AnimatePresence>
          {menuOpen === text && (
            <m.ul
              className="pl-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
            >
              {items.map(({ text, to }, index) => (
                <li className="group flex first:pt-[9px]" key={index}>
                  <Link
                    className="w-full py-[7px] leading-tight text-gray-new-30 group-last:pb-0"
                    to={to}
                  >
                    {text}
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

const MobileMenu = ({ isOpen = false, onOutsideClick }) => {
  const ref = useRef(null);

  useClickOutside([ref], onOutsideClick);
  // create state to open menu item on click, one at a time, if one`s open, close it and open another one

  const [menuItemOpen, setMenuItemOpen] = useState();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <m.nav
            className="absolute left-8 right-8 top-16 z-[-1] hidden rounded-2xl bg-white px-5 pb-7 pt-1 lg:block md:left-4 md:right-4"
            initial="from"
            animate="to"
            exit="from"
            variants={variants}
            style={{ boxShadow: '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
            ref={ref}
          >
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
            <div className="mt-5 space-y-4">
              <Button
                className="!flex h-12 items-center justify-center"
                to={LINKS.login}
                size="xs"
                theme="quaternary"
              >
                Login
              </Button>
              <Button
                className="!flex h-12 items-center"
                to={LINKS.signup}
                size="xs"
                theme="primary"
              >
                Sign up
              </Button>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool,
  // Typing was taken from here — https://stackoverflow.com/a/51127130
  headerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      // SSR workaround
      current: PropTypes.instanceOf(typeof Element === 'undefined' ? () => {} : Element),
    }),
  ]).isRequired,
  onOutsideClick: PropTypes.func.isRequired,
};

export default MobileMenu;
