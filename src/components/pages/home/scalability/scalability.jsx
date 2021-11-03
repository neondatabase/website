import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const Scalability = () => (
  <section className="mt-48">
    <Container>
      <div className="grid grid-cols-12 gap-x-10 items-center">
        <div className="col-start-2 col-end-7 max-w-[600px]">
          <Heading tag="h2" size="lg" theme="black">
            On Demand Scalability
          </Heading>
          <p className="t-xl mt-8">
            Zenith compute node is a modified postgres instance which is used only to process data
            retrieved from the multi-tenant storage. Compute node is swift to start and can be
            reconfigured on the fly. Without any activity compute shuts down to save resources and
            will be started on any incoming connection.
          </p>
          <p className="t-xl mt-5">
            While compute node is a modified postgres it is still fully app-compatible with the
            vanilla postgres. And we are committed to bring back our changes back to the community.
          </p>
          <Link className="mt-6" to="/" size="md" theme="black-secondary-3">
            Explore Zenith's architecture
          </Link>
        </div>
        <div className="col-span-6">
          <StaticImage
            className="-ml-5"
            src="./images/illustration-scalability.png"
            alt=""
            aria-hidden
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Scalability;
