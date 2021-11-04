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
        text: 'Blog',
        to: '/',
      },
      {
        text: 'About us',
        to: '/',
      },
      {
        text: 'Changelog',
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
  <footer className="mb-20 safe-paddings 3xl:mb-16 2xl:mb-14 xl:mb-11">
    <Container className="flex justify-between border-t-2 border-b-2 border-black xl:flex-col">
      <div className="flex flex-col justify-between pt-8 pb-14 2xl:pt-[25px] 2xl:pb-11 xl:flex-row xl:items-center xl:py-6">
        <Link className="block text-black" to="/">
          <Logo className="h-6 2xl:h-5" />
        </Link>
        <p className="t-base">Zenith 2021 Ⓒ All rights reserved</p>
      </div>
      <div className="flex xl:order-first xl:border-b-2 xl:border-black xl:grid xl:grid-cols-4 xl:gap-x-6">
        {menuItems.map(({ heading, links }, index) => (
          <div
            className="w-[300px] border-l-2 border-black 3xl:w-[252px] 2xl:w-[208px] xl:w-full xl:border-none"
            key={index}
          >
            <Heading
              className="px-10 border-b-2 border-black py-9 2xl:px-8 2xl:py-7 xl:pl-0 xl:border-none xl:pt-8 xl:pb-0"
              tag="h3"
              size="xs"
              theme="black"
            >
              {heading}
            </Heading>
            <ul className="flex flex-col px-10 mt-10 space-y-6 pb-14 2xl:px-8 2xl:mt-8 2xl:pb-11 xl:pl-0">
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
