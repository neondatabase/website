import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

const menuItems = [
  {
    heading: 'Company',
    links: [
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
    ],
  },
  {
    heading: 'Docs',
    links: [
      {
        text: 'Our docs',
        to: '/',
      },
      {
        text: 'Postgres docs',
        to: '/',
      },
      {
        text: 'Postgres maillists',
        to: '/',
      },
    ],
  },
  {
    heading: 'Social',
    links: [
      {
        text: 'Twitter',
        to: '/',
      },
      {
        text: 'Discord',
        to: '/',
      },
      {
        text: 'Github',
        to: '/',
      },
    ],
  },
  {
    heading: 'Legal',
    links: [
      {
        text: 'Privacy policy',
        to: '/',
      },
      {
        text: 'Terms of service',
        to: '/',
      },
    ],
  },
];

const Footer = () => (
  <footer className="safe-paddings overflow-hidden border-t-2 border-black">
    <Container className="flex justify-between xl:flex-col lg:border-none" size="md">
      <div className="flex flex-col justify-between pt-8 pb-14 2xl:pt-[25px] 2xl:pb-11 xl:relative xl:flex-row xl:items-center xl:py-6 xl:before:absolute xl:before:left-[-50vw] xl:before:-top-0.5 xl:before:h-0.5 xl:before:w-[200vw] xl:before:bg-black md:block">
        <Link className="block text-black" to="/">
          <span className="sr-only">Zenith</span>
          <Logo className="h-6 2xl:h-5" aria-hidden />
        </Link>
        <p className="t-base md:mt-4">Zenith 2021 Ⓒ All rights reserved</p>
      </div>
      <div className="flex xl:order-first xl:grid xl:grid-cols-4 xl:gap-x-6 xl:border-b-2 xl:border-black lg:gap-x-4 md:grid-cols-2 md:gap-y-8 md:pt-8 md:pb-11">
        {menuItems.map(({ heading, links }, index) => (
          <div
            className="flex w-[300px] flex-col border-l-2 border-black 3xl:w-[252px] 2xl:w-[208px] xl:w-full xl:border-none"
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
            <ul className="mt-10 flex flex-grow flex-col space-y-6 px-10 pb-14 2xl:mt-8 2xl:px-8 2xl:pb-11 xl:px-0 md:mt-6 md:space-y-5 md:pb-0">
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
