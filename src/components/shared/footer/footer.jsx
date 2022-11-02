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
      className={clsx('safe-paddings overflow-hidden', withTopBorder && 'border-t border-gray-7')}
    >
      <Container className="flex justify-between py-10 xl:py-8" size={containerSize}>
        <div className="flex flex-col items-start justify-between md:w-full md:flex-row md:items-end md:justify-between sm:flex-col sm:items-start">
          <div className="mb-7 md:mb-0 sm:mb-6">
            <Link className="block" to="/">
              <span className="sr-only">Neon</span>
              <img
                className="h-9 2xl:h-8"
                src={logoBlack}
                width={128}
                height={36}
                alt=""
                aria-hidden
              />
            </Link>
            <ThemeSelect className="mt-10 md:mt-8" />
          </div>
          <div className="t-lg space-y-4 leading-none">
            <p>Made in SF and the World</p>
            <p>Neon 2022 Ⓒ All rights reserved</p>
          </div>
        </div>
        <div className="grid w-[49%] grid-cols-3 gap-x-11 xl:w-[57%] xl:gap-x-16 md:hidden">
          {MENUS.footer.map(({ heading, links }, index) => (
            <div className={clsx('flex flex-col xl:w-full')} key={index}>
              <Heading className="relative leading-none" tag="h3" size="xs" theme="black">
                {heading}
              </Heading>
              <ul className="mt-5 flex grow flex-col space-y-4">
                {links.map(({ to, text }, index) => (
                  <li className="flex" key={index}>
                    <Link
                      className="relative whitespace-nowrap leading-none"
                      to={to}
                      theme="black"
                      size="sm"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
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
