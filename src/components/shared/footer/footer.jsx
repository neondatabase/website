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
  <footer className="mb-20">
    <Container className="flex justify-between border-t-2 border-b-2 border-black">
      <div className="flex flex-col justify-between pt-8 pb-14">
        <Link className="block text-black" to="/">
          <Logo />
        </Link>
        <p className="t-base">Zenith 2021 Ⓒ All rights reserved</p>
      </div>
      <div className="flex">
        {menuItems.map(({ heading, links }, index) => (
          <div className="w-[300px] border-l-2 border-black" key={index}>
            <Heading
              className="px-10 border-b-2 border-black py-9"
              tag="h3"
              size="xs"
              theme="black"
            >
              {heading}
            </Heading>
            <ul className="flex flex-col px-10 mt-10 space-y-6 pb-14">
              {links.map(({ to, text }, index) => (
                <Link to={to} theme="normal-black" size="sm" key={index}>
                  {text}
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  </footer>
);

export default Footer;
