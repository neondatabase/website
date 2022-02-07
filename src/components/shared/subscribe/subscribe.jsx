import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import DiscordIcon from './images/subscribe-discord.inline.svg';
import GithubIcon from './images/subscribe-github.inline.svg';
import SendIcon from './images/subscribe-send.inline.svg';
import TwitterIcon from './images/subscribe-twitter.inline.svg';

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

const Subscribe = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('https://submit-form.com/nHIBlORO', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  return (
    <section className="safe-paddings my-48 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20">
      <Container className="flex items-center justify-between lg:block" size="md">
        <StaticImage
          className="max-w-[800px] 3xl:max-w-[660px] 2xl:max-w-[550px] xl:max-w-[430px] lg:!hidden"
          src="../subscribe/images/subscribe-illustration.jpg"
          alt=""
          loading="lazy"
          aria-hidden
        />
        <div className="max-w-[710px] 3xl:max-w-[590px] 2xl:max-w-[488px] xl:max-w-[456px] lg:max-w-none">
          <Heading className="lg:text-center" tag="h2" size="lg" theme="black">
            Subscribe to&nbsp;Newsletter
          </Heading>
          <form
            className="relative mt-10 ml-[14px] before:absolute before:-bottom-3.5 before:-left-3.5 before:h-full before:w-full before:rounded-full before:bg-secondary-2 2xl:mt-8 2xl:ml-2.5 2xl:before:-bottom-2.5 2xl:before:-left-2.5 xl:mt-7 xl:ml-2 xl:before:-bottom-2 xl:before:-left-2 lg:mx-auto lg:max-w-[584px] md:before:w-[calc(100%+8px)]"
            noValidate
            onSubmit={handleSubmit}
          >
            <input
              className="outline-none t-2xl relative block h-24 w-[696px] rounded-full border-4 border-black bg-white pl-7 pr-[218px] text-black placeholder-black 3xl:w-[576px] 2xl:h-20 2xl:w-[478px] 2xl:pr-[187px] xl:h-[72px] xl:w-[448px] xl:pr-[164px] lg:w-full lg:pl-5 md:pr-20"
              name="email"
              type="email"
              placeholder="Your email..."
              autoComplete="email"
              onChange={handleInputChange}
            />
            <Button
              className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2 md:h-14 md:w-14 md:rounded-full md:p-0"
              size="sm"
              type="submit"
              theme="primary"
            >
              <span className="md:sr-only">Subscribe</span>
              <SendIcon className="hidden md:ml-1.5 md:block" aria-hidden />
            </Button>
          </form>
          <div className="mt-[94px] flex items-center space-x-[38px] 2xl:mt-[74px] 2xl:space-x-8 xl:mt-16 xl:space-x-7 lg:mt-12 lg:flex-col lg:space-x-0">
            <span className="t-3xl font-bold !leading-none">Join us:</span>
            <ul className="flex space-x-[26px] 2xl:space-x-5 xl:space-x-[18px] lg:mt-3.5">
              {links.map(({ icon: Icon, to }, index) => (
                <li className="relative" key={index}>
                  <span
                    className="absolute -bottom-1.5 -left-1.5 h-full w-full rounded-full bg-secondary-5 xl:-bottom-1 xl:-left-1"
                    aria-hidden
                  />
                  <Link
                    className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-black bg-white transition-transform duration-200 hover:translate-y-1.5 hover:-translate-x-1.5 2xl:h-16 2xl:w-16 xl:h-14 xl:w-14"
                    to={to}
                  >
                    <Icon className="h-8 xl:h-7" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Subscribe;
