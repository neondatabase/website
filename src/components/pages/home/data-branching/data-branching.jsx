import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const DataBranching = () => (
  <section className="mt-64">
    <Container>
      <div className="relative grid grid-cols-12 gap-x-10 items-center z-10">
        <div className="col-span-5 max-w-[600px]">
          <Heading tag="h2" size="lg" theme="black">
            Data Branching
          </Heading>
          <p className="t-xl mt-8">
            Zenith storage allows users to branch the entire Postgres cluster, making it ideal for
            developer, staging, and production environments. Use CLI from your CI/CD process to
            create a new branch from the current environment for every deploy preview.
          </p>
          <Link className="mt-6" to="/" size="md" theme="black-primary-1">
            Getting started with data branching
          </Link>
        </div>
      </div>
    </Container>
    <StaticImage
      className="mt-[-18.8vw]"
      src="./images/illustration-data-branching.png"
      alt=""
      aria-hidden
    />
  </section>
);

export default DataBranching;
