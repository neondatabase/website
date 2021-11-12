import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

import BurgerIcon from './images/burger.inline.svg';
import CloseIcon from './images/close.inline.svg';

const links = [
  {
    text: 'Pricing',
    to: '/',
  },
  {
    text: 'Team',
    to: '/',
  },
  {
    text: 'Docs',
    to: '/',
  },
  {
    text: 'Changelog',
    to: '/',
  },
  {
    text: 'Blog',
    to: '/',
  },
];

const Header = ({ isMobileMenuOpen, onBurgerClick }) => (
  <header className="absolute top-0 left-0 right-0 z-10 w-full safe-paddings lg:relative lg:bg-black">
    <Container className="flex items-center justify-between py-8 2xl:py-6 lg:py-5">
      <Link className="hidden text-white xl:block" to="/">
        <span className="sr-only">Zenith</span>
        <Logo className="h-6 2xl:h-5" aria-hidden />
      </Link>
      <nav className="xl:absolute xl:-translate-x-1/2 xl:-translate-y-1/2 xl:top-1/2 xl:left-1/2">
        <ul className="flex space-x-12 2xl:space-x-10 lg:hidden">
          {links.map(({ to, text }, index) => (
            <li key={index}>
              <Link to={to} theme="white" size="sm">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        className="absolute block text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 xl:hidden"
        to="/"
      >
        <span className="sr-only">Zenith</span>
        <Logo className="h-6 2xl:h-5" aria-hidden />
      </Link>
      <Button className="lg:hidden" to="/" size="xs" theme="tertiary">
        Sign Up
      </Button>
      <button className="hidden lg:block" type="button" onClick={onBurgerClick}>
        {isMobileMenuOpen ? <CloseIcon /> : <BurgerIcon />}
      </button>
    </Container>
  </header>
);

Header.propTypes = {
  isMobileMenuOpen: PropTypes.bool,
  onBurgerClick: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isMobileMenuOpen: false,
};

export default Header;
