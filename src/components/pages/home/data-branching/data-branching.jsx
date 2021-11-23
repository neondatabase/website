import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import useLottie from 'hooks/use-lottie';

import animationData from './data/lottie-data.json';

const DataBranching = () => {
  const { animationRef, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
    },
    useInViewOptions: { threshold: 0.8 },
  });

  return (
    <section className="mt-[270px] mb-48 safe-paddings 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20">
      <Container className="z-10">
        <div className="max-w-[600px] xl:max-w-[400px] lg:max-w-none">
          <Heading tag="h2" size="lg" theme="black">
            Data Branching
          </Heading>
          <p className="mt-8 t-xl 3xl:max-w-[504px] 2xl:max-w-[416px] 2xl:mt-7 xl:mt-6 lg:max-w-none">
            Zenith storage allows users to branch the entire Postgres cluster, making it ideal for
            developer, staging, and production environments. Use CLI from your CI/CD process to
            create a new branch from the current environment for every deploy preview.
          </p>
          <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-primary-1">
            Getting started with data branching
          </Link>
        </div>
      </Container>
      <div
        className="relative max-w-[1920px] mx-auto mt-[-365px] 3xl:mt-[-19.38vw] 2xl:mt-[-18.94vw] xl:mt-[-18.55vw] lg:-mt-5 md:mt-5 sm:mt-[40px]"
        ref={animationVisibilityRef}
        aria-hidden
      >
        <div className="w-[calc(100%+40px)] lg:min-w-[865px] lg:w-auto md:w-[767px] md:min-w-0 sm:w-auto sm:min-w-[700px] xs:min-w-[550px]">
          <img
            src="data:image/svg+xml;charset=utf-8,%3Csvg width='1960' height='800' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
            alt=""
            aria-hidden
          />
        </div>
        <div
          className="absolute top-0 right-1/2 z-[-2] w-[calc(100%+40px)] translate-x-1/2 lg:-right-2 lg:w-auto lg:min-w-[865px] lg:translate-x-0 md:w-[767px] md:min-w-0 sm:w-auto sm:min-w-[700px] xs:min-w-[550px]"
          ref={animationRef}
        />
      </div>
    </section>
  );
};

export default DataBranching;
