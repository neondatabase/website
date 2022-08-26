import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';

const Hero = () => (
  <section className="grow pt-28 pb-24 lg:pt-0 md:py-14 xs:pt-10">
    <Container className="grid grid-cols-12 items-center gap-x-8 md:gap-x-0" size="md">
      <div className="col-start-2 col-end-6 2xl:col-start-1 md:col-span-full">
        <h1 className="text-[58px] font-bold leading-none xl:text-5xl xl:leading-none md:text-4xl">
          Ooops!
          <br /> Page not found...
        </h1>
        <p className="t-xl mt-11 lg:mt-8">
          Sorry, the page you are looking for doesn’t exist or has been moved. We suggest you back
          to home.
        </p>
        <Button className="mt-11 lg:mt-8" size="md" theme="primary" to="/">
          Back to Home
        </Button>
      </div>
      <div className="col-start-6 col-end-12 2xl:col-end-13 md:col-span-full">
        <StaticImage
          className="w-full md:mx-auto md:max-w-xl"
          width={860}
          height={862}
          src="./images/illustration.jpg"
          alt="Illustration"
          loading="eager"
        />
      </div>
    </Container>
  </section>
);

export default Hero;
