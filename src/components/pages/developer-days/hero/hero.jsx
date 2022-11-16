import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import SubscriptionForm from 'components/shared/subscription-form';
import { HUBSPOT_DEVELOPER_DAYS_1_FORM_ID } from 'constants/forms';

import backgroundLines from './images/bg-lines.svg';
import Line from './images/white-line.inline.svg';

const Hero = () => (
  <div className="relative flex h-[calc(100vh-44px)] max-h-[1080px] min-h-[765px] flex-col overflow-hidden bg-black pt-[214px] pb-20 text-white lg:min-h-0 lg:pt-[20%] sm:h-auto sm:grow sm:pt-16">
    <Container className="relative h-full w-full" size="md">
      <img
        className="absolute -top-10 left-1/2 max-w-[1240px] -translate-x-1/2"
        src={backgroundLines}
        alt=""
        width={1240}
        height={871}
        loading="eager"
        aria-hidden
      />
      <div className="absolute -bottom-20 left-1/2 w-[1668px] -translate-x-1/2 lg:w-[1240px] md:w-[900px] sm:hidden">
        <StaticImage src="./images/background.png" alt="" width={1650} height={568} aria-hidden />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <time
          className="rounded-[40px] bg-secondary-2 py-2 px-4 text-xs font-bold uppercase leading-none text-black"
          dateTime="2022-12-05"
        >
          December 6-8, 2022
        </time>
        <h1 className="mt-5 text-center text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-4xl">
          Neon Developer Days
        </h1>
        <p className="mt-5 max-w-[640px] text-center text-xl leading-normal md:text-lg">
          Join us virtually on December 6th, 7th, and 8th to learn about Neon and how to build
          better with Serverless Postgres.
        </p>
        <div className="relative">
          <Line className="absolute top-[calc(100%-30px)] right-16 2xl:top-[calc(100%-10px)] lg:hidden" />
          <SubscriptionForm
            className="mt-8"
            successText="Thanks for registering!"
            submitButtonText="Register"
            size="sm"
            localStorageKey="submittedEmailDeveloperDays1Form"
            formId={HUBSPOT_DEVELOPER_DAYS_1_FORM_ID}
          />
        </div>
      </div>
    </Container>
  </div>
);

export default Hero;
