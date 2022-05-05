import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

import CheckIcon from './images/check.inline.svg';

const Hero = () => (
  <section className="safe-paddings flex h-screen min-h-[760px] lg:h-auto lg:min-h-screen lg:flex-col">
    <div className="relative max-w-[520px] bg-black p-8 text-white lg:order-last lg:max-w-none lg:py-7 md:px-4">
      <Link className="inline-block align-top lg:hidden" to="/">
        <img src={logoWhite} alt="Neon" />
      </Link>
      <h2 className="mt-12 text-[28px] font-bold lg:mt-0 lg:max-w-[450px] md:text-[26px]">
        Get serverless, fault-tolerant, branchable Postgresql for free
      </h2>
      <p className="mt-5 border-t border-t-[#2E3338] pt-5 font-semibold">Free Tier includes:</p>
      <ul className="mt-5 space-y-4">
        {['compute up to 1 vCPU / 256 MB', 'up to 10 GB storage', '3 clusters per user'].map(
          (item, index) => (
            <li className="flex items-center space-x-2 font-bold" key={index}>
              <CheckIcon />
              <span>{item}</span>
            </li>
          )
        )}
      </ul>
      <StaticImage
        className="absolute bottom-0 right-0 lg:hidden"
        src="./images/illustration.png"
        alt=""
        aria-hidden
      />
    </div>
    <div className="flex grow items-center justify-center">
      <div className="max-w-[470px] lg:pb-10 lg:pt-3.5 md:w-full md:max-w-none md:px-4">
        <Link className="lg:alight-top hidden lg:inline-block" to="/">
          <img src={logoBlack} alt="Neon" />
        </Link>
        <h1 className="text-[28px] font-bold lg:mt-10 md:text-[26px]">Get early access</h1>
        <p className="mt-2.5">Neon is in beta, please submit your email to join the waitlist</p>
        <input
          className="mt-7 h-11 w-full rounded border border-[#c7ccd1] px-3.5 lg:mt-5"
          type="email"
          placeholder="Email address..."
          autoComplete="email"
          style={{ boxShadow: '0px 1px 2px rgba(23, 26, 28, 0.06)' }}
        />
        <div className="mt-7 flex items-center justify-between lg:mt-6 lg:flex-col lg:items-center lg:justify-center lg:space-y-6">
          <Button size="xs" theme="primary">
            Join the waitlist
          </Button>
          <p className="text-[14px]">
            Already have an account?{' '}
            <Link className="font-semibold text-[#0D80F2] hover:underline" to={LINKS.dashboard}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
