import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const CTA = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleButtonClick = () => {
    if (!isCopied) {
      copyToClipboard('psql -h lb.zenith.tech', { onCopy: setIsCopied(true) });
    }
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  return (
    <section className="text-center bg-black pt-[340px] safe-paddings 3xl:pt-[280px]">
      <Container>
        <Heading tag="h2" size="lg" theme="white">
          Made for Developers
        </Heading>
        <p className="mt-5 text-white t-3xl">
          Just use a single command from CLI to create new Zenith database
        </p>
        <div className="relative max-w-[860px] mx-auto 3xl:max-w-[716px] before:absolute before:-bottom-3.5 before:-left-3.5 before:w-full before:h-full before:bg-primary-1 before:rounded-full">
          <div className="relative flex items-center justify-between p-2 mt-8 bg-white border-4 border-black rounded-full pl-9">
            <span className="font-mono t-3xl">$ psql -h lb.zenith.tech</span>
            <Button className="relative" size="sm" theme="secondary" onClick={handleButtonClick}>
              <span className={clsx({ 'opacity-0': isCopied })}>Copy</span>
              <span
                className={clsx(
                  'absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-0',
                  { 'opacity-100': isCopied }
                )}
              >
                Copied!
              </span>
            </Button>
          </div>
        </div>
        <p className="max-w-[500px] text-white t-xl mt-[56px] mx-auto">
          Same PostgreSQL command as you used to will get you{' '}
          <Link to="/" theme="underline-primary-1">
            a smooth database creation
          </Link>{' '}
          experience.
        </p>
      </Container>
    </section>
  );
};

export default CTA;
