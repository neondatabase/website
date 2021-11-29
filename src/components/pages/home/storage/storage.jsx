import clsx from 'clsx';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import useLottie from 'hooks/use-lottie';

import animationData from './data/storage-lottie-data.json';

const Storage = () => {
  const { animationRef, isAnimationReady, animationVisibilityRef } = useLottie({
    lottieOptions: { animationData },
    useInViewOptions: { threshold: 0.5 },
  });

  return (
    <section className="mt-48 safe-paddings 3xl:mt-44 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20">
      <Container className="flex items-center justify-between lg:flex-col lg:items-start">
        <div className="max-w-[600px] mr-[110px] 3xl:max-w-[504px] 3xl:mr-[86px] 2xl:max-w-[416px] 2xl:mr-[72px] xl:max-w-[400px] xl:mr-0 lg:max-w-none">
          <Heading className="max-w-[370px] lg:max-w-none" tag="h2" size="lg" theme="black">
            Unlimited Storage
          </Heading>
          <p className="mt-8 t-xl 2xl:mt-7 xl:mt-6">
            Zenith redistributes data across a fault-tolerant storage cluster written in rust, which
            takes care of high-availability and effectively makes the database instances on top of
            it &quot;bottomless&quot;. Backups, checkpoints, integration with S3 and point-in-time
            recovery are automatically handled by the zenith storage itself.
          </p>
          <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-secondary-5">
            How do we cook PostgreSQL storage
          </Link>
        </div>
        <div
          className="relative order-first w-full max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px] xl:max-w-[465px] lg:order-last lg:max-w-[475px] lg:mt-[46px]"
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

export default Storage;
