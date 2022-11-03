import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import logoBlack from 'images/logo-black.svg';

import ThemeSelect from './theme-select';

const Footer = ({ isDocPage, withTopBorder }) => {
  const containerSize = isDocPage ? 'xl' : 'md';
  return (
    <footer
      className={clsx(
        'safe-paddings mt-auto overflow-hidden',
        withTopBorder && 'border-t border-gray-7'
      )}
    >
      <Container className="flex justify-between py-10 xl:py-8" size={containerSize}>
        <div className="flex flex-col items-start justify-between md:w-full md:space-y-8 sm:space-y-6">
          <div className="mb-7 flex flex-col xl:mb-5 md:mb-0 md:w-full md:flex-row md:items-center md:justify-between">
            <Link className="block" to="/">
              <span className="sr-only">Neon</span>
              <img
                className="h-9 sm:h-6 sm:w-auto"
                src={logoBlack}
                width={128}
                height={36}
                alt=""
                aria-hidden
              />
            </Link>
            {isDocPage && <ThemeSelect className="mt-10 xl:mt-11 md:mt-0" />}
          </div>
          <div className="t-lg space-y-4 leading-none">
            <p>Made in SF and the World</p>
            <p>Neon 2022 Ⓒ All rights reserved</p>
          </div>
        </div>
        <div className="flex w-[40.5%] space-x-[123px] xl:w-[49.5%] xl:space-x-8 md:hidden">
          {MENUS.footer.map(({ heading, links }, index) => (
            <div className={clsx('flex flex-col xl:w-full')} key={index}>
              <Heading className="relative leading-none" tag="h3" size="xs" theme="black">
                {heading}
              </Heading>
              <ul className="mt-5 flex grow flex-col space-y-4">
                {links.map(({ to, text }, index) => {
                  const isExternalUrl = to.startsWith('http');
                  return (
                    <li className="flex" key={index}>
                      <Link
                        className="relative whitespace-nowrap leading-none"
                        to={to}
                        theme="black"
                        size="sm"
                        target={isExternalUrl ? '_blank' : null}
                        rel={isExternalUrl ? 'noopener noreferrer' : null}
                      >
                        {text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  isDocPage: PropTypes.bool,
  withTopBorder: PropTypes.bool,
};

Footer.defaultProps = {
  isDocPage: false,
  withTopBorder: false,
};

export default Footer;
