import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const Storage = () => (
  <section className="mt-48 safe-paddings 3xl:mt-44 2xl:mt-40 xl:mt-32">
    <Container className="flex items-center justify-between">
      <StaticImage
        className="max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px] xl:max-w-[465px]"
        src="../storage/images/illustration.jpg"
        alt=""
        aria-hidden
      />
      <div className="max-w-[600px] mr-[110px] 3xl:max-w-[504px] 3xl:mr-[86px] 2xl:max-w-[416px] 2xl:mr-[72px] xl:max-w-[400px] xl:mr-0">
        <Heading className="max-w-[370px]" tag="h2" size="lg" theme="black">
          Unlimited Storage
        </Heading>
        <p className="mt-8 t-xl 2xl:mt-7 xl:mt-6">
          Zenith redistributes data across a fault-tolerant storage cluster written in rust, which
          takes care of high-availability and effectively makes the database instances on top of it
          "bottomless". Backups, checkpoints, integration with S3 and point-in-time recovery are
          automatically handled by the zenith storage itself.
        </p>
        <Link className="mt-6 2xl:mt-5 xl:mt-4" to="/" size="md" theme="black-secondary-5">
          How do we cook PostgreSQL storage
        </Link>
      </div>
    </Container>
  </section>
);

export default Storage;
