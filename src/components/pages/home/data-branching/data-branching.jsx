import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const DataBranching = () => (
  <section className="mt-[270px] safe-paddings 3xl:mt-44 2xl:mt-40">
    <Container>
      <div className="max-w-[600px]">
        <Heading tag="h2" size="lg" theme="black">
          Data Branching
        </Heading>
        <p className="mt-8 t-xl 3xl:max-w-[504px] 2xl:max-w-[416px] 2xl:mt-7">
          Zenith storage allows users to branch the entire Postgres cluster, making it ideal for
          developer, staging, and production environments. Use CLI from your CI/CD process to create
          a new branch from the current environment for every deploy preview.
        </p>
        <Link className="mt-6 2xl:mt-5" to="/" size="md" theme="black-primary-1">
          Getting started with data branching
        </Link>
      </div>
    </Container>
    <StaticImage
      className="!block max-w-[1920px] mt-[-365px] mx-auto z-[-2] 3xl:mt-[-310px] 2xl:mt-[-250px]"
      src="../data-branching/images/illustration.jpg"
      alt=""
      aria-hidden
    />
  </section>
);

export default DataBranching;
