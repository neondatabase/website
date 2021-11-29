import React from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import Illustration from './data-branching-illustration';

const DataBranching = () => {
  const [wrapperRef, isSectionInView] = useInView({ rootMargin: '100px 0px', triggerOnce: true });

  return (
    <section
      className="mt-[270px] mb-48 safe-paddings 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20"
      ref={wrapperRef}
    >
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
      {isSectionInView && <Illustration />}
    </section>
  );
};

export default DataBranching;
