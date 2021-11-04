import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const Scalability = () => (
  <section className="mt-48 safe-paddings 3xl:mt-44 2xl:mt-40">
    <Container className="flex items-center justify-between">
      <div className="max-w-[600px] ml-[150px] 3xl:max-w-[504px] 3xl:ml-[126px] 2xl:max-w-[416px] 2xl:ml-[104px]">
        <Heading tag="h2" size="lg" theme="black">
          On Demand Scalability
        </Heading>
        <p className="mt-8 t-xl 2xl:mt-7">
          Zenith compute node is a modified postgres instance which is used only to process data
          retrieved from the multi-tenant storage. Compute node is swift to start and can be
          reconfigured on the fly. Without any activity compute shuts down to save resources and
          will be started on any incoming connection.
        </p>
        <p className="mt-5 t-xl 2xl:mt-4">
          While compute node is a modified postgres it is still fully app-compatible with the
          vanilla postgres. And we are committed to bring back our changes back to the community.
        </p>
        <Link className="mt-6 2xl:mt-5" to="/" size="md" theme="black-secondary-3">
          Explore Zenith's architecture
        </Link>
      </div>
      <StaticImage
        className="max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px]"
        src="../scalability/images/illustration.jpg"
        alt=""
        aria-hidden
      />
    </Container>
  </section>
);

export default Scalability;
