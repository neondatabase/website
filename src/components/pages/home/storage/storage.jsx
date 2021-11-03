import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const Storage = () => (
  <section className="mt-48">
    <Container>
      <div className="grid grid-cols-12 gap-x-10 items-center">
        <div className="col-span-7">
          <StaticImage
            className="max-w-[880px]"
            src="./images/illustration-storage.png"
            alt=""
            aria-hidden
          />
        </div>
        <div className="col-span-5 max-w-[600px]">
          <Heading tag="h2" size="lg" theme="black">
            Unlimited
            <br />
            Storage
          </Heading>
          <p className="t-xl mt-8">
            Zenith redistributes data across a fault-tolerant storage cluster written in rust, which
            takes care of high-availability and effectively makes the database instances on top of
            it "bottomless". Backups, checkpoints, integration with S3 and point-in-time recovery
            are automatically handled by the zenith storage itself.
          </p>
          <Link className="mt-6" to="/" size="md" theme="black-secondary-5">
            How do we cook PostgreSQL storage
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default Storage;
