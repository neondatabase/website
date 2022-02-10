import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import useClickOutside from 'hooks/use-click-outside';

import DiscordIcon from './images/mobile-menu-discord.inline.svg';
import DiscussionsIcon from './images/mobile-menu-discussions.inline.svg';
import GithubIcon from './images/mobile-menu-github.inline.svg';

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
    zIndex: 999,
    opacity: 1,
    translateY: 0,
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const links = [
  {
    text: 'Docs',
    to: '/',
  },
  {
    text: 'Team',
    to: '/team',
  },
  {
    text: 'Jobs',
    to: '/jobs',
  },
  {
    text: 'Blog',
    to: '/',
  },
  { icon: DiscordIcon, text: 'Discord', description: 'Join our community', to: '/' },
  { icon: DiscussionsIcon, text: 'Discussions', description: 'Get a help', to: '/' },
];

const MobileMenu = ({ isOpen, headerRef, onOutsideClick }) => {
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
      className="absolute top-20 right-8 left-8 z-[-1] hidden rounded-2xl bg-white px-5 pt-1 pb-7 lg:block md:right-4 md:left-4"
      initial="from"
      animate={controls}
      variants={variants}
      style={{ boxShadow: '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
      ref={ref}
    >
      <ul className="flex flex-col">
        {links.map(({ icon: Icon, text, to, description }, index) => (
          <li className="border-b border-b-gray-3" key={index}>
            {Icon && description ? (
              <Link className="flex items-center whitespace-nowrap py-4" to={to}>
                <Icon className="shrink-0" aria-hidden />
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
        ))}
      </ul>
      <div className="mt-5 space-y-4">
        <Button className="!flex h-12 items-center" to="/" size="xs" theme="primary">
          Sign Up
        </Button>
        <Button
          className="!flex h-12 items-center justify-center"
          to="/"
          size="xs"
          theme="quaternary"
        >
          <GithubIcon />
          <span className="ml-2.5">Star Us on Github</span>
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

MobileMenu.defaultProps = {
  isOpen: false,
};

export default MobileMenu;
