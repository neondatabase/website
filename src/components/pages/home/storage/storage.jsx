import React from 'react';
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
          <Heading className="max-w-[370px] lg:max-w-none" tag="h2" size="lg" theme="black">
            Elastic Storage
          </Heading>
          <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
            Neon stores data across a fault tolerant scale-out Storage built from ground up. It
            integrates with S3 to store cold data for cost optimization. This architecture ensures
            high availability and makes Neon storage &quot;bottomless&quot;. Neon handles backups
            and checkpoints and provides point-in-time recovery out-of-the-box. Neon Storage is
            implemented in Rust.
          </p>
          {/* <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-secondary-5">
            How do we cook PostgreSQL storage
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
