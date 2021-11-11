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
    <section className="text-center bg-black pt-[504px] safe-paddings 3xl:pt-[397px] 2xl:pt-[344px] xl:pt-[310px] lg:pt-[238px] md:pt-[130px]">
      <Container className="z-20">
        <Heading id="cta-title" tag="h2" size="lg" theme="white">
          Made for Developers
        </Heading>
        <p className="mt-5 text-white t-3xl 2xl:mt-4">
          Just use a single command from CLI to create new Zenith database
        </p>
        <div
          id="cta-input"
          className="relative max-w-[860px] mt-8 mx-auto 3xl:max-w-[716px] 2xl:max-w-[592px] 2xl:mt-7 xl:max-w-[498px] xl:mt-6 lg:max-w-[584px]"
        >
          <div
            id="cta-input-background"
            className="absolute -bottom-3.5 -left-3.5 w-full h-full bg-primary-1 rounded-full 2xl:-bottom-2.5 2xl:-left-2.5 xl:-bottom-2 xl:-left-2 md:w-[calc(100%+8px)]"
          />
          <div className="relative flex items-center justify-between p-2 bg-white border-4 border-black rounded-full pl-9 2xl:p-1.5 2xl:pl-7 xl:p-1 xl:pl-6 md:py-[22px] md:px-0 md:justify-center">
            <span className="font-mono t-3xl !leading-none">$ psql -h lb.zenith.tech</span>
            <Button
              className="relative md:hidden"
              size="sm"
              theme="secondary"
              onClick={handleButtonClick}
            >
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
        <p
          id="cta-bottom-text"
          className="max-w-[500px] text-white t-xl mt-[56px] mx-auto 2xl:max-w-[450px] 2xl:mt-[46px] xl:mt-10 xl:max-w-[400px]"
        >
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
