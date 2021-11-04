import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

const links = [
  {
    text: 'Docs',
    to: '/',
  },
  {
    text: 'Pricing',
    to: '/',
  },
  {
    text: 'Team',
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

const Header = () => (
  <header className="bg-black safe-paddings">
    <Container className="flex items-center justify-between py-8 2xl:py-6">
      <nav>
        <ul className="flex space-x-12 2xl:space-x-10">
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
        className="absolute block text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 xl:relative xl:top-0 xl:left-0 xl:transform-none xl:order-first"
        to="/"
      >
        <Logo className="h-6 2xl:h-5" />
      </Link>
      <Button to="/" size="xs" theme="tertiary">
        Sign Up
      </Button>
    </Container>
  </header>
);

export default Header;
