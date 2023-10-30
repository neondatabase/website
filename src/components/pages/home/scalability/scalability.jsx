'use client';

import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
// import Link from 'components/shared/link';

import Illustration from './scalability-illustration';

const Scalability = () => {
  const [wrapperRef, isSectionInView] = useInView({ rootMargin: '100px 0px', triggerOnce: true });
  const [illustrationWrapperRef, isIllustrationWrapperInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section
      className="safe-paddings mt-48 3xl:mt-44 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20"
      ref={wrapperRef}
    >
      <Container className="flex items-center justify-between lg:block" size="md">
        <div className="ml-[150px] max-w-[600px] 3xl:ml-[126px] 3xl:max-w-[504px] 2xl:ml-[104px] 2xl:max-w-[416px] xl:ml-0 xl:max-w-[400px] lg:max-w-none">
          <Heading tag="h2" size="xl" theme="black">
            On-demand scalability
          </Heading>
          <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
            We separate storage and compute to make on-demand scalability possible. Compute
            activates on an incoming connection and scales to zero when not in use.
          </p>
          <p className="t-xl mt-5 2xl:mt-4 xl:mt-3">
            Compute is fully client-compatible with Postgres because a Neon compute is Postgres.
          </p>
          <p className="t-xl mt-5 2xl:mt-4 xl:mt-3">
            Neon dynamically adjusts the allocation of compute resources based on workload.
          </p>
          {/* <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-secondary-3">
            Explore Neon&apos;s architecture
          </Link> */}
        </div>
        <div
          className="relative w-full max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px] xl:max-w-[465px] lg:-ml-3 lg:mt-[46px] lg:max-w-[475px] md:-ml-2"
          ref={illustrationWrapperRef}
          aria-hidden
        >
          <img
            src="data:image/svg+xml;charset=utf-8,%3Csvg width='880' height='800' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
            alt=""
          />
          {isSectionInView && <Illustration isInView={isIllustrationWrapperInView} />}
        </div>
      </Container>
    </section>
  );
};

export default Scalability;
