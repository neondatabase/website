import copyToClipboard from 'copy-to-clipboard';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const CTA = () => (
  <section className="text-center text-white bg-black pt-[340px]">
    <Container>
      <Heading tag="h2" size="lg" theme="white">
        Made for Developers
      </Heading>
      <p className="mt-5 t-3xl">Just use a single command from CLI to create new Zenith database</p>
      <div className="relative max-w-[860px] mx-auto before:absolute before:-bottom-3.5 before:-left-3.5 before:w-full before:h-full before:bg-primary-1 before:rounded-full">
        <div className="relative flex items-center justify-between p-2 mt-8 bg-white border-4 border-black rounded-full pl-9">
          <span className="font-mono text-black t-3xl">$ psql -h lb.zenith.tech</span>
          <Button
            size="sm"
            theme="secondary"
            onClick={() => copyToClipboard('psql -h lb.zenith.tech')}
          >
            Copy
          </Button>
        </div>
      </div>
      <p className="max-w-[500px] t-xl mt-[56px] mx-auto">
        Same PostgreSQL command as you used to will get you{' '}
        <Link to="/" theme="underline-primary-1">
          a smooth database creation
        </Link>{' '}
        experience.
      </p>
    </Container>
  </section>
);

export default CTA;
