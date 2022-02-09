import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';

import GithubIcon from './images/github.inline.svg';

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
  {
    text: 'Community',
    to: '#',
    items: [
      { text: 'Discord', to: '/' },
      { text: 'Discussions', to: '/' },
    ],
  },
];

const MobileMenu = ({ isOpen }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      controls.start('to');
    } else {
      controls.start('from');
    }
  }, [isOpen, controls]);

  return (
    <motion.nav
      className="absolute top-20 right-8 left-8 z-[-1] hidden rounded-md bg-white px-6 pt-2 pb-6 lg:block md:right-4 md:left-4 xs:px-5 xs:pb-5 xs:pt-1"
      initial="from"
      animate={controls}
      variants={variants}
      style={{ boxShadow: '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
    >
      <ul className="divide-y-gray-2 flex flex-col divide-y">
        {links.map(({ text, to, items }, index) => (
          <li key={index}>
            <Link className="!block py-4 text-lg" to={to}>
              {text}
            </Link>
            {items?.length > 0 && (
              <ul className="space-y-2 pl-4">
                {items.map(({ text, to }, index) => (
                  <li key={index}>
                    <Link className="block py-2 text-base leading-none" to={to}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center space-x-5 xs:space-x-2">
        <Button className="relative h-11 pl-12" to="/" size="xs" theme="quaternary">
          <GithubIcon className="absolute left-1.5 top-1/2 -translate-y-1/2" />
          Star Us
        </Button>
        <Button className="flex-grow" to="/" size="xs" theme="secondary">
          Sign Up
        </Button>
      </div>
    </motion.nav>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool,
};

MobileMenu.defaultProps = {
  isOpen: false,
};

export default MobileMenu;
