import Image from 'next/image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';

import illustration from './images/illustration.png';

const CTA = () => (
  <section className="cta safe-paddings overflow-x-hidden bg-black pt-[200px] text-white 2xl:pt-36 xl:pt-32 lg:pt-28 md:pt-20">
    <Container
      className="flex items-center justify-between space-x-10 lg:flex-col lg:justify-center lg:space-y-16 lg:space-x-0 md:space-y-10"
      size="sm"
    >
      <div className="max-w-[661px] shrink-0 pb-16 xl:max-w-[400px] xl:pb-0 lg:text-center">
        <Heading
          className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-[56px] lg:text-[44px]"
          tag="h2"
        >
          Try branching in your project now
        </Heading>
        <Button
          className="mt-9 py-6 px-9 !text-lg xl:!text-base lg:py-5 lg:px-8"
          theme="primary"
          to={LINKS.signup}
          size="sm"
        >
          Try branching now
        </Button>
      </div>
      <Image
        className="lg:max-w-[464px]"
        src={illustration}
        width={752}
        height={567}
        alt=""
        sizes="100%"
        loading="lazy"
        aria-hidden
      />
    </Container>
  </section>
);

export default CTA;
