import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

import Burger from './burger';
import DiscordIcon from './images/header-discord.inline.svg';
import DiscussionsIcon from './images/header-discussions.inline.svg';
import Github from './images/header-github.inline.svg';

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
      { icon: DiscordIcon, text: 'Discord', description: 'Join our community', to: '/' },
      { icon: DiscussionsIcon, text: 'Discussions', description: 'Get a help', to: '/' },
    ],
  },
];

const Header = forwardRef(({ theme, isMobileMenuOpen, onBurgerClick }, ref) => (
  <header
    className={clsx(
      'safe-paddings absolute top-0 left-0 right-0 z-40 w-full lg:relative',
      theme === 'black' && 'lg:bg-black'
    )}
    ref={ref}
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
          {links.map(({ to, text, items }, index) => (
            <li className={clsx(items?.length > 0 && 'group relative')} key={index}>
              <Link
                className={clsx(
                  items?.length > 0 &&
                    'relative pr-3.5 before:absolute before:top-[7px] before:right-0 before:h-0 before:w-0 before:border-4 before:border-[transparent] before:transition-colors before:duration-200 group-hover:text-primary-2 group-hover:before:border-t-primary-2',
                  items?.length > 0 && theme === 'white' && 'before:border-t-black',
                  items?.length > 0 && theme === 'black' && 'before:border-t-white'
                )}
                to={to}
                theme={theme === 'white' ? 'black' : 'white'}
                size="sm"
              >
                {text}
              </Link>
              {items?.length > 0 && (
                <div className="group-hover:opacity-1 invisible absolute bottom-0 translate-y-full pt-4 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
                  <ul
                    className=" rounded-2xl bg-white p-3.5"
                    style={{ boxShadow: '0px 4px 10px rgba(26, 26, 26, 0.2)' }}
                  >
                    {items.map(({ icon: Icon, text, description, to }, index) => (
                      <li
                        className={clsx(index !== 0 && 'mt-3.5 border-t border-t-gray-3 pt-3.5')}
                        key={index}
                      >
                        <Link
                          className="flex items-center whitespace-nowrap hover:text-primary-2"
                          to={to}
                        >
                          <Icon className="flex-shrink-0" aria-hidden />
                          <span className="ml-3">
                            <span className="t-xl block font-semibold !leading-none transition-colors duration-200">
                              {text}
                            </span>
                            <span className="mt-1.5 block leading-none text-black">
                              {description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

      <div className="flex space-x-5 lg:hidden">
        <Button
          className="relative pl-11"
          to="https://github.com/zenithdb/zenith"
          size="xs"
          theme={theme === 'white' ? 'quaternary' : 'tertiary'}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github
            className={clsx(
              'absolute top-1/2 left-1.5 -translate-y-1/2',
              theme === 'white' && 'text-black',
              theme === 'black' && 'text-white'
            )}
          />
          <span>Star Us</span>
        </Button>
        <Button to="/" size="xs" theme="primary">
          Sign Up
        </Button>
      </div>

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
));

Header.propTypes = {
  theme: PropTypes.oneOf(['white', 'black']).isRequired,
  isMobileMenuOpen: PropTypes.bool,
  onBurgerClick: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isMobileMenuOpen: false,
};

export default Header;
