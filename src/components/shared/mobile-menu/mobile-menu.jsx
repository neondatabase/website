import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus.js';
import useClickOutside from 'hooks/use-click-outside';

// import DiscordIcon from './images/mobile-menu-discord.inline.svg';
import DiscussionsIcon from './images/mobile-menu-discussions.inline.svg';
import GithubIcon from './images/mobile-menu-github.inline.svg';

const ANIMATION_DURATION = 0.2;

const icons = {
  // discord: DiscordIcon,
  github: GithubIcon,
  discussions: DiscussionsIcon,
};

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

const MobileMenu = ({ isOpen = false, headerRef, onOutsideClick }) => {
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen) {
      controls.start('to');
    } else {
      controls.start('from');
    }
  }, [isOpen, controls]);

  useClickOutside([ref, headerRef], onOutsideClick);

  return (
    <motion.nav
      className="absolute left-8 right-8 top-16 z-[-1] hidden rounded-2xl bg-white px-5 pb-7 pt-1 lg:block md:left-4 md:right-4"
      initial="from"
      animate={controls}
      variants={variants}
      style={{ boxShadow: '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
      ref={ref}
    >
      <ul className="flex flex-col">
        {MENUS.mobile.map(({ iconName, text, to, description }, index) => {
          const Icon = icons[iconName];
          return (
            <li className="border-b border-b-gray-6" key={index}>
              {Icon && description ? (
                <Link className="flex items-center whitespace-nowrap py-4" to={to}>
                  <Icon className="flex-shrink-0" aria-hidden />
                  <span className="ml-3">
                    <span className="t-xl block font-semibold !leading-none transition-colors duration-200">
                      {text}
                    </span>
                    <span className="mt-1.5 block leading-none text-black">{description}</span>
                  </span>
                </Link>
              ) : (
                <Link className="!block py-4 text-lg" to={to}>
                  {text}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-5 space-y-4">
        <Button
          className="!flex h-12 items-center justify-center"
          to={LINKS.dashboard}
          size="xs"
          theme="quaternary"
        >
          Sign In
        </Button>
        <Button className="!flex h-12 items-center" to={LINKS.signup} size="xs" theme="primary">
          Sign up
        </Button>
      </div>
    </motion.nav>
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
