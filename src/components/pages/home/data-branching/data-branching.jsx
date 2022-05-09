import React from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import Illustration from './data-branching-illustration';
// import Link from 'components/shared/link';

const DataBranching = () => {
  const [wrapperRef, isSectionInView] = useInView({ rootMargin: '100px 0px', triggerOnce: true });
  const [illustrationWrapperRef, isIllustrationWrapperInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section
      className="safe-paddings mt-[270px] mb-48 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20"
      ref={wrapperRef}
    >
      <Container className="z-10" size="md">
        <div className="max-w-[600px] xl:max-w-[400px] lg:max-w-none">
          <Heading tag="h2" size="lg" theme="black">
            Data Branching
          </Heading>
          <p className="t-xl mt-8 3xl:max-w-[504px] 2xl:mt-7 2xl:max-w-[416px] xl:mt-6 lg:max-w-none">
            Neon allows to instantly branch your Postgres database to support a modern
            development workflow. You can create a branch for your test environments for every code
            deployment in your CI/CD pipeline. 
          </p>

          <p className="t-xl mt-8 3xl:max-w-[504px] 2xl:mt-7 2xl:max-w-[416px] xl:mt-6 lg:max-w-none">
            Branches are virtually free and implemented using the "copy of write" technique.
          </p>
          {/* <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-primary-1">
          Getting started with data branching
        </Link> */}
        </div>
      </Container>
      <div
        className="relative z-[-2] mx-auto mt-[-365px] max-w-[1920px] 3xl:mt-[-19.38vw] 2xl:mt-[-18.94vw] xl:mt-[-18.55vw] lg:mt-5 sm:mt-10"
        ref={illustrationWrapperRef}
        aria-hidden
      >
        <img
          className="lg:min-w-[865px] md:min-w-[767px] sm:min-w-[700px] xs:min-w-[550px]"
          src="data:image/svg+xml;charset=utf-8,%3Csvg width='1920' height='784' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
          alt=""
        />
        {isSectionInView && (
          <Illustration
            className="lg:min-w-[865px z-[-2] md:min-w-[767px] sm:min-w-[700px] xs:min-w-[550px]"
            isInView={isIllustrationWrapperInView}
          />
        )}
      </div>
    </section>
  );
};

export default DataBranching;
