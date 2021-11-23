import clsx from 'clsx';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import useLottie from 'hooks/use-lottie';

import animationData from './data/lottie-data.json';

const Scalability = () => {
  const { animationRef, isAnimationReady, animationVisibilityRef } = useLottie({
    lottieOptions: { animationData },
    useInViewOptions: { threshold: 0.5 },
  });

  return (
    <section className="mt-48 safe-paddings 3xl:mt-44 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20">
      <Container className="flex items-center justify-between lg:block">
        <div className="max-w-[600px] ml-[150px] 3xl:max-w-[504px] 3xl:ml-[126px] 2xl:max-w-[416px] 2xl:ml-[104px] xl:max-w-[400px] xl:ml-0 lg:max-w-none">
          <Heading tag="h2" size="lg" theme="black">
            On Demand Scalability
          </Heading>
          <p className="mt-8 t-xl 2xl:mt-7 xl:mt-6">
            Zenith compute node is a modified postgres instance which is used only to process data
            retrieved from the multi-tenant storage. Compute node is swift to start and can be
            reconfigured on the fly. Without any activity compute shuts down to save resources and
            will be started on any incoming connection.
          </p>
          <p className="mt-5 t-xl 2xl:mt-4 xl:mt-3">
            While compute node is a modified postgres it is still fully app-compatible with the
            vanilla postgres. And we are committed to bring back our changes back to the community.
          </p>
          <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-secondary-3">
            Explore Zenith&apos;s architecture
          </Link>
        </div>
        <div
          className="relative w-full max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px] xl:max-w-[465px] lg:max-w-[475px] lg:-ml-3 lg:mt-[46px] md:-ml-2"
          ref={animationVisibilityRef}
          aria-hidden
        >
          <img
            src="data:image/svg+xml;charset=utf-8,%3Csvg width='880' height='800' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
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
      </Container>
    </section>
  );
};

export default Scalability;
