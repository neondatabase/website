'use client';

import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import links from 'constants/links';
import lines from 'images/pages/pricing/green-lines-small.svg';

const CTA = () => (
  <section className="safe-paddings pt-16">
    <Container className="grid grid-cols-12 items-center gap-4" size="md">
      <div className="z-10 col-span-4 col-start-2 mb-24 xl:col-span-5 xl:col-start-1 lg:col-span-full">
        <Heading className="whitespace-nowrap lg:text-center" tag="h2" size="2sm">
          Still have a <span className="text-pricing-primary-1">question?</span>
        </Heading>
        <p className="mt-4 text-lg font-light leading-snug xl:text-base lg:text-center">
          Interested in increasing your free tier limits or learning about pricing? Complete the
          form below to get in touch with our Sales team
        </p>
        <p className="relative mt-8 inline-flex justify-center lg:mx-auto lg:flex lg:w-44">
          <Button
            className="relative z-20 !py-5 !px-14 !text-lg tracking-tight"
            theme="primary"
            to={links.contactSales}
            size="sm"
          >
            Talk to sales
          </Button>
          <img
            className="pointer-events-none absolute -top-7 left-1/2 z-10 min-w-[130%] -translate-x-1/2"
            src={lines}
            width={267}
            height={140}
            alt=""
          />
        </p>
      </div>
      <div className="col-span-7 col-start-6 lg:col-span-full">
        <Image
          className="mx-auto"
          src="/images/pages/pricing/cta.jpg"
          width={842}
          height={538}
          alt=""
        />
      </div>
    </Container>
  </section>
);

export default CTA;
