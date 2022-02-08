import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

import Burger from './burger';

const links = [
  {
    text: 'Pricing',
    to: '/',
  },
  {
    text: 'Pricing',
    to: '/',
  },
  {
    text: 'Team',
    to: '/team',
  },
  {
    text: 'Changelog',
    to: '/',
  },
  {
    text: 'Docs',
    to: '/',
  },
  {
    text: 'Jobs',
    to: '/jobs',
  },
];

const Header = ({ theme, isMobileMenuOpen, onBurgerClick }) => (
  <header
    className={clsx(
      'safe-paddings absolute top-0 left-0 right-0 z-30 w-full lg:relative',
      theme === 'black' && 'lg:bg-black'
    )}
  >
    <Container className="flex items-center justify-between py-8 2xl:py-6 lg:py-5" size="md">
      <Link
        className={clsx(
          'hidden xl:block',
          theme === 'white' && 'text-black',
          theme === 'black' && 'text-white'
        )}
        to="/"
      >
        <span className="sr-only">Zenith</span>
        <Logo className="h-6 2xl:h-5" aria-hidden />
      </Link>
      <nav className="xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
        <ul className="flex space-x-12 2xl:space-x-10 lg:hidden">
          {links.map(({ to, text }, index) => (
            <li key={index}>
              <Link to={to} theme={theme === 'white' ? 'black' : 'white'} size="sm">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        className={clsx(
          'absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 xl:hidden',
          theme === 'white' && 'text-black',
          theme === 'black' && 'text-white'
        )}
        to="/"
      >
        <span className="sr-only">Zenith</span>
        <Logo className="h-6 2xl:h-5" aria-hidden />
      </Link>
      <Button
        className="lg:hidden"
        to="/"
        size="xs"
        theme={theme === 'white' ? 'secondary' : 'tertiary'}
      >
        Sign Up
      </Button>
      <Burger
        className={clsx(
          'hidden lg:block',
          theme === 'white' && 'text-black',
          theme === 'black' && 'text-white'
        )}
        isToggled={isMobileMenuOpen}
        onClick={onBurgerClick}
      />
    </Container>
  </header>
);

Header.propTypes = {
  theme: PropTypes.oneOf(['white', 'black']).isRequired,
  isMobileMenuOpen: PropTypes.bool,
  onBurgerClick: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isMobileMenuOpen: false,
};

export default Header;
