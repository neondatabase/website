import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-white xl:pt-36 lg:pt-12 md:pt-6">
    <Container size="md">
      <h1 className="t-5xl text-center font-bold">Become a part of our team </h1>
      <p className="t-lg mx-auto mt-8 max-w-[1160px] text-center !leading-normal 2xl:mt-7 xl:mt-6">
        Zenith Labs builds an open source alternative to AWS Aurora. It's founded by Nikita
        Shamgunov, Heikki Linnakangas and Stas Kelvich - key Postgres committers. The vision is to
        make Postgres cloud native and provide true open source alternative to AWS Aurora which is
        present on all the cloud. This work requires to build a lot latency distributed cloud native
        storage which integrates well with Postgres and allows for efficient management of a fleet
        of databases.
      </p>
      <div className="-mt-16 translate-y-32 lg:-mt-12 lg:translate-y-24 md:-mt-8 md:flex md:translate-y-16 md:justify-center">
        <StaticImage
          className="rounded-md md:min-w-[600px]"
          src="./images/illustration.jpg"
          alt=""
          imgClassName="rounded-md"
          aria-hidden
        />
      </div>
    </Container>
  </section>
);

export default Hero;
