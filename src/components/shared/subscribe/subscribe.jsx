import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import DiscordIcon from './images/discord.inline.svg';
import GithubIcon from './images/github.inline.svg';
import TwitterIcon from './images/twitter.inline.svg';

const links = [
  {
    icon: TwitterIcon,
    to: '/',
  },
  {
    icon: DiscordIcon,
    to: '/',
  },
  {
    icon: GithubIcon,
    to: '/',
  },
];

const Subscribe = () => (
  <section className="my-48 safe-paddings">
    <Container className="flex items-center justify-between">
      <StaticImage
        className="max-w-[800px]"
        src="../subscribe/images/illustration.jpg"
        alt=""
        aria-hidden
      />
      <div className="max-w-[710px]">
        <Heading tag="h2" size="lg" theme="black">
          Subscribe <br /> to Newsletter
        </Heading>
        <div className="relative mt-10 ml-[14px] before:absolute before:-bottom-3.5 before:-left-3.5 before:w-full before:h-full before:bg-secondary-2 before:rounded-full">
          <input
            className="relative block w-[696px] h-24 mt-8 text-black bg-white border-4 border-black rounded-full outline-none t-2xl pl-7 pr-[218px] placeholder-black"
            type="email"
            placeholder="Your email..."
          />
          <Button className="absolute -translate-y-1/2 right-3 top-1/2" size="sm" theme="primary">
            Subscribe
          </Button>
        </div>
        <div className="flex items-center space-x-[38px] mt-[94px]">
          <span className="font-bold t-3xl">Join us:</span>
          <ul className="flex space-x-[26px]">
            {links.map(({ icon: Icon, to }, index) => (
              <li className="relative" key={index}>
                <span
                  className="absolute -bottom-1.5 -left-1.5 w-full h-full bg-secondary-5 rounded-full"
                  aria-hidden
                />
                <Link
                  className="relative flex items-center justify-center bg-white border-black border-4 rounded-full w-[72px] h-[72px] duration-200 transition-transform hover:translate-y-1.5 hover:-translate-x-1.5"
                  to={to}
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </section>
);

export default Subscribe;
