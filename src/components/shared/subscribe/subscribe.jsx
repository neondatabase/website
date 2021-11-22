import React, { useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import useLottie from 'hooks/use-lottie';

import animationData from './data/lottie-data.json';
import DiscordIcon from './images/discord.inline.svg';
import GithubIcon from './images/github.inline.svg';
import SendIcon from './images/send.inline.svg';
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

const Subscribe = () => {
  const [email, setEmail] = useState('');

  const { animationRef, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
      loop: true,
    },
    useInViewOptions: { threshold: [0.8, 0] },
  });

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
    <section className="my-48 safe-paddings 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20">
      <Container className="flex items-center justify-between lg:block">
        <div
          className="max-w-[800px] 3xl:max-w-[660px] 2xl:max-w-[550px] xl:max-w-[430px] lg:!hidden"
          ref={animationVisibilityRef}
          aria-hidden
        >
          <div ref={animationRef} />
        </div>
        <div className="max-w-[710px] 3xl:max-w-[590px] 2xl:max-w-[488px] xl:max-w-[456px] lg:max-w-none">
          <Heading className="lg:text-center" tag="h2" size="lg" theme="black">
            Subscribe to&nbsp;Newsletter
          </Heading>
          <form
            className="relative mt-10 ml-[14px] 2xl:mt-8 2xl:ml-2.5 xl:mt-7 xl:ml-2 lg:max-w-[584px] lg:mx-auto before:absolute before:-bottom-3.5 before:-left-3.5 before:w-full before:h-full before:bg-secondary-2 before:rounded-full 2xl:before:-bottom-2.5 2xl:before:-left-2.5 xl:before:-bottom-2 xl:before:-left-2 md:before:w-[calc(100%+8px)]"
            noValidate
            onSubmit={handleSubmit}
          >
            <input
              className="relative block w-[696px] h-24 text-black bg-white border-4 border-black rounded-full outline-none t-2xl pl-7 pr-[218px] placeholder-black 3xl:w-[576px] 2xl:w-[478px] 2xl:h-20 xl:w-[448px] 2xl:pr-[187px] xl:h-[72px] xl:pr-[164px] lg:w-full lg:pl-5 md:pr-20"
              name="email"
              type="email"
              placeholder="Your email..."
              autoComplete="email"
              onChange={handleInputChange}
            />
            <Button
              className="absolute -translate-y-1/2 right-3 top-1/2 2xl:right-2.5 xl:right-2 md:w-14 md:h-14 md:p-0 md:rounded-full"
              size="sm"
              type="submit"
              theme="primary"
            >
              <span className="md:sr-only">Subscribe</span>
              <SendIcon className="hidden md:block md:ml-1.5" aria-hidden />
            </Button>
          </form>
          <div className="flex items-center space-x-[38px] mt-[94px] 2xl:space-x-8 2xl:mt-[74px] xl:space-x-7 xl:mt-16 lg:flex-col lg:space-x-0 lg:mt-12">
            <span className="font-bold !leading-none t-3xl">Join us:</span>
            <ul className="flex space-x-[26px] 2xl:space-x-5 xl:space-x-[18px] lg:mt-3.5">
              {links.map(({ icon: Icon, to }, index) => (
                <li className="relative" key={index}>
                  <span
                    className="absolute -bottom-1.5 -left-1.5 w-full h-full bg-secondary-5 rounded-full xl:-bottom-1 xl:-left-1"
                    aria-hidden
                  />
                  <Link
                    className="relative flex items-center justify-center bg-white border-black border-4 rounded-full w-[72px] h-[72px] duration-200 transition-transform 2xl:w-16 2xl:h-16 xl:w-14 xl:h-14 hover:translate-y-1.5 hover:-translate-x-1.5"
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
