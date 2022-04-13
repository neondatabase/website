import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import LogoBlack from 'images/logo-black.inline.svg';

const Footer = () => (
  <footer className="safe-paddings overflow-hidden border-t-2 border-black">
    <Container className="flex justify-between xl:flex-col lg:border-none" size="md">
      <div className="flex flex-col items-start justify-between pt-8 pb-14 2xl:pt-[25px] 2xl:pb-11 xl:relative xl:flex-row xl:items-center xl:py-6 xl:before:absolute xl:before:left-[-50vw] xl:before:-top-0.5 xl:before:h-0.5 xl:before:w-[200vw] xl:before:bg-black md:block">
        <Link className="block" to="/">
          <span className="sr-only">Neon</span>
          <LogoBlack className="h-9 2xl:h-8" aria-hidden />
        </Link>
        <div className="t-base space-y-6 xl:space-y-4 md:mt-8">
          <p>
            Creative design by{' '}
            <Link to="https://pixelpoint.io/" theme="black">
              Pixel Point
            </Link>
          </p>
          <p>Neon 2021 Ⓒ All rights reserved</p>
        </div>
      </div>
      <div className="flex xl:order-first xl:grid xl:grid-cols-4 xl:gap-x-6 xl:border-b-2 xl:border-black lg:gap-x-4 md:grid-cols-2 md:gap-y-8 md:pt-8 md:pb-11 xs:block xs:space-y-8">
        {MENUS.footer.map(({ heading, links }, index) => (
          <div
            className="flex w-[300px] flex-col border-l-2 border-black 3xl:w-[254px] 2xl:w-[218px] xl:w-full xl:border-none"
            key={index}
          >
            <Heading
              className="relative border-b-2 border-black px-10 py-9 before:absolute before:left-0 before:-bottom-0.5 before:h-0.5 before:w-[50vw] before:bg-black 2xl:px-8 2xl:py-7 xl:border-none xl:px-0 xl:pt-8 xl:pb-0 xl:before:hidden md:pt-0"
              tag="h3"
              size="xs"
              theme="black"
            >
              {heading}
            </Heading>
            <ul className="mt-10 flex grow flex-col space-y-6 px-10 pb-14 2xl:mt-8 2xl:px-8 2xl:pb-11 xl:px-0 md:mt-6 md:space-y-5 md:pb-0">
              {links.map(({ to, text }, index) => (
                <li style={{ fontSize: 0 }} key={index}>
                  <Link to={to} theme="black" size="sm">
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

export default Footer;
