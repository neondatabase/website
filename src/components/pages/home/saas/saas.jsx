import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useLottie from 'hooks/use-lottie';

import animationData from './data/lottie-data.json';
import illustrationLg from './images/illustration-lg.svg';

const SaaS = () => {
  const { animationRef, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
    },
    useInViewOptions: { triggerOnce: false, threshold: [0.8, 0] },
    events: {
      complete() {
        // eslint-disable-next-line react/no-this-in-sfc
        this.loop = true;
        // eslint-disable-next-line react/no-this-in-sfc
        this.playSegments([60, 120], true);
      },
    },
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
        <div className="lg:hidden" ref={animationVisibilityRef} aria-hidden>
          <div
            id="saas-illustration"
            className="3xl:max-w-[813px] 2xl:max-w-[672px] xl:max-w-[500px]"
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
