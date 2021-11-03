import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const DataBranching = () => (
  <section className="mt-[270px]">
    <Container>
      <div className="max-w-[600px]">
        <Heading tag="h2" size="lg" theme="black">
          Data Branching
        </Heading>
        <p className="mt-8 t-xl">
          Zenith storage allows users to branch the entire Postgres cluster, making it ideal for
          developer, staging, and production environments. Use CLI from your CI/CD process to create
          a new branch from the current environment for every deploy preview.
        </p>
        <Link className="mt-6" to="/" size="md" theme="black-primary-1">
          Getting started with data branching
        </Link>
      </div>
    </Container>
    <StaticImage
      className="!block max-w-[1920px] mt-[-365px] mx-auto"
      src="../data-branching/images/illustration.png"
      alt=""
      aria-hidden
    />
  </section>
);

export default DataBranching;
