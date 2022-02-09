import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const DataBranching = () => (
  <section className="safe-paddings mt-[270px] mb-48 3xl:my-44 2xl:my-40 xl:my-32 lg:my-24 md:my-20">
    <Container className="z-10" size="md">
      <div className="max-w-[600px] xl:max-w-[400px] lg:max-w-none">
        <Heading tag="h2" size="lg" theme="black">
          Data Branching
        </Heading>
        <p className="t-xl mt-8 3xl:max-w-[504px] 2xl:mt-7 2xl:max-w-[416px] xl:mt-6 lg:max-w-none">
          Zenith storage allows users to branch the entire Postgres cluster, making it ideal for
          developer, staging, and production environments. Use CLI from your CI/CD process to create
          a new branch from the current environment for every deploy preview.
        </p>
        <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-primary-1">
          Getting started with data branching
        </Link>
      </div>
    </Container>
    <div className="relative mx-auto max-w-[1920px] lg:flex lg:justify-end" aria-hidden>
      <StaticImage
        className="z-[-2] mt-[-365px] !block max-w-full 3xl:mt-[-19.38vw] 2xl:mt-[-18.94vw] xl:mt-[-18.55vw] lg:-mt-5 lg:min-w-[865px] md:mt-5 md:min-w-[767px] md:flex-shrink-0 sm:mt-[40px] sm:min-w-[700px] xs:min-w-[550px]"
        src="../data-branching/images/data-branching-illustration.jpg"
        alt=""
        loading="lazy"
      />
      <div className="absolute top-[209px] right-px h-3 w-screen translate-x-full bg-secondary-1 3xl:hidden" />
      <div className="absolute bottom-[339px] left-px h-3 w-screen -translate-x-full bg-black 3xl:hidden" />
      <div className="absolute bottom-[339px] right-px h-3 w-screen translate-x-full bg-black 3xl:hidden" />
      <div className="absolute bottom-[162px] right-px h-3 w-screen translate-x-full bg-black 3xl:hidden" />
    </div>
  </section>
);

export default DataBranching;
