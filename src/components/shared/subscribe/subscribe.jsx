import { motion, AnimatePresence } from 'framer-motion';
import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import CheckIcon from './images/check.inline.svg';
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
  const [formState, setFormState] = useState('default');

  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailRegexp =
      // eslint-disable-next-line no-control-regex, no-useless-escape
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

    if (emailRegexp.test(email) && formState === 'default') {
      setFormState('loading');

      setTimeout(() => {
        setFormState('success');
        setEmail('Thanks for subscribing!');

        setTimeout(() => {
          setFormState('default');
          setEmail('');
        }, 2000);

        // 2000 (loading animation duration) + 200 (loading animation delay) = 2200
      }, 2200);

      fetch('https://submit-form.com/nHIBlORO', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    }
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
              className="remove-autocomplete-styles outline-none t-2xl relative block h-24 w-[696px] rounded-full border-4 border-black bg-white pl-7 pr-[218px] text-black placeholder-black 3xl:w-[576px] 2xl:h-20 2xl:w-[478px] 2xl:pr-[187px] xl:h-[72px] xl:w-[448px] xl:pr-[164px] lg:w-full lg:pl-5 md:pr-20"
              name="email"
              type="email"
              placeholder="Your email..."
              autoComplete="email"
              value={email}
              readOnly={formState !== 'default'}
              onChange={handleInputChange}
            />

            {/* Button */}
            <AnimatePresence>
              {formState === 'default' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <Button
                    className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2 md:h-14 md:w-14 md:rounded-full md:p-0"
                    size="sm"
                    type="submit"
                    theme="primary"
                  >
                    <span className="md:sr-only">Subscribe</span>
                    <SendIcon className="hidden md:ml-1.5 md:block" aria-hidden />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading state */}
            <AnimatePresence>
              {formState === 'loading' && (
                <motion.div
                  className="absolute right-3 top-1/2 flex h-[72px] w-[72px] -translate-y-1/2 items-center justify-center rounded-full bg-black 2xl:right-2.5 2xl:h-[60px] 2xl:w-[60px] xl:right-2 xl:h-[56px] xl:w-[56px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  aria-hidden
                >
                  <div className="h-[58px] w-[58px] rounded-full border-[6px] border-gray-2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]" />
                  <svg
                    className="absolute top-1/2 left-1/2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]"
                    width="58"
                    height="58"
                    viewBox="0 0 58 58"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                  >
                    <motion.path
                      d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                      strokeLinecap="round"
                      stroke="#00e699"
                      strokeWidth="6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success state */}
            <AnimatePresence>
              {formState === 'success' && (
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  aria-hidden
                >
                  <CheckIcon className="2xl:w-[60px] xl:w-[56px]" />
                </motion.div>
              )}
            </AnimatePresence>
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
