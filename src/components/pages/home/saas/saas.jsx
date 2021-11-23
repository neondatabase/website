import clsx from 'clsx';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useLottie from 'hooks/use-lottie';

import animationData from './data/lottie-data.json';
import illustrationLg from './images/illustration-lg.svg';

const SaaS = () => {
  const { animationRef, isAnimationReady, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
    },
    useInViewOptions: { threshold: 0.8 },
  });

  return (
    <section
      id="saas"
      className="py-[212px] bg-black safe-paddings 3xl:py-44 2xl:py-40 xl:py-32 lg:py-24 md:py-20"
    >
      <Container className="z-20 flex items-center justify-between lg:block">
        <div>
          <Heading id="saas-title" tag="h2" size="lg" theme="white">
            Perfect for SaaS
          </Heading>
          <p
            id="saas-description"
            className="max-w-[600px] t-2xl mt-5 text-white 2xl:max-w-[488px] 2xl:mt-4 xl:max-w-[400px] lg:max-w-none"
          >
            With Zenith SaaS vendors can provisioning database clusters for each customer without
            worrying about the costs of provisioned capacity. Databases can be shut down when they
            are not active, while automated capacity adjustments can meet application needs.
          </p>
          <Button
            id="saas-button"
            className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6"
            to="/"
            size="md"
            theme="primary"
          >
            Try it Now
          </Button>
        </div>
        <div
          id="saas-illustration"
          className="relative 3xl:max-w-[813px] 2xl:max-w-[672px] xl:max-w-[500px] lg:hidden"
          ref={animationVisibilityRef}
          aria-hidden
        >
          <img
            src="data:image/svg+xml;charset=utf-8,%3Csvg width='976' height='624' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
            alt=""
          />
          <div
            className={clsx(
              'absolute top-0 right-0 w-full opacity-0 transition-opacity ease-linear duration-500',
              isAnimationReady && 'opacity-100'
            )}
            ref={animationRef}
          />
        </div>
        <img
          className="hidden lg:block lg:max-w-[524px] lg:mt-10 md:max-w-full"
          src={illustrationLg}
          loading="lazy"
          alt=""
          aria-hidden
        />
      </Container>
    </section>
  );
};

export default SaaS;
