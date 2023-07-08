'use client';

import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
// import Link from 'components/shared/link';

import Illustration from './storage-illustration';

const Storage = () => {
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
      <Container className="flex items-center justify-between lg:flex-col lg:items-start" size="md">
        <div className="mr-[110px] max-w-[600px] 3xl:mr-[86px] 3xl:max-w-[504px] 2xl:mr-[72px] 2xl:max-w-[416px] xl:mr-0 xl:max-w-[400px] lg:max-w-none">
          <Heading className="max-w-[370px] lg:max-w-none" tag="h2" size="xl" theme="black">
            Bottomless storage
          </Heading>
          <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
            We designed our storage from the ground up as a fault tolerant scale-out system built
            for the cloud. It integrates with cloud object stores such as S3 to offload cold data
            for cost optimization. Our storage architecture ensures high availability, scale out,
            and unlimited capacity that we call &quot;bottomless storage&quot;.
          </p>
          <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
            Neon storage uses the "copy-on-write" technique to deliver data branching, online
            checkpointing, and point-in-time restore. This eliminates expensive full-data backup and
            restore operations required with traditional database-as-a-service systems.
          </p>
          <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
            Our storage technology is open source and written in Rust.
          </p>
          {/* <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-secondary-5">
            How do we cook Postgres storage
          </Link> */}
        </div>

        <div
          className="relative order-first w-full max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px] xl:max-w-[465px] lg:order-last lg:mt-[46px] lg:max-w-[475px]"
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

export default Storage;
